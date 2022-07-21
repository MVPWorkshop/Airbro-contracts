// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

/// @title AirdropCampaignData - Data contract for storing of daily merkleRootHashes of airbro Campaigns
contract AirdropCampaignData {
    address public admin = 0xF4b5bFB92dD4E6D529476bCab28A65bb6B32EFb3;
    uint16 public batchHashArrayLimit = 600;
    uint16 public batchChainArrayLimit = 600;

    enum Chains {
        Zero,
        Eth,
        Pols
    }

    struct AirdropData {
        Chains chain;
        bytes32[] hashArray;
    }

    mapping(address => AirdropData) public airdrops;

    error NotAdmin();
    error UnequalArrays();
    error ArrayTooLong();
    error ChainDataNotSet();
    error ChainAlreadySet();

    event AdminChanged(address adminAddress);
    event MerkleRootHashAdded(address indexed airdropCampaignAddress, bytes32 indexed merkleRootHash);
    event ChainAdded(address indexed airdropCampaignAddress, Chains indexed airdropChain);

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor() {}

    /// @notice Updates the address of the admin variable
    /// @param _newAdmin - New address for the admin of this contract, and the address for all newly created airdrop contracts
    function changeAdmin(address _newAdmin) external onlyAdmin {
        admin = _newAdmin;
        emit AdminChanged(_newAdmin);
    }

    /// @notice Adds daily merkle root hash for any airdropCampaign contract
    /// @param _airdropCampaignAddress - address of the airdropCampaign contract whose current participants are in the daily merkleRootHash
    /// @param _merkleRootHash - merkle root hash of daily participants of an airdropCampaign
    function addDailyMerkleRootHash(address _airdropCampaignAddress, bytes32 _merkleRootHash) external onlyAdmin {
        airdrops[_airdropCampaignAddress].hashArray.push(_merkleRootHash);
        emit MerkleRootHashAdded(_airdropCampaignAddress, _merkleRootHash);
    }

    /// @notice Adds array of daily merkle root hashes for multiple airdropCampaign contracts
    /// @param _airdropCampaignAddressArray - array of addresses of multiple airdropCampaign contracts whose current participants are in the daily merkleRootHash
    /// @param _merkleRootHashArray - array of merkle root hashes of daily participants of multiple airdropCampaigns
    function batchAddDailyMerkleRootHash(address[] memory _airdropCampaignAddressArray, bytes32[] memory _merkleRootHashArray)
        external
        onlyAdmin
    {
        uint256 airdropHashArrayLength = _merkleRootHashArray.length;
        if (airdropHashArrayLength > batchHashArrayLimit) revert ArrayTooLong();
        if (airdropHashArrayLength != _airdropCampaignAddressArray.length) revert UnequalArrays();

        for (uint256 i; i < airdropHashArrayLength; i++) {
            airdrops[_airdropCampaignAddressArray[i]].hashArray.push(_merkleRootHashArray[i]);
            emit MerkleRootHashAdded(_airdropCampaignAddressArray[i], _merkleRootHashArray[i]);
        }
    }

    /// @notice Adds string "ETH" or "POL" to mapping depending on which network the airdropCampaign contract is on
    /// @param _airdropCampaignAddress - address of airdropCampaign contract
    /// @param _airdropChain - string representing blockchain Chain
    function addAirdropCampaignChain(address _airdropCampaignAddress, Chains _airdropChain) external onlyAdmin {
        if (_airdropChain == Chains.Zero) revert ChainDataNotSet();
        if (airdrops[_airdropCampaignAddress].chain != Chains.Zero) revert ChainAlreadySet();

        airdrops[_airdropCampaignAddress].chain = _airdropChain;
        emit ChainAdded(_airdropCampaignAddress, _airdropChain);
    }

    /// @notice Adds array of Chain info: "Eth" or "Pol" to mapping depending on which Chain the airdropCampaign contracts are on
    /// @param _airdropCampaignAddressArray - address of airdropCampaign contract
    /// @param _airdropChainArray - array of uints representing blockchain chain
    function batchAddAirdropCampaignChain(address[] memory _airdropCampaignAddressArray, Chains[] memory _airdropChainArray)
        external
        onlyAdmin
    {
        uint256 airdropChainArrayLength = _airdropChainArray.length;
        if (airdropChainArrayLength > batchChainArrayLimit) revert ArrayTooLong();
        if (airdropChainArrayLength != _airdropCampaignAddressArray.length) revert UnequalArrays();

        for (uint256 i; i < airdropChainArrayLength; i++) {
            if (_airdropChainArray[i] == Chains.Zero) revert ChainDataNotSet();
            if (airdrops[_airdropCampaignAddressArray[i]].chain != Chains.Zero) revert ChainAlreadySet();

            airdrops[_airdropCampaignAddressArray[i]].chain = _airdropChainArray[i];
            emit ChainAdded(_airdropCampaignAddressArray[i], _airdropChainArray[i]);
        }
    }
}
