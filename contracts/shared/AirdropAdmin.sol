// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

abstract contract AirdropAdmin {
    address public admin;
    address private newAdmin;

    error NotAdmin();

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    event AdminTransferInitiated(address indexed receiverAddress);
    event AdminTransferCanceled(address indexed receiverAddress);
    event AdminChanged(address indexed adminAddress);

    error InvalidNewAdminAddress();
    error TransferToAddressAlreadyInitiated(address receiverAddress);
    error NotEligibleForAdminTransfer(address caller);

    constructor(address _admin) {
        admin = _admin;
    }

    /// @notice Adds address which can transfer admin role to itself
    /// @dev If the var newAdmin is not address(0), calling method with the same newAdmin address will revert. But if we
    /// call with a different address, it will emit AdminTransferCanceled for current newAdmin address, and
    /// AdminTransferInitiated for the newly set newAdmin address. But if newAdmin is address(0),
    /// it will just set newAdmin and  emit AdminTransferInitiated.
    /// @param _newAdmin address which will be able to accept/replace current admin role
    function initiateAdminTranfer(address _newAdmin) external onlyAdmin {
        if (_newAdmin == address(0)) revert InvalidNewAdminAddress();
        if (newAdmin == _newAdmin) revert TransferToAddressAlreadyInitiated(_newAdmin);
        if (newAdmin != address(0)) emit AdminTransferCanceled(newAdmin);

        newAdmin = _newAdmin;
        emit AdminTransferInitiated(_newAdmin);
    }

    /// @notice Canceled the admin transfer
    /// @dev sets address of 0x00 as the address that can accept/replace admin role
    function cancelAdminTransfer() external onlyAdmin {
        emit AdminTransferCanceled(newAdmin);
        newAdmin = address(0);
    }

    /// @notice Complete transfer of admin role to newAdmin address
    /// @dev callable only by the newAdmin address, after which the transfer system is reset
    function acceptAdminTransfer() external {
        if (msg.sender != newAdmin) revert NotEligibleForAdminTransfer(msg.sender);

        admin = newAdmin;
        newAdmin = address(0);

        emit AdminChanged(msg.sender);
    }
}
