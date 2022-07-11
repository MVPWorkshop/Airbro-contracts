// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/AirdropInfoSMCampaign.sol";
import "../interfaces/AirdropMerkleProof.sol";
import "../interfaces/IAirBroFactory.sol";

/// @title Airdrops existing ERC20 tokens for airdrop recipients
contract ExistingTokenDropSMCampaign is AirdropInfoSMCampaign, AirdropMerkleProof, Ownable  {
    using SafeERC20 for IERC20;

    ERC1155 public immutable rewardedNft;
    IERC20 public immutable rewardToken;
    uint256 public immutable tokensPerClaim;
    uint256 public immutable airdropDuration;
    uint256 public immutable airdropStartTime;
    uint256 public immutable airdropFinishTime;
    uint256 public immutable totalAirdropAmount;
    address public immutable airBroFactorySMCampaignAddress;

    bool public airdropFunded;
    uint256 public airdropFundBlockTimestamp;
    address internal airdropFundingHolder;

    // The root hash of the Merle Tree we previously generated in our JavaScript code. Remember
    // to provide this as a bytes32 type and not string. Ox should be prepended.
    bytes32 public merkleRoot;

    mapping(address => bool) public hasClaimed;


    event Claimed(address indexed claimer);
    event AirdropFunded(address contractAddress);
    event MerkleRootChanged(bytes32 merkleRoot);

    error AirdropStillInProgress();
    error AlreadyRedeemed();
    error AlreadyFunded();
    error InsufficientAmount();
    error InsufficientLiquidity();
    error AirdropExpired();
    error NotEligible();
    error Unauthorized();
    

    modifier onlyAdmin() {
        if (msg.sender != IAirBroFactory(airBroFactorySMCampaignAddress).admin()) revert Unauthorized();
        _;
    }

    constructor(
        address _rewardedNft,
        uint256 _tokensPerClaim,
        address _rewardToken,
        uint256 _totalAirdropAmount,
        uint256 _airdropDuration,
        address _airBroFactorySMCampaignAddress
    ) {
        rewardedNft = ERC1155(_rewardedNft);
        tokensPerClaim = _tokensPerClaim;
        totalAirdropAmount = _totalAirdropAmount;
        rewardToken = IERC20(_rewardToken);
        airdropDuration = _airdropDuration * 1 days;
        airdropStartTime = block.timestamp;
        airdropFinishTime = block.timestamp + airdropDuration;
        airBroFactorySMCampaignAddress = _airBroFactorySMCampaignAddress;
    }

    /// @notice Sets the merkleRoot - can only be done if admin (different from the contract owner)
    /// @param _merkleRoot The root hash of the Merle Tree
    function setMerkleRoot(bytes32 _merkleRoot) external onlyAdmin {
        merkleRoot = _merkleRoot;
        emit MerkleRootChanged(_merkleRoot);
    }

    /// @notice Allows the airdrop creator to provide funds for airdrop reward
    function fundAirdrop() external {
        if (airdropFunded) revert AlreadyFunded();
        
        airdropFunded = true;
        airdropFundBlockTimestamp = block.timestamp;
        airdropFundingHolder = msg.sender;

        rewardToken.safeTransferFrom(msg.sender, address(this), totalAirdropAmount);
        emit AirdropFunded(address(this));
    }

    /// @notice Allows the airdrop creator to withdraw back his funds after the airdrop has finished
    function withdrawAirdropFunds() external {
        if (airdropFundingHolder != msg.sender) revert Unauthorized();
        if (block.timestamp < airdropFinishTime) revert AirdropStillInProgress();

        rewardToken.safeTransfer(msg.sender, rewardToken.balanceOf(address(this)));
    }

    /// @notice Allows the NFT holder to claim his ERC20 airdrop
    /// @param _merkleProof The proof a user can claim a reward
    function claim(bytes32[] calldata _merkleProof) external {
        if (isEligibleForReward(_merkleProof)) {
            hasClaimed[msg.sender] = true;
            rewardToken.safeTransfer(msg.sender, tokensPerClaim);
            emit Claimed(msg.sender);
        } else {
            revert NotEligible();
        }
    }


    /// @notice Get the type of airdrop, it's either ERC20, ERC721, ERC1155
    function getAirdropType() external pure override returns (string memory) {
        return "ERC20";
    }

    /// @notice Checks if the user is eligible for this airdrop
    /// @param _merkleProof The proof a user can claim a reward
    function isEligibleForReward(bytes32[] calldata _merkleProof) public view returns (bool) {
        if (hasClaimed[msg.sender]) revert AlreadyRedeemed();
        if (block.timestamp > airdropFinishTime) revert AirdropExpired();
        if (rewardToken.balanceOf(address(this)) < tokensPerClaim) revert InsufficientLiquidity();
        return checkProof(_merkleProof, merkleRoot);
    }

    /// @notice Returns the amount of airdrop tokens a user can claim
    /// @param _merkleProof The proof a user can claim a reward
    function getAirdropAmount(bytes32[] calldata _merkleProof) external view returns (uint256) {
        return isEligibleForReward(_merkleProof) ? tokensPerClaim : 0;
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
