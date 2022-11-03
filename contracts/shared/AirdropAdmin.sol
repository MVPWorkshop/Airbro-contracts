// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

abstract contract AirdropAdmin {
    address public admin;

    error NotAdmin();

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    event AdminChanged(address indexed adminAddress);

    constructor(address _admin) {
        admin = _admin;
    }

    /// @notice Updates the address of the admin variable
    /// @param _newAdmin - New address for the admin of this contract, and the address for all newly created airdrop contracts
    function changeAdmin(address _newAdmin) external onlyAdmin {
        admin = _newAdmin;
        emit AdminChanged(_newAdmin);
    }
}
