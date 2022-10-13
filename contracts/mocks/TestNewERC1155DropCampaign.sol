// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "../campaignAirdrops/NewERC1155DropCampaign.sol";

/// @title Unit testing version of NewERC1155DropCampaign contract so airbroCampaignFactoryAddress can be replaced with mock version
contract TestNewERC1155DropCampaign is NewERC1155DropCampaign {
    function changeAirbroCampaignAddress(address _airbroCampaignFactoryAddress) external {
        airbroCampaignFactoryAddress = IAirBroFactory(_airbroCampaignFactoryAddress);
    }
}
