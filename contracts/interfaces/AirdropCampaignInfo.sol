// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

interface AirdropCampaignInfo {
    /// @notice Checks if the user is eligible for this airdrop
    /// @param _merkleProof is the merkleRoot proof that this user is eligible for claiming reward
    /// @return bool Returns true or false depending on whether wallet is eligible to claim reward
    function isEligibleForReward(bytes32[] calldata _merkleProof) external returns (bool);

    /// @notice Returns the amount(number) of airdrop tokens to claim
    /// @param _merkleProof is the rewarded NFT collections token ID
    /// @return amount of tokens a user is able to claim
    function getAirdropAmount(bytes32[] calldata _merkleProof) external returns (uint256);
}
