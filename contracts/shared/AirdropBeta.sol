// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "./AirdropAdmin.sol";

abstract contract AirdropBeta is AirdropAdmin {
    bool public beta = true;
    address public constant betaAddress = 0x185310a0C79A9389e5552E338214EA86F0ef0f33;

    event BetaClosed();

    error NotBetaAddress();

    modifier duringBeta() {
        if (beta) {
            if (msg.sender != betaAddress) revert NotBetaAddress();
        }
        _;
    }

    /// @notice Closes beta and allows for any address to create campaigns
    function closeBeta() external onlyAdmin {
        beta = false;
        emit BetaClosed();
    }
}
