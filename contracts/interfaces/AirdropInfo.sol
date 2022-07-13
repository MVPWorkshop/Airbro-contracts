// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

interface AirdropInfo {
    /// @notice Checks if the user is eligible for this airdrop
    function isEligibleForReward(uint256 tokenId) external view returns (bool);

    /// @notice Returns the amount(number) of airdrop tokens to claim
    function getAirdropAmount() external view returns (uint256);
}
