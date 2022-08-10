// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

/// @title AirdropRegsitry - Contract that holds state of all AirbroCampaignFactory contracts and their iterations
contract AirdropRegistry {
    address public immutable treasury;
    // index of deployed airdrop contracts
    address[] public airdrops;
    address public admin;

    uint256 public totalAirdropsCount;
    // list of whitelisted and blacklisted AirbroCampaignFactory contract addresses
    mapping(address => bool) public factories;

    event FactoryWhitelisted(address indexed factoryAddress);
    event FactoryBlacklisted(address indexed factoryAddress);
    event NewAirdrop(address indexed _airdropContract, address indexed _creator, string indexed _airdropType);
    event AdminChanged(address indexed adminAddress);

    error NotAdmin();
    error NotWhitelisted();

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    modifier onlyWhitelisted() {
        if (factories[msg.sender] != true) revert NotWhitelisted();
        _;
    }

    constructor(address _admin, address _treasury) {
        admin = _admin;
        treasury = payable(_treasury);
    }

    receive() external payable {}

    fallback() external payable {}

    /// @notice Whitelists AirbroCampaignFactory contract so it becomes usable
    /// @param _factoryAddress - AirbroCampaignFactory contract address
    function addFactory(address _factoryAddress) external onlyAdmin {
        factories[_factoryAddress] = true;
        emit FactoryWhitelisted(_factoryAddress);
    }

    /// @notice Blacklists AirbroCampaignFactory contract so it cannot be used anymore
    /// @param _factoryAddress - AirbroCampaignFactory contract address
    function removeFactory(address _factoryAddress) external onlyAdmin {
        factories[_factoryAddress] = false;
        emit FactoryBlacklisted(_factoryAddress);
    }

    /// @notice Adds airdrop to registry
    /// @param _airdropContract - Airdrop campaign contract address
    /// @param _creator - Campaign creator address
    /// @param _airdropType - Type of reward the airdrop campaign offers - ERC20, ERC1155, SB1155 etc..
    function addAirdrop(
        address _airdropContract,
        address _creator,
        string calldata _airdropType
    ) external onlyWhitelisted {
        airdrops.push(address(_airdropContract));
        unchecked {
            totalAirdropsCount++;
        }

        emit NewAirdrop(_airdropContract, _creator, _airdropType);
    }

    /// @notice Updates the address of the admin variable
    /// @param _newAdmin - New address for the admin of this contract, and the address for all newly created airdrop contracts
    function changeAdmin(address _newAdmin) external onlyAdmin {
        admin = _newAdmin;
        emit AdminChanged(_newAdmin);
    }
}