// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

interface IAirBroFactory {
    function treasury() external returns (address);

    function admin() external returns (address);

    function claimFee() external returns (uint256);
}
