// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "./IAirdropAdminRequest.sol";

interface IAirBroCampaignFactory is IAirdropAdminRequest {
    function treasury() external returns (address);

    function claimFee() external returns (uint256);

    function claimPeriodInDays() external returns (uint16);
}
