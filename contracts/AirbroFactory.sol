// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.11;

import "./TokenDrop.sol";
import "./NFTDrop.sol";

/// @title Airbro - NFT airdrop tool factory contract
contract AirbroFactory {
    event NewAirdrop(address indexed rewardedNftCollection, address indexed airdropContract);

    constructor() {}

    /// @notice Creates a new airdrop ERC20 claim contract for specific NFT collection holders
    /// @param rewardedNftCollection - Rewarded NFT collection address
    function dropNewTokensToNftHolders(
        address rewardedNftCollection,
        string memory newTokenName,
        string memory newTokenSymbol,
        uint256 tokensPerClaim
    ) external {
        TokenDrop tokenDropContract = new TokenDrop(
            rewardedNftCollection,
            tokensPerClaim,
            newTokenName,
            newTokenSymbol
        );

        emit NewAirdrop(rewardedNftCollection, address(tokenDropContract));
    }

    /// @notice Creates a new airdrop ERC721 claim contract for specific NFT collection holders
    /// @param rewardedNftCollection - Rewarded NFT collection address
    /// @param newNftCollectionName - new ERC721 name
    /// @param newNftCollectionSymbol - new ERC721 symbol
    /// @param baseUri - new ERC721 baseUri
    function dropNftsToNftHolders(
        address rewardedNftCollection,
        string memory newNftCollectionName,
        string memory newNftCollectionSymbol,
        uint256 newNftSupply,
        string memory baseUri
    ) external {
        NFTDrop nftDropContract = new NFTDrop(
            rewardedNftCollection,
            newNftSupply,
            newNftCollectionName,
            newNftCollectionSymbol,
            baseUri
        );

        emit NewAirdrop(rewardedNftCollection, address(nftDropContract));
    }
}
