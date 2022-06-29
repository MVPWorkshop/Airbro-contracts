// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "./airdrops1155Holder/TokenDrop1155.sol";
import "./airdrops1155Holder/ExistingTokenDrop1155.sol";
import "./airdrops1155Holder/Existing1155NftDrop1155.sol";
import "./Airbro1155Contract.sol";


/// @title Airbro - NFT airdrop tool factory contract - for owners of 1155 Nfts
contract AirbroFactory1155Holder {
    // index of deployed airdrop contracts
    address[] public airdrops;
    uint256 public totalAirdropsCount = 0;
    address public admin = 0xF4b5bFB92dD4E6D529476bCab28A65bb6B32EFb3;

    address[] public nft1155Contracts;
    uint256 public totalNft1155ContractsCount = 0;

    event NewAirdrop(address indexed rewardedNftCollection, address indexed airdropContract, address indexed airdropCreator);
    event NewNft1155Contract(address indexed nft1155Contract, address indexed contractCreator);
    
    event AdminChanged(address indexed adminAddress);


    error NotAdmin();

    modifier onlyAdmin(){
        if(msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor() {}

    /// @notice Creates a new ERC1155 collection
    /// @param uri - IPFS link to the NFT image
    function createNewNft1155Contract (
        string memory uri
    ) public {
        AirBro1155Contract nft1155Contract = new AirBro1155Contract(
            uri
        );

        nft1155Contracts.push(address(nft1155Contract));
        totalNft1155ContractsCount++;
        emit NewNft1155Contract(address(nft1155Contract), msg.sender);
    }

    /// @notice Creates a new airdrop ERC20 claim contract for specific NFT collection holders
    /// @param rewardedNftCollection - Rewarded NFT collection address
    function dropNewTokensToNftHolders(
        address rewardedNftCollection,
        string memory newTokenName,
        string memory newTokenSymbol,
        uint256 tokensPerClaim,
        uint256 airdropDuration
    ) external {
        TokenDrop1155 tokenDropContract = new TokenDrop1155(
            rewardedNftCollection,
            tokensPerClaim,
            newTokenName,
            newTokenSymbol,
            airdropDuration,
            address(this) // airBroFactory contract address -> used for getting back admin contract address in airdrop contracts

        );

        airdrops.push(address(tokenDropContract));
        totalAirdropsCount++;
        emit NewAirdrop(rewardedNftCollection, address(tokenDropContract), msg.sender);
    }

    /// @notice Creates a new airdrop claim contract for specific NFT collection holders
    /// @param rewardedNftCollection - Rewarded NFT collection address
    /// @param rewardToken - ERC20 token's address that will be distributed as a reward
    /// @param tokensPerClaim - airdrop reward size for each NFT holder
    /// @param totalAirdropAmount - total amount of ERC20 tokens to be supplied for the rewards
    function dropExistingTokensToNftHolders(
        address rewardedNftCollection,
        uint256 tokensPerClaim,
        address rewardToken,
        uint256 totalAirdropAmount,
        uint256 airdropDuration
    ) external {
        ExistingTokenDrop1155 tokenDropContract = new ExistingTokenDrop1155(
            rewardedNftCollection,
            tokensPerClaim,
            rewardToken,
            totalAirdropAmount,
            airdropDuration,
            address(this) // airBroFactory contract address -> used for getting back admin contract address in airdrop contracts
        );
        airdrops.push(address(tokenDropContract));
        totalAirdropsCount++;
        emit NewAirdrop(rewardedNftCollection, address(tokenDropContract), msg.sender);
    }


    /// @notice Creates a new airdrop claim contract for specific NFT collection holders
    /// @param rewardedNftCollection - Rewarded NFT collection address
    /// @param reward1155Nft - ERC1155 token's address that will be distributed as a reward
    /// @param tokenId - token ID of ERC1155 reward token
    /// @param tokensPerClaim - airdrop reward size for each NFT holder
    /// @param totalAirdropAmount - total amount of ERC20 tokens to be supplied for the rewards
    function dropExisting1155NftsToNftHolders(
        address rewardedNftCollection,
        address reward1155Nft,
        uint256 tokensPerClaim,
        uint256 tokenId,
        uint256 totalAirdropAmount,
        uint256 airdropDuration
    ) external {
        Existing1155NftDrop1155 tokenDropContract = new Existing1155NftDrop1155(
            rewardedNftCollection,
            reward1155Nft,
            tokensPerClaim,
            tokenId,
            totalAirdropAmount,
            airdropDuration,
            address(this) // airBroFactory contract address -> used for getting back admin contract address in airdrop contracts
        );
        airdrops.push(address(tokenDropContract));
        totalAirdropsCount++;
        emit NewAirdrop(rewardedNftCollection, address(tokenDropContract), msg.sender);
    }

    /// @notice Updates the address of the admin variable
    /// @param _newAdmin - New address for the admin of this contract, and the address for all newly created airdrop contracts
    function changeAdmin(address _newAdmin) external onlyAdmin {
        admin = _newAdmin;
        emit AdminChanged(_newAdmin);
    }
}