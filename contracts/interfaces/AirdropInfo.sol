// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

interface AirdropInfo {

    //@notice Returns the end timestamp of an airdrop
    function getAirdropFinishTime() external view returns (uint256);

    //@notice Returns the time duration in days of an airdrop
    function getAirdropDuration() external view returns (uint256);

    //@notice Returns the start timestamp of an airdrop
    function getAirdropStartTime() external view returns (uint256);

    //@notice Get the type of airdrop, it's either ERC20, ERC721, ERC1155
    function getAirdropType() external view returns (string memory);

    //@notice Checks if the user is eligible for this airdrop
    function isEligibleForReward(uint256 tokenId) external view returns (bool);

    //@notice Returns the amount(number) of airdrop tokens to claim
    //@param tokenId is the rewarded NFT collections token ID
    function getAirdropAmount() external view returns (uint256);
}

