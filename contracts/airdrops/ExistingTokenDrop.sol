// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title Airdrops existing ERC20 tokens for airdrop recipients
contract ExistingTokenDrop {
    using SafeERC20 for IERC20;

    IERC721 public immutable rewardedNft;
    IERC20 public immutable rewardToken;
    uint256 public immutable tokensPerClaim;
    uint256 public immutable totalAirdropAmount;
    uint256 public immutable airdropDuration;
    uint256 public immutable airdropStartTime;
    uint256 public immutable airdropFinishTime;

    mapping(uint256 => bool) public hasClaimed;
    string public constant airdropType = "ERC20";
    uint256 public airdropFundBlockTimestamp;
    bool public airdropFunded;

    address internal airdropFundingHolder;

    event Claimed(uint256 indexed tokenId, address indexed claimer);
    event AirdropFunded(address contractAddress);

    error AirdropStillInProgress();
    error AlreadyRedeemed();
    error AlreadyFunded();
    error AirdropExpired();
    error Unauthorized();

    constructor(
        address _rewardedNft,
        uint256 _tokensPerClaim,
        address _rewardToken,
        uint256 _totalAirdropAmount,
        uint256 _airdropDuration
    ) {
        rewardedNft = IERC721(_rewardedNft);
        tokensPerClaim = _tokensPerClaim;
        totalAirdropAmount = _totalAirdropAmount;
        rewardToken = IERC20(_rewardToken);
        airdropDuration = _airdropDuration * 1 days;
        airdropStartTime = block.timestamp;
        airdropFinishTime = block.timestamp + airdropDuration;
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

    /// @notice Allows the airdrop creator to withdraw back the funds after the airdrop has finished
    function withdrawAirdropFunds() external {
        if (airdropFundingHolder != msg.sender) revert Unauthorized();
        if (block.timestamp < airdropFinishTime) revert AirdropStillInProgress();

        rewardToken.safeTransfer(msg.sender, rewardToken.balanceOf(address(this)));
    }

    /// @notice Allows the NFT holder to claim their ERC20 airdrop
    /// @param tokenId is the rewarded NFT collections token ID
    function claim(uint256 tokenId) external {
        validateClaim(tokenId);
        if (block.timestamp > airdropFinishTime) revert AirdropExpired();

        hasClaimed[tokenId] = true;
        rewardToken.safeTransfer(msg.sender, tokensPerClaim);
        emit Claimed(tokenId, msg.sender);
    }

    /// @notice Claim multiple ERC20 airdrops at once
    /// @param tokenIds are the rewarded NFT collections token ID's
    function batchClaim(uint256[] memory tokenIds) external {
        if (block.timestamp > airdropFinishTime) revert AirdropExpired();

        for (uint256 index = 0; index < tokenIds.length; index++) {
            uint256 tokenId = tokenIds[index];

            validateClaim(tokenId);

            hasClaimed[tokenId] = true;
            emit Claimed(tokenId, msg.sender);
        }

        rewardToken.safeTransfer(msg.sender, tokensPerClaim * tokenIds.length);
    }

    /// @notice Checks if the user is eligible for this airdrop
    /// @param tokenId is the rewarded NFT token ID
    /// @return bool if user is eligible for reward
    function isEligibleForReward(uint256 tokenId) public view returns (bool) {
        if ((block.timestamp > airdropFinishTime) || (hasClaimed[tokenId]) || (rewardedNft.ownerOf(tokenId) != msg.sender)) {
            return false;
        }
        return true;
    }

    /// @notice Validation for claiming a reward (excluding the block.timestamp check)
    /// @param tokenId is the rewarded NFT collections token ID
    function validateClaim(uint256 tokenId) internal view {
        if (hasClaimed[tokenId]) revert AlreadyRedeemed();
        if (rewardedNft.ownerOf(tokenId) != msg.sender) revert Unauthorized();
    }

    /// @notice Returns the amount of airdrop tokens a user can claim
    function getAirdropAmount() external view returns (uint256) {
        return rewardedNft.balanceOf(msg.sender) * tokensPerClaim;
    }
}
