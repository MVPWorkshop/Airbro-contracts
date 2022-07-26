// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

/// @title AirdropCampaignData - Data contract for storing of daily merkleRootHashes of airbro Campaigns
contract AirdropCampaignData {
    address public admin;

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
    error ChainDataNotSet();
    error ChainAlreadySet();
    error AirdropHasFinished();
    error AlreadyFinalized();

    event AdminChanged(address adminAddress);
    event MerkleRootHashAdded(address indexed airdropCampaignAddress, bytes32 indexed merkleRootHash);
    event ChainAdded(address indexed airdropCampaignAddress, Chains indexed airdropChain);
    event FinalizedAirdrop(address indexed airdropCampaignAddress);

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(address _admin) {
        admin = _admin;
    }

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
        if (airdrops[_airdropCampaignAddress].airdropFinished) revert AirdropHasFinished();
        if (airdrops[_airdropCampaignAddress].chain == Chains.Zero) revert ChainDataNotSet();

        airdrops[_airdropCampaignAddress].hashArray.push(_merkleRootHash);
        emit MerkleRootHashAdded(_airdropCampaignAddress, _merkleRootHash);
    }

    /// @notice Adds array of daily merkle root hashes for multiple airdropCampaign contracts
    /// @param _airdropCampaignAddressArray - array of addresses of multiple airdropCampaign contracts whose current participants are in the daily merkleRootHash
    /// @param _merkleRootHashArray - array of merkle root hashes of daily participants of multiple airdropCampaigns
    function batchAddDailyMerkleRootHash(address[] calldata _airdropCampaignAddressArray, bytes32[] calldata _merkleRootHashArray)
        external
        onlyAdmin
    {
        uint256 airdropHashArrayLength = _merkleRootHashArray.length;
        if (airdropHashArrayLength != _airdropCampaignAddressArray.length) revert UnequalArrays();

        for (uint256 i; i < airdropHashArrayLength; i++) {
            address currentCampaignAddress = _airdropCampaignAddressArray[i];
            bytes32 currentMerkleRootHash = _merkleRootHashArray[i];

            if (airdrops[currentCampaignAddress].chain == Chains.Zero) revert ChainDataNotSet();
            if (airdrops[currentCampaignAddress].airdropFinished) revert AirdropHasFinished();

            airdrops[currentCampaignAddress].hashArray.push(currentMerkleRootHash);
            emit MerkleRootHashAdded(currentCampaignAddress, currentMerkleRootHash);
        }
    }

    /// @notice Adds string "ETH" or "POL" to mapping depending on which network the airdropCampaign contract is on
    /// @param _airdropCampaignAddress - address of airdropCampaign contract
    /// @param _airdropChain - string representing blockchain Chain
    function addAirdropCampaignChain(address _airdropCampaignAddress, Chains _airdropChain) external onlyAdmin {
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
        onlyAdmin
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
    function finalizeAirdrop(address _airdropCampaignAddress) public onlyAdmin {
        if (airdrops[_airdropCampaignAddress].airdropFinished) revert AlreadyFinalized();
        if (airdrops[_airdropCampaignAddress].chain == Chains.Zero) revert ChainDataNotSet();

        airdrops[_airdropCampaignAddress].airdropFinished = true;
        emit FinalizedAirdrop(_airdropCampaignAddress);
    }
}
