// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

interface IAirdropAdmin {
    function admin() external returns (address);

    function changeAdmin(address _newAdmin) external;
}
