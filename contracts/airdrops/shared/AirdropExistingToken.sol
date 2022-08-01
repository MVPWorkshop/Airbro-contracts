// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./AirdropTimeData.sol";

abstract contract AirdropExistingToken is AirdropTimeData {
    IERC721 public immutable rewardedNft;
    uint256 public immutable tokensPerClaim;
    uint256 public immutable totalAirdropAmount;

    mapping(uint256 => bool) public hasClaimed;

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
        uint256 _totalAirdropAmount,
        uint256 _airdropDuration
    ) AirdropTimeData(_airdropDuration) {
        rewardedNft = IERC721(_rewardedNft);
        tokensPerClaim = _tokensPerClaim;
        totalAirdropAmount = _totalAirdropAmount;
    }

    /// @notice Performs checks and changes state associated with funding contracts
    /// @dev This method does deal with the transfer of tokens
    /// - the logic for this is handled in the child contract.
    function fundAirdropHandler() internal {
        if (airdropFunded) revert AlreadyFunded();

        airdropFunded = true;
        airdropFundBlockTimestamp = block.timestamp;
        airdropFundingHolder = msg.sender;

        emit AirdropFunded(address(this));
    }

    /// @notice Performs checks associated with the funder withdrawing funds from the contract.
    /// @dev This method does not deal with the transfer of tokens
    /// - the logic for this is handled in the child contract.
    function withdrawAirdropFundsHandler() internal view {
        if (airdropFundingHolder != msg.sender) revert Unauthorized();
        if (block.timestamp < airdropFinishTime) revert AirdropStillInProgress();
    }

    /// @notice Performs checks and changes state associated with claiming an ERC20 airdrop
    /// @dev This method does deal with the transfer of tokens
    /// - the logic for this is handled in the child contract.
    /// @param tokenId is the rewarded NFT collections token ID
    function claimHandler(uint256 tokenId) internal {
        validateClaim(tokenId);
        if (block.timestamp > airdropFinishTime) revert AirdropExpired();

        hasClaimed[tokenId] = true;
        emit Claimed(tokenId, msg.sender);
    }

    /// @notice Performs checks and changes state associated with batch claiming multiple ERC20's through an airdrop
    /// @dev This method does deal with the transfer of tokens
    /// - the logic for this is handled in the child contract.
    /// @param tokenIds are the rewarded NFT collections token ID's
    function batchClaimHandler(uint256[] calldata tokenIds) internal {
        if (block.timestamp > airdropFinishTime) revert AirdropExpired();

        for (uint256 index = 0; index < tokenIds.length; index++) {
            uint256 tokenId = tokenIds[index];

            validateClaim(tokenId);

            hasClaimed[tokenId] = true;
            emit Claimed(tokenId, msg.sender);
        }
    }

    /// @notice Validation for claiming a reward (excluding the block.timestamp check)
    /// @dev method only used in this contract in methods
    /// 'claimHandler' and 'batchClaimHandler', so visibility is private.
    /// @param tokenId the token id based on which the user wishes to claim the reward
    function validateClaim(uint256 tokenId) private view {
        if (hasClaimed[tokenId]) revert AlreadyRedeemed();
        if (rewardedNft.ownerOf(tokenId) != msg.sender) revert Unauthorized();
    }

    /// @notice Checks if the user is eligible for this airdrop
    /// @param tokenId the token id based on which the user wishes to claim the reward
    /// @return true if user is eligible to receive a reward
    function isEligibleForReward(uint256 tokenId) public view returns (bool) {
        if ((block.timestamp > airdropFinishTime) || (hasClaimed[tokenId]) || (rewardedNft.ownerOf(tokenId) != msg.sender)) {
            return false;
        }
        return true;
    }

    /// @notice Returns the amount of airdrop tokens a user can claim
    /// @return amount of reward tokens a user can claim
    function getAirdropAmount() external view returns (uint256) {
        return rewardedNft.balanceOf(msg.sender) * tokensPerClaim;
    }
}
