// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "./shared/AirdropAdmin.sol";
import "./interfaces/IAirdropRegistry.sol";

/// @title AirdropRegsitry - Contract that holds state of all AirbroCampaignFactory contracts and their iterations
contract AirdropRegistry is IAirdropRegistry, AirdropAdmin {
    address public immutable treasury;
    // index of deployed airdrop contracts
    address[] private _airdrops;

    uint256 private _totalAirdropsCount;
    // Mapping of whitelisted and blacklisted AirbroCampaignFactory contracts
    mapping(address => bool) private _factories;

    modifier onlyWhitelisted() {
        if (!_factories[msg.sender]) revert NotWhitelisted();
        _;
    }

    constructor(address _admin, address _treasury) AirdropAdmin(_admin) {
        treasury = payable(_treasury);
    }

    /// @inheritdoc IAirdropRegistry
    function addFactory(address factoryAddress) external onlyAdmin {
        _factories[factoryAddress] = true;
        emit FactoryWhitelisted(factoryAddress);
    }

    /// @inheritdoc IAirdropRegistry
    function removeFactory(address factoryAddress) external onlyAdmin {
        _factories[factoryAddress] = false;
        emit FactoryBlacklisted(factoryAddress);
    }

    /// @inheritdoc IAirdropRegistry
    function addAirdrop(
        address airdropContract,
        address creator,
        string calldata airdropType
    ) external onlyWhitelisted {
        _airdrops.push(address(airdropContract));
        unchecked {
            _totalAirdropsCount++;
        }

        emit NewAirdrop(airdropContract, creator, airdropType);
    }

    /// @inheritdoc IAirdropRegistry
    function isWhitelistedFactory(address factory) external view returns (bool) {
        return _factories[factory];
    }

    /// @inheritdoc IAirdropRegistry
    function getAirdrop(uint256 index) external view returns (address) {
        return _airdrops[index];
    }

    /// @inheritdoc IAirdropRegistry
    function getTotalAirdropsCount() external view returns (uint256) {
        return _totalAirdropsCount;
    }
}
