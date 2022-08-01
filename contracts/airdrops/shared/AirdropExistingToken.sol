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

    /// @notice Changes state and emits event once contracts have been funded with tokens.
    /// A revert of the transfer of existing tokens to the contract will revert these changes.
    /// @dev This method is called as super.fundAirdrop() in Existing1155NftDrop.sol,
    /// and ExistingTokenDrop.sol in standard airdrops.
    function fundAirdrop() public virtual {
        if (airdropFunded) revert AlreadyFunded();

        airdropFunded = true;
        airdropFundBlockTimestamp = block.timestamp;
        airdropFundingHolder = msg.sender;

        emit AirdropFunded(address(this));
    }

    /// @notice Allows the airdrop funder to withdraw back their funds after the airdrop has finished
    /// @dev This method does deal with the trantransfer/ minting  of tokens - the logic for this is handled in the child contract.
    function withdrawAirdropFunds() public virtual {
        if (airdropFundingHolder != msg.sender) revert Unauthorized();
        if (block.timestamp < airdropFinishTime) revert AirdropStillInProgress();
    }

    /// @notice Allows the NFT holder to claim their ERC20 airdrop
    /// @dev This method does deal with the transfer/ minting of tokens - the logic for this is handled in the child contract.
    /// @param tokenId is the rewarded NFT collections token ID
    function claim(uint256 tokenId) public virtual {
        validateClaim(tokenId);
        if (block.timestamp > airdropFinishTime) revert AirdropExpired();

        hasClaimed[tokenId] = true;
        emit Claimed(tokenId, msg.sender);
    }

    /// @notice Claim multiple ERC20 airdrops at once
    /// @dev This method does deal with the transfer/ minting of tokens - the logic for this is handled in the child contract.
    /// @param tokenIds are the rewarded NFT collections token ID's
    function batchClaim(uint256[] calldata tokenIds) public virtual {
        if (block.timestamp > airdropFinishTime) revert AirdropExpired();

        for (uint256 index = 0; index < tokenIds.length; index++) {
            uint256 tokenId = tokenIds[index];

            validateClaim(tokenId);

            hasClaimed[tokenId] = true;
            emit Claimed(tokenId, msg.sender);
        }
    }

    /// @notice Validation for claiming a reward (excluding the block.timestamp check)
    /// @param tokenId the token id based on which the user wishes to claim the reward
    function validateClaim(uint256 tokenId) internal view {
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
