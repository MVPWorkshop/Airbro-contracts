// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

interface IAirBroFactory {
    function admin() external returns (address);

    function claimFee() external returns (uint256);
}
