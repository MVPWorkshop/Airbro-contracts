// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

interface IAirdropRegistry {
    /// @notice Emitted when a factory is whitelisted
    event FactoryWhitelisted(address indexed factoryAddress);
    /// @notice Emitted when a factory is blacklisted
    event FactoryBlacklisted(address indexed factoryAddress);
    /// @notice Emitted when new airdrop is added to registry
    event NewAirdrop(address indexed airdropContract, address indexed creator, string indexed airdropType);

    /// @notice Error indicating that the factory is not whitelisted
    /// Only whitelisted factory can add new airdrop
    error NotWhitelisted();

    /// @notice Returns treasury address
    function treasury() external returns (address);

    /// @notice Returuns boolean indicating if the factory address is whitelisted
    /// @param factory address
    /// @return uint256 bool indicating if it is whitelisted
    function isWhitelistedFactory(address factory) external returns (bool);

    /// @notice Adds the airdrop to registry
    /// @dev Sender must be a whitelisted factory
    /// @param airdropContract - Airdrop campaign contract address
    /// @param creator - Campaign creator address
    /// @param airdropType - Type of reward the airdrop campaign offers - ERC20, ERC1155, SB1155 etc..
    function addAirdrop(
        address airdropContract,
        address creator,
        string calldata airdropType
    ) external;

    /// @notice Whitelists AirbroCampaignFactory contract so it becomes usable
    /// @param factoryAddress - AirbroCampaignFactory contract address
    function addFactory(address factoryAddress) external;

    /// @notice Blacklists AirbroCampaignFactory contract so it cannot be used anymore
    /// @param factoryAddress - AirbroCampaignFactory contract address
    function removeFactory(address factoryAddress) external;

    /// @notice Returns aidrop contract address by index
    /// @param index Index of an airdrop
    /// @return Aidrop's smart contract address
    function getAirdrop(uint256 index) external view returns (address);

    /// @notice Returns total number of airdrops
    /// @return total number of airdrops
    function getTotalAirdropsCount() external view returns (uint256);
}
