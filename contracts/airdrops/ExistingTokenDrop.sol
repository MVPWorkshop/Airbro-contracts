// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/AirdropInfo.sol";
import "../interfaces/AirdropMerkleProof.sol";
import "../interfaces/IAirBroFactory.sol";

/// @title Airdrops existing ERC20 tokens for airdrop recipients
contract ExistingTokenDrop is AirdropInfo, AirdropMerkleProof, Ownable {
    IERC721 public immutable rewardedNft;
    IERC20 public immutable rewardToken;
    uint256 public immutable tokensPerClaim;
    uint256 public immutable totalAirdropAmount;
    uint256 public immutable airdropDuration;
    uint256 public immutable airdropStartTime;
    uint256 public immutable airdropFinishTime;
    address public immutable airBroFactoryAddress;

    bool public airdropFunded;
    uint256 public airdropFundBlockTimestamp;
    address internal airdropFundingHolder;

    // The root hash of the Merle Tree we previously generated in our JavaScript code. Remember
    // to provide this as a bytes32 type and not string. Ox should be prepended.
    bytes32 public merkleRoot;

    mapping(uint256 => bool) public hasClaimed;

    event Claimed(uint256 indexed tokenId, address indexed claimer);
    event AirdropFunded(address contractAddress);
    event MerkleRootChanged(bytes32 merkleRoot);

    error AirdropStillInProgress();
    error AlreadyRedeemed();
    error AlreadyFunded();
    error InsufficientAmount();
    error InsufficientLiquidity(); // remove this ??
    error AirdropExpired(); 
    error Unauthorized();

    modifier onlyAdmin() {
        if (msg.sender != IAirBroFactory(airBroFactoryAddress).admin()) revert Unauthorized();
        _;
    }

    constructor(
        address _rewardedNft,
        uint256 _tokensPerClaim,
        address _rewardToken,
        uint256 _totalAirdropAmount,
        uint256 _airdropDuration,
        address _airBroFactoryAddress
    ) {
        rewardedNft = IERC721(_rewardedNft);
        tokensPerClaim = _tokensPerClaim;
        totalAirdropAmount = _totalAirdropAmount;
        rewardToken = IERC20(_rewardToken);
        airdropDuration = _airdropDuration * 1 days;
        airdropStartTime = block.timestamp;
        airdropFinishTime = block.timestamp + airdropDuration;
        airBroFactoryAddress = _airBroFactoryAddress;
    }

    /// @notice Sets the merkleRoot - can only be done if admin (different from the contract owner)
    /// @param _merkleRoot - The root hash of the Merle Tree
    function setMerkleRoot(bytes32 _merkleRoot) external onlyAdmin {
        merkleRoot = _merkleRoot;
        emit MerkleRootChanged(_merkleRoot);
    }

    /// @notice Allows the airdrop creator to provide funds for airdrop reward
    function fundAirdrop() external {
        if (rewardToken.balanceOf(msg.sender) < totalAirdropAmount) revert InsufficientAmount();
        if (airdropFunded) revert AlreadyFunded();

        airdropFunded = true;
        airdropFundBlockTimestamp = block.timestamp;
        airdropFundingHolder = msg.sender;

        rewardToken.transferFrom(msg.sender, address(this), totalAirdropAmount);
        emit AirdropFunded(address(this));
    }

    /// @notice Allows the airdrop creator to withdraw back the funds after the airdrop has finished
    function withdrawAirdropFunds() external {
        if (airdropFundingHolder != msg.sender) revert Unauthorized();
        if (block.timestamp < airdropFinishTime) revert AirdropStillInProgress();

        rewardToken.transfer(msg.sender, rewardToken.balanceOf(address(this)));
    }

    /// @notice Allows the NFT holder to claim their ERC20 airdrop
    /// @param tokenId is the rewarded NFT collections token ID
    /// @param _merkleProof is the merkle proof that this user is eligible for claiming the ERC20 airdrop // ---- potentially remove this param !
    function claim(uint256 tokenId, bytes32[] calldata _merkleProof) external {
        if (hasClaimed[tokenId]) revert AlreadyRedeemed();
        if (rewardToken.balanceOf(address(this)) < tokensPerClaim) revert InsufficientLiquidity(); // remove this?
        if (rewardedNft.ownerOf(tokenId) != msg.sender) revert Unauthorized();
        if (block.timestamp > airdropFinishTime) revert AirdropExpired();

        checkProof(_merkleProof, merkleRoot);

        hasClaimed[tokenId] = true;
        rewardToken.transfer(msg.sender, tokensPerClaim);

        emit Claimed(tokenId, msg.sender);

    }

    /// @notice Claim multiple ERC20 airdrops at once
    /// @param tokenIds are the rewarded NFT collections token ID's
    /// @param _merkleProof is the merkle proof that this user is eligible for claiming the ERC20 airdrops // --- potentially remove this param !
    function batchClaim(uint256[] memory tokenIds, bytes32[] calldata _merkleProof) external {
        if (block.timestamp > airdropFinishTime) revert AirdropExpired();
        if (rewardToken.balanceOf(address(this)) < tokensPerClaim * tokenIds.length) revert InsufficientLiquidity();
        checkProof(_merkleProof, merkleRoot);

        for (uint256 index = 0; index < tokenIds.length; index++) { // maybe unchecked for this ?
            uint256 tokenId = tokenIds[index];

            if (hasClaimed[tokenId]) revert AlreadyRedeemed();
            if (rewardedNft.ownerOf(tokenId) != msg.sender) revert Unauthorized();

            hasClaimed[tokenId] = true;
            emit Claimed(tokenId, msg.sender);
        }

        rewardToken.transfer(msg.sender, tokensPerClaim * tokenIds.length);
    }

    /// @notice Get the type of airdrop, it's either ERC20, ERC721, ERC1155
    function getAirdropType() external pure override returns (string memory) {
        return "ERC20";
    }

    /// @notice Checks if the user is eligible for this airdrop
    /// @param tokenId is the rewarded NFT token ID
    function isEligibleForReward(uint256 tokenId) external view returns (bool) {
        if (block.timestamp > airdropFinishTime) revert AirdropExpired();
        if (hasClaimed[tokenId]) revert AlreadyRedeemed();
        if (rewardToken.balanceOf(address(this)) < tokensPerClaim) revert InsufficientLiquidity();
        if (rewardedNft.ownerOf(tokenId) != msg.sender) revert Unauthorized();
        return true;
    }

    /// @notice Returns the amount of airdrop tokens a user can claim
    function getAirdropAmount() external view returns (uint256) {
        return rewardedNft.balanceOf(msg.sender) * tokensPerClaim;
    }

    /// @notice Returns the airdrop ending timestamp in seconds
    function getAirdropFinishTime() external view override returns (uint256) {
        return airdropFinishTime;
    }

    /// @notice Returns the airdrop duration in seconds
    function getAirdropDuration() external view override returns (uint256) {
        return airdropDuration;
    }

    /// @notice Returns the airdrop starting timestamp in seconds
    function getAirdropStartTime() external view override returns (uint256) {
        return airdropStartTime;
    }
}
