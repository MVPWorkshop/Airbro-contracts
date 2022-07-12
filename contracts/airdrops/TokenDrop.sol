// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "@rari-capital/solmate/src/tokens/ERC20.sol";
import "@rari-capital/solmate/src/tokens/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/AirdropInfo.sol";
import "../interfaces/AirdropMerkleProof.sol";
import "../interfaces/IAirBroFactory.sol";

/// @title Airdrops new ERC20 tokens for airdrop recipients
contract TokenDrop is ERC20, AirdropInfo, AirdropMerkleProof, Ownable {
    IERC721 public immutable rewardedNft;
    uint256 public immutable tokensPerClaim;
    address public immutable airBroFactoryAddress;
    uint256 public immutable airdropDuration;
    uint256 public immutable airdropStartTime;
    uint256 public immutable airdropFinishTime;

    // The root hash of the Merle Tree we previously generated in our JavaScript code. Remember
    // to provide this as a bytes32 type and not string. Ox should be prepended.
    bytes32 public merkleRoot;

    mapping(uint256 => bool) public hasClaimed;

    event Claimed(uint256 indexed tokenId, address indexed claimer);
    event MerkleRootChanged(bytes32 merkleRoot);

    error AlreadyRedeemed();
    error AirdropExpired();
    error Unauthorized();

    modifier onlyAdmin() {
        if (msg.sender != IAirBroFactory(airBroFactoryAddress).admin()) revert Unauthorized();
        _;
    }

    constructor(
        address _rewardedNft,
        uint256 _tokensPerClaim,
        string memory name,
        string memory symbol,
        uint256 _airdropDuration,
        address _airBroFactoryAddress
    ) ERC20(name, symbol, 18) {
        rewardedNft = IERC721(_rewardedNft);
        tokensPerClaim = _tokensPerClaim;
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

    /// @notice Allows the NFT holder to claim their ERC20 airdrop
    /// @param tokenId is the rewarded NFT collections token ID
    /// @param _merkleProof is the merkle proof that this user is eligible for claiming the ERC20 airdrop // ---- potentially remove this param !
    function claim(uint256 tokenId, bytes32[] calldata _merkleProof) external {
        if (hasClaimed[tokenId]) revert AlreadyRedeemed();
        if (rewardedNft.ownerOf(tokenId) != msg.sender) revert Unauthorized();
        if (block.timestamp > airdropFinishTime) revert AirdropExpired();

        checkProof(_merkleProof, merkleRoot);

        hasClaimed[tokenId] = true;
        emit Claimed(tokenId, msg.sender);

        _mint(msg.sender, tokensPerClaim);
    }

    /// @notice Claim multiple ERC20 airdrops at once
    /// @param tokenIds are the rewarded NFT collections token ID's
    /// @param _merkleProof is the merkle proof that this user is eligible for claiming the ERC20 airdrops // ---- potentially remove this param !
    function batchClaim(uint256[] memory tokenIds, bytes32[] calldata _merkleProof) external {
        if (block.timestamp > airdropFinishTime) revert AirdropExpired();
        checkProof(_merkleProof, merkleRoot);

        for (uint256 index = 0; index < tokenIds.length; index++) {
            uint256 tokenId = tokenIds[index];

            if (hasClaimed[tokenId]) revert AlreadyRedeemed();
            if (rewardedNft.ownerOf(tokenId) != msg.sender) revert Unauthorized();

            hasClaimed[tokenId] = true;
            emit Claimed(tokenId, msg.sender);
        }

        _mint(msg.sender, tokensPerClaim * tokenIds.length);
    }

    /// @notice Get the type of airdrop, it's either ERC20, ERC721, ERC1155
    function getAirdropType() external pure returns (string memory) {
        return "ERC20";
    }

    /// @notice Checks if the user is eligible for this airdrop
    /// @param tokenId is the rewarded NFT token ID
    function isEligibleForReward(uint256 tokenId) external view returns (bool) {
        if (block.timestamp > airdropFinishTime) revert AirdropExpired(); // should I add this here ? Or just have one check in both claim methods?
        if (hasClaimed[tokenId]) revert AlreadyRedeemed();
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
