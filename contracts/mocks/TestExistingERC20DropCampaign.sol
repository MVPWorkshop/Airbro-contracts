// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "../campaignAirdrops/ExistingERC20DropCampaign.sol";

/// @title Unit testing version of ExistingERC20DropCampaign contract so airbroCampaignFactoryAddress can be replaced with mock version
contract TestExistingERC20DropCampaign is ExistingERC20DropCampaign {
    function changeAirbroCampaignAddress(address _airbroCampaignFactoryAddress) external {
        airbroCampaignFactoryAddress = IAirBroFactory(_airbroCampaignFactoryAddress);
    }
}
