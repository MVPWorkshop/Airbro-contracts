// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/// @title AirdropCampaignData - Data contract for storing of daily hashes of airbro Campaigns
contract AirdropCampaignData is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    address public airbroManager;

    enum Chains {
        Zero,
        Eth,
        Pols
    }

    struct AirdropData {
        Chains chain;
        bool airdropFinished;
        bytes32[] hashArray;
    }

    mapping(address => AirdropData) public airdrops;

    error NotAirbroManager();
    error UnequalArrays();
    error ChainDataNotSet();
    error ChainAlreadySet();
    error AirdropHasFinished();
    error AlreadyFinalized();

    event AirbroManagerChanged(address adminAddress);
    event FinalizedAirdrop(address indexed airdropCampaignAddress);
    event HashAdded(address indexed airdropCampaignAddress, bytes32 indexed hash);
    event ChainAdded(address indexed airdropCampaignAddress, Chains indexed airdropChain);

    modifier onlyAirbroManager() {
        if (msg.sender != airbroManager) revert NotAirbroManager();
        _;
    }

    // should this be onlyAirbroManager (backend wallet address),
    // or should the deployer be able to upgrade
    // (which means the cotract should have ownable)?
    function _authorizeUpgrade(address) internal override onlyOwner {}

    function initialize(address _airbroManager) public initializer {
        airbroManager = _airbroManager;
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    /// @notice Updates the address of the admin variable
    /// @param _newAirbroManager - New address for the admin of this contract, and the address for all newly created airdrop contracts
    function changeAdmin(address _newAirbroManager) external onlyAirbroManager {
        airbroManager = _newAirbroManager;
        emit AirbroManagerChanged(_newAirbroManager);
    }

    /// @notice Adds daily hash for any airdropCampaign contract
    /// @param _airdropCampaignAddress - address of the airdropCampaign contract whose current participants are in the daily hash
    /// @param _hash - hash of daily participants of an airdropCampaign
    function addDailyHash(address _airdropCampaignAddress, bytes32 _hash) external onlyAirbroManager {
        if (airdrops[_airdropCampaignAddress].airdropFinished) revert AirdropHasFinished();
        if (airdrops[_airdropCampaignAddress].chain == Chains.Zero) revert ChainDataNotSet();

        airdrops[_airdropCampaignAddress].hashArray.push(_hash);
        emit HashAdded(_airdropCampaignAddress, _hash);
    }

    /// @notice Adds array of daily hashes for multiple airdropCampaign contracts
    /// @param _airdropCampaignAddressArray - array of addresses of multiple airdropCampaign contracts whose current participants are in the daily hash
    /// @param _hashArray - array of hashes of daily participants of multiple airdropCampaigns
    function batchAddDailyHash(address[] calldata _airdropCampaignAddressArray, bytes32[] calldata _hashArray) external onlyAirbroManager {
        uint256 airdropHashArrayLength = _hashArray.length;
        if (airdropHashArrayLength != _airdropCampaignAddressArray.length) revert UnequalArrays();

        for (uint256 i; i < airdropHashArrayLength; i++) {
            address currentCampaignAddress = _airdropCampaignAddressArray[i];
            bytes32 currentHash = _hashArray[i];

            if (airdrops[currentCampaignAddress].chain == Chains.Zero) revert ChainDataNotSet();
            if (airdrops[currentCampaignAddress].airdropFinished) revert AirdropHasFinished();

            airdrops[currentCampaignAddress].hashArray.push(currentHash);
            emit HashAdded(currentCampaignAddress, currentHash);
        }
    }

    /// @notice Adds string "ETH" or "POL" to mapping depending on which network the airdropCampaign contract is on
    /// @param _airdropCampaignAddress - address of airdropCampaign contract
    /// @param _airdropChain - string representing blockchain Chain
    function addAirdropCampaignChain(address _airdropCampaignAddress, Chains _airdropChain) external onlyAirbroManager {
        if (_airdropChain == Chains.Zero) revert ChainDataNotSet();
        if (airdrops[_airdropCampaignAddress].chain != Chains.Zero) revert ChainAlreadySet();
        if (airdrops[_airdropCampaignAddress].airdropFinished) revert AirdropHasFinished();

        airdrops[_airdropCampaignAddress].chain = _airdropChain;
        emit ChainAdded(_airdropCampaignAddress, _airdropChain);
    }

    /// @notice Adds array of Chain info: "Eth" or "Pol" to mapping depending on which Chain the airdropCampaign contracts are on
    /// @param _airdropCampaignAddressArray - address of airdropCampaign contract
    /// @param _airdropChainArray - array of uints representing blockchain chain
    function batchAddAirdropCampaignChain(address[] calldata _airdropCampaignAddressArray, Chains[] calldata _airdropChainArray)
        external
        onlyAirbroManager
    {
        uint256 airdropChainArrayLength = _airdropChainArray.length;
        if (airdropChainArrayLength != _airdropCampaignAddressArray.length) revert UnequalArrays();

        for (uint256 i; i < airdropChainArrayLength; i++) {
            address currentCampaignAddress = _airdropCampaignAddressArray[i];
            Chains currentCampaignChain = _airdropChainArray[i];

            if (currentCampaignChain == Chains.Zero) revert ChainDataNotSet();
            if (airdrops[_airdropCampaignAddressArray[i]].chain != Chains.Zero) revert ChainAlreadySet();
            if (airdrops[currentCampaignAddress].airdropFinished) revert AirdropHasFinished();

            airdrops[currentCampaignAddress].chain = currentCampaignChain;
            emit ChainAdded(currentCampaignAddress, currentCampaignChain);
        }
    }

    /// @notice Disabiling the ability to push hashes to the hashArray of a specific campaign
    /// @param _airdropCampaignAddress - address of airdropCampaign contract
    function finalizeAirdrop(address _airdropCampaignAddress) external onlyAirbroManager {
        if (airdrops[_airdropCampaignAddress].airdropFinished) revert AlreadyFinalized();
        if (airdrops[_airdropCampaignAddress].chain == Chains.Zero) revert ChainDataNotSet();

        airdrops[_airdropCampaignAddress].airdropFinished = true;
        emit FinalizedAirdrop(_airdropCampaignAddress);
    }
}
