// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/AirdropInfo1155.sol";
import "../interfaces/AirdropMerkleProof.sol";
import "../interfaces/IAirBroFactory.sol";

/// @title Airdrops existing ERC20 tokens for airdrop recipients
contract ExistingTokenDrop1155 is AirdropInfo1155, AirdropMerkleProof, Ownable {
    ERC1155 public immutable rewardedNft;
    IERC20 public immutable rewardToken;
    uint256 public immutable tokensPerClaim;
    uint256 public immutable totalAirdropAmount;

    bool public airdropFunded = false;
    uint256 public airdropFundBlockTimestamp;
    address internal airdropFundingHolder;
    address public immutable airBroFactory1155HolderAddress;

    event Claimed(address indexed claimer);
    event AirdropFunded();
    event MerkleRootChanged(bytes32 merkleRoot);


    error NotOwner();
    error AirdropStillInProgress();
    error AlreadyRedeemed();
    error AlreadyFunded();
    error InsufficientAmount();
    error InsufficientLiquidity();
    error AirdropExpired();
    error NotAdmin();

    mapping(address => bool) public hasClaimed;

    // The root hash of the Merle Tree we previously generated in our JavaScript code. Remember
    // to provide this as a bytes32 type and not string. Ox should be prepended.
    bytes32 public merkleRoot;

    uint256 public immutable airdropDuration;
    uint256 public immutable airdropStartTime;
    uint256 public immutable airdropFinishTime;

    modifier onlyAdmin(){
        if(msg.sender != IAirBroFactory(airBroFactory1155HolderAddress).admin()) revert NotAdmin();
        _;
    }

    constructor(
        address _rewardedNft,
        uint256 _tokensPerClaim,
        address _rewardToken,
        uint256 _totalAirdropAmount,
        uint256 _airdropDuration,
        address _airBroFactory1155HolderAddress
    ) {
        rewardedNft = ERC1155(_rewardedNft);
        tokensPerClaim = _tokensPerClaim;
        totalAirdropAmount = _totalAirdropAmount;
        rewardToken = IERC20(_rewardToken);
        airdropDuration = _airdropDuration * 1 days;
        airdropStartTime = block.timestamp;
        airdropFinishTime = block.timestamp + airdropDuration;
        airBroFactory1155HolderAddress = _airBroFactory1155HolderAddress;
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
        rewardToken.transferFrom(msg.sender, address(this), totalAirdropAmount);
        airdropFunded = true;
        airdropFundBlockTimestamp = block.timestamp;
        airdropFundingHolder = msg.sender;
        emit AirdropFunded();
    }

    /// @notice Allows the airdrop creator to withdraw back his funds after the airdrop has finished
    function withdrawAirdropFunds() external {
        if (airdropFundingHolder != msg.sender) revert NotOwner();
        if (block.timestamp < airdropFinishTime) revert AirdropStillInProgress();
        rewardToken.transfer(msg.sender, rewardToken.balanceOf(address(this)));
    }

    /// @notice Allows the NFT holder to claim his ERC20 airdrop
    function claim(bytes32[] calldata _merkleProof) external {
        if (hasClaimed[msg.sender]) revert AlreadyRedeemed(); // treba da prima adresu osobe
        if (rewardToken.balanceOf(address(this)) < tokensPerClaim) revert InsufficientLiquidity();
        // if (rewardedNft.ownerOf(tokenId) != msg.sender) revert NotOwner(); //not used
        if (block.timestamp > airdropFinishTime) revert AirdropExpired();

        checkProof(_merkleProof, merkleRoot);

        hasClaimed[msg.sender] = true; // nek se izvrti u odnosu na adresu true
        emit Claimed(msg.sender);

        rewardToken.transfer(msg.sender, tokensPerClaim);
    }


    //@notice Get the type of airdrop, it's either ERC20, ERC721, ERC1155
    function getAirdropType() external pure override returns (string memory) {
        return "ERC20";
    }

    //@notice Checks if the user is eligible for this airdrop
    function isEligibleForReward(bytes32[] calldata _merkleProof) public returns (bool) {
        if (hasClaimed[msg.sender]) revert AlreadyRedeemed();
        if (rewardToken.balanceOf(address(this)) < tokensPerClaim) revert InsufficientLiquidity();
        // if (rewardedNft.ownerOf(tokenId) != msg.sender) revert NotOwner(); //not used
        checkProof(_merkleProof, merkleRoot); // implement this later
        return true;
    }

    //@notice Returns the amount(number) of airdrop tokens to claim
    //@param tokenId is the rewarded NFT collections token ID
    function getAirdropAmount(bytes32[] calldata _merkleProof) external returns (uint256) {
        return isEligibleForReward(_merkleProof) ? tokensPerClaim : 0;
    }

    function getAirdropFinishTime() external view override returns (uint256) {
        return airdropFinishTime;
    }

    function getAirdropDuration() external view override returns (uint256) {
        return airdropDuration;
    }

    function getAirdropStartTime() external view override returns (uint256) {
        return airdropStartTime;
    }
}
