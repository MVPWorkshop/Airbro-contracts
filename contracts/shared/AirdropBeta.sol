// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "./AirdropAdmin.sol";

abstract contract AirdropBeta is AirdropAdmin {
    bool public beta = true;
    address public immutable betaAddress;

    event BetaClosed();

    error NotBetaAddress();

    modifier duringBeta() {
        if (beta) {
            if (msg.sender != betaAddress) revert NotBetaAddress();
        }
        _;
    }

    constructor(address _betaAddress) {
        betaAddress = _betaAddress;
    }

    /// @notice Closes beta and allows for any address to create campaigns
    function closeBeta() external onlyAdmin {
        beta = false;
        emit BetaClosed();
    }
}
