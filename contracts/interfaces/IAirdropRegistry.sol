// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

interface IAirdropRegistry {
    function treasury() external returns (address);

    function factories() external returns (bool);

    function addAirdrop(
        address _airdropContract,
        address _creator,
        string calldata _airdropType
    ) external;
}
