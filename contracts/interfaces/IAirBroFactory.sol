// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

interface IAirBroFactory {
    function treasury() external returns (address);

    function trustedRelayer() external returns (address);

    function admin() external returns (address);

    function claimFee() external returns (uint256);

    function claimPeriodInDays() external returns (uint16);
}
