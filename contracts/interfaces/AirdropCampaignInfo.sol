// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

interface AirdropCampaignInfo {
    /// @notice Checks if the user is eligible for this airdrop
    /// @param _merkleProof is the merkleRoot proof that this user is eligible for claiming reward
    function isEligibleForReward(bytes32[] calldata _merkleProof) external returns (bool);

    /// @notice Returns the amount(number) of airdrop tokens to claim
    /// @param _merkleProof is the rewarded NFT collections token ID
    function getAirdropAmount(bytes32[] calldata _merkleProof) external returns (uint256);
}
