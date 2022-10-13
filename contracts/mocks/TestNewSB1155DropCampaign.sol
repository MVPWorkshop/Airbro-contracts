// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "../campaignAirdrops/NewSB1155DropCampaign.sol";

/// @title Unit testing version of NewSB1155DropCampaign contract so airbroCampaignFactoryAddress can be replaced with mock version
contract TestNewSB1155DropCampaign is NewSB1155DropCampaign {
    function changeAirbroCampaignAddress(address _airbroCampaignFactoryAddress) external {
        airbroCampaignFactoryAddress = IAirBroFactory(_airbroCampaignFactoryAddress);
    }
}
