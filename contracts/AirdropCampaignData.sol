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
        bool airdropFinished;
        Chains chain;
        bytes32[] hashArray;
    }

    mapping(address => AirdropData) public airdrops;

    event FinalizedAirdrop(address indexed airdropCampaign);
    event HashAdded(address indexed airdropCampaign, bytes32 indexed hash);
    event ChainAdded(address indexed airdropCampaign, Chains indexed airdropChain);
    event AirbroManagerChanged(address newManager);

    error NotAirbroManager();
    error NotOwnerOrAirbroManager();
    error UnequalArrays();
    error ChainDataNotSet();
    error ChainAlreadySet();
    error AirdropHasFinished();

    modifier onlyAirbroManager() {
        if (msg.sender != airbroManager) revert NotAirbroManager();
        _;
    }

    modifier onlyOwnerOrAirbroManager() {
        if (msg.sender != airbroManager && msg.sender != owner()) revert NotOwnerOrAirbroManager();
        _;
    }

    modifier airdropNotFinished(address _airdropCampaignAddress) {
        if (airdrops[_airdropCampaignAddress].airdropFinished) revert AirdropHasFinished();
        _;
    }

    modifier chainDataSet(address _airdropCampaignAddress) {
        if (airdrops[_airdropCampaignAddress].chain == Chains.Zero) revert ChainDataNotSet();
        _;
    }

    // solhint-disable-next-line no-empty-blocks
    function _authorizeUpgrade(address) internal override onlyOwner {}

    function initialize(address _airbroManager) public initializer {
        airbroManager = _airbroManager;
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    /// @notice Changes Airbro manager
    /// @param newAirbroManager address of a new manager
    function changeAirbroManager(address newAirbroManager) external onlyOwnerOrAirbroManager {
        airbroManager = newAirbroManager;
        emit AirbroManagerChanged(newAirbroManager);
    }

    /// @notice Adds daily hash for any airdropCampaign contract
    /// @param _airdropCampaignAddress - address of the airdropCampaign contract whose current
    /// participants are in the daily hash
    /// @param _hash - hash of daily participants of an airdropCampaign
    function addDailyHash(address _airdropCampaignAddress, bytes32 _hash)
        public
        onlyAirbroManager
        airdropNotFinished(_airdropCampaignAddress)
        chainDataSet(_airdropCampaignAddress)
    {
        airdrops[_airdropCampaignAddress].hashArray.push(_hash);
        emit HashAdded(_airdropCampaignAddress, _hash);
    }

    /// @notice Adds array of daily hashes for multiple airdropCampaign contracts
    /// @param _airdropCampaignAddressArray - array of addresses of multiple airdropCampaign contracts
    /// whose current participants are in the daily hash
    /// @param _hashArray - array of hashes of daily participants of multiple airdropCampaigns
    function batchAddDailyHash(address[] calldata _airdropCampaignAddressArray, bytes32[] calldata _hashArray)
        external
        onlyAirbroManager
    {
        uint256 airdropHashArrayLength = _hashArray.length;
        if (airdropHashArrayLength != _airdropCampaignAddressArray.length) revert UnequalArrays();

        for (uint256 i; i < airdropHashArrayLength; i++) {
            address currentCampaignAddress = _airdropCampaignAddressArray[i];
            bytes32 currentHash = _hashArray[i];

            addDailyHash(currentCampaignAddress, currentHash);
        }
    }

    /// @notice Adds string "ETH" or "POL" to mapping depending on which network the airdropCampaign contract is on
    /// @param _airdropCampaignAddress - address of airdropCampaign contract
    /// @param _airdropChain - string representing blockchain Chain
    function addAirdropCampaignChain(address _airdropCampaignAddress, Chains _airdropChain)
        public
        onlyAirbroManager
        airdropNotFinished(_airdropCampaignAddress)
    {
        if (_airdropChain == Chains.Zero) revert ChainDataNotSet();
        if (airdrops[_airdropCampaignAddress].chain != Chains.Zero) revert ChainAlreadySet();

        airdrops[_airdropCampaignAddress].chain = _airdropChain;
        emit ChainAdded(_airdropCampaignAddress, _airdropChain);
    }

    /// @notice Adds array of Chain info: "Eth" or "Pol" to mapping depending on which Chain
    /// the airdropCampaign contracts are on
    /// @param _airdropCampaignAddressArray - address of airdropCampaign contract
    /// @param _airdropChainArray - array of uints representing blockchain chain
    function batchAddAirdropCampaignChain(
        address[] calldata _airdropCampaignAddressArray,
        Chains[] calldata _airdropChainArray
    ) external onlyAirbroManager {
        uint256 airdropChainArrayLength = _airdropChainArray.length;
        if (airdropChainArrayLength != _airdropCampaignAddressArray.length) revert UnequalArrays();

        for (uint256 i; i < airdropChainArrayLength; i++) {
            address currentCampaignAddress = _airdropCampaignAddressArray[i];
            Chains currentCampaignChain = _airdropChainArray[i];

            addAirdropCampaignChain(currentCampaignAddress, currentCampaignChain);
        }
    }

    /// @notice Disabiling the ability to push hashes to the hashArray of a specific campaign
    /// @param _airdropCampaignAddress - address of airdropCampaign contract
    function finalizeAirdrop(address _airdropCampaignAddress)
        external
        onlyAirbroManager
        airdropNotFinished(_airdropCampaignAddress)
        chainDataSet(_airdropCampaignAddress)
    {
        airdrops[_airdropCampaignAddress].airdropFinished = true;
        emit FinalizedAirdrop(_airdropCampaignAddress);
    }
}
