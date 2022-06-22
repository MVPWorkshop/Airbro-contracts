// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "./airdrops/TokenDrop.sol";
import "./airdrops/ExistingTokenDrop.sol";
//import "./NFTDrop.sol";
import "./airdrops/Existing1155NftDrop.sol";

/// @title Airbro - NFT airdrop tool factory contract
contract AirbroFactory {
    // index of deployed airdrop contracts
    address[] public airdrops;
    uint256 public totalAirdropsCount = 0;
    address public admin;

    event NewAirdrop(address indexed rewardedNftCollection, address indexed airdropContract, address indexed airdropCreator);
    event AdminChanged(address indexed adminAddress);

    error NotAdmin();

    modifier onlyAdmin(){
        if(msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor() {
        admin = 0xF4b5bFB92dD4E6D529476bCab28A65bb6B32EFb3;
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
        TokenDrop tokenDropContract = new TokenDrop(
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
        ExistingTokenDrop tokenDropContract = new ExistingTokenDrop(
            rewardedNftCollection,
            tokensPerClaim,
            rewardToken,
            totalAirdropAmount,
            airdropDuration,
            admin
        );
        airdrops.push(address(tokenDropContract));
        totalAirdropsCount++;
        emit NewAirdrop(rewardedNftCollection, address(tokenDropContract), msg.sender);
    }

    /// @notice Creates a new airdrop ERC721 claim contract for specific NFT collection holders
    /// @param rewardedNftCollection - Rewarded NFT collection address
    /// @param newNftCollectionName - new ERC721 name
    /// @param newNftCollectionSymbol - new ERC721 symbol
    /// @param baseUri - new ERC721 baseUri
    //    function dropNftsToNftHolders(
    //        address rewardedNftCollection,
    //        string memory newNftCollectionName,
    //        string memory newNftCollectionSymbol,
    //        uint256 newNftSupply,
    //        string memory baseUri,
    //        uint256 aidropDuration
    //        bytes32 merkleRootHash
    //    ) external {
    //        NFTDrop nftDropContract = new NFTDrop(
    //            rewardedNftCollection,
    //            newNftSupply,
    //            newNftCollectionName,
    //            newNftCollectionSymbol,
    //            baseUri,
    //            aidropDuration,
    //            merkleRootHash
    //        );
    //        airdrops.push(address(nftDropContract));
    //        totalAirdropsCount++;
    //        emit NewAirdrop(rewardedNftCollection, address(nftDropContract), msg.sender);
    //    }

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
        Existing1155NftDrop tokenDropContract = new Existing1155NftDrop(
            rewardedNftCollection,
            reward1155Nft,
            tokensPerClaim,
            tokenId,
            totalAirdropAmount,
            airdropDuration,
            admin
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
