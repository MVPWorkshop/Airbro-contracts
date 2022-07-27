// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

abstract contract AirdropExistingToken {
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
        uint256 _totalAirdropAmount
    ) {
        rewardedNft = IERC721(_rewardedNft);
        tokensPerClaim = _tokensPerClaim;
        totalAirdropAmount = _totalAirdropAmount;
    }

    /// @notice Validation for claiming a reward (excluding the block.timestamp check)
    /// @param tokenId the token id based on which the user wishes to claim the reward
    function validateClaim(uint256 tokenId) internal view {
        if (hasClaimed[tokenId]) revert AlreadyRedeemed();
        if (rewardedNft.ownerOf(tokenId) != msg.sender) revert Unauthorized();
    }

    /// @notice Returns the amount of airdrop tokens a user can claim
    /// @return amount of reward tokens a user can claim
    function getAirdropAmount() external view returns (uint256) {
        return rewardedNft.balanceOf(msg.sender) * tokensPerClaim;
    }
}
