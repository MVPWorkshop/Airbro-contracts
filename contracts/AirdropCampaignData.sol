// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

/// @title AirdropCampaignData - Data contract for storing of daily merkleRootHashes of airbro Campaigns
contract AirdropCampaignData {
    address public admin = 0xF4b5bFB92dD4E6D529476bCab28A65bb6B32EFb3;

    enum Chains {
        Zero,
        Eth,
        Pols
    }

    struct AirdropData {
        Chains chain;
        bytes32[] hashArray;
        bool airdropFinished;
    }

    mapping(address => AirdropData) public airdrops;

    error NotAdmin();
    error UnequalArrays();
    error AirdropHasFinished();

    event AdminChanged(address adminAddress);
    event MerkleRootHashAdded(address indexed airdropCampaignAddress, bytes32 indexed merkleRootHash);
    event ChainAdded(address indexed airdropCampaignAddress, Chains indexed airdropChain);
    event FinalizedAirdrop(address indexed airdropCampaignAddress);

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
        if (isAirdropFinished(_airdropCampaignAddress) == true) revert AirdropHasFinished();

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
        if (_airdropCampaignAddressArray.length != _merkleRootHashArray.length) revert UnequalArrays();

        uint256 arrayLength = _airdropCampaignAddressArray.length;

        for (uint256 i; i < arrayLength; i++) {
            address _airdropCampaignAddress = _airdropCampaignAddressArray[i];

            if (isAirdropFinished(_airdropCampaignAddress) == true) revert AirdropHasFinished();

            airdrops[_airdropCampaignAddress].hashArray.push(_merkleRootHashArray[i]);
            emit MerkleRootHashAdded(_airdropCampaignAddress, _merkleRootHashArray[i]);
        }
    }

    /// @notice Adds string "ETH" or "POL" to mapping depending on which network the airdropCampaign contract is on
    /// @param _airdropCampaignAddress - address of airdropCampaign contract
    /// @param _airdropChain - string representing blockchain Chain
    function addAirdropCampaignChain(address _airdropCampaignAddress, Chains _airdropChain) external onlyAdmin {
        if (isAirdropFinished(_airdropCampaignAddress) == true) revert AirdropHasFinished();

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
        if (_airdropCampaignAddressArray.length != _airdropChainArray.length) revert UnequalArrays();

        uint256 arrayLength = _airdropCampaignAddressArray.length;

        for (uint256 i; i < arrayLength; i++) {
            address _airdropCampaignAddress = _airdropCampaignAddressArray[i];

            if (isAirdropFinished(_airdropCampaignAddress) == true) revert AirdropHasFinished();

            airdrops[_airdropCampaignAddressArray[i]].chain = _airdropChainArray[i];
            emit ChainAdded(_airdropCampaignAddressArray[i], _airdropChainArray[i]);
        }
    }

    /// @notice Disabiling the ability to push hashes to the hashArray of a specific campaign
    /// @param _airdropCampaignAddress - address of airdropCampaign contract
    function finalizeAirdrop(address _airdropCampaignAddress) public onlyAdmin {
        airdrops[_airdropCampaignAddress].airdropFinished = true;
        emit FinalizedAirdrop(_airdropCampaignAddress);
    }

    /// @notice Returns a bool showing if an airdrop is completed or not
    /// @param _airdropCampaignAddress - address of airdropCampaign contract
    function isAirdropFinished(address _airdropCampaignAddress) public view returns (bool) {
        return airdrops[_airdropCampaignAddress].airdropFinished == true;
    }
}
