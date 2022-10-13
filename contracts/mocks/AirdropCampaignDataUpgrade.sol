// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "../AirdropCampaignData.sol";

/// @title AirdropCampaignData - Data contract for storing of daily hashes of airbro Campaigns
contract AirdropCampaignDataUpgrade is AirdropCampaignData {
    /// @notice Method which returns the string "test_text"
    /// @dev Used to test upgradability of the contract
    function getUpgradedValue() external pure returns (string memory) {
        return "test_text";
    }
}
