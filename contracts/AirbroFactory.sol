// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "./airdrops/TokenDrop.sol";
import "./airdrops/ExistingTokenDrop.sol";
import "./airdrops/Existing1155NftDrop.sol";

/// @title Airbro - NFT airdrop tool factory contract
contract AirbroFactory {
    // index of deployed airdrop contracts
    address[] public airdrops;
    uint256 public totalAirdropsCount;

    event NewAirdrop(address indexed rewardedNftCollection, address indexed airdropContract, address indexed airdropCreator);

    constructor() {}

    /// @notice Creates a new airdrop ERC20 claim contract for specific NFT collection holders
    /// @param rewardedNftCollection - Rewarded NFT collection address
    function dropNewTokensToNftHolders(
        address rewardedNftCollection,
        string memory newTokenName,
        string memory newTokenSymbol,
        uint256 tokensPerClaim,
        uint256 airdropDuration
    ) external {
        TokenDrop tokenDropContract = new TokenDrop(rewardedNftCollection, tokensPerClaim, newTokenName, newTokenSymbol, airdropDuration);

        airdrops.push(address(tokenDropContract));
        unchecked {
            totalAirdropsCount++;
        }
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
            airdropDuration
        );
        airdrops.push(address(tokenDropContract));
        unchecked {
            totalAirdropsCount++;
        }
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
        Existing1155NftDrop tokenDropContract = new Existing1155NftDrop(
            rewardedNftCollection,
            reward1155Nft,
            tokensPerClaim,
            tokenId,
            totalAirdropAmount,
            airdropDuration
        );
        airdrops.push(address(tokenDropContract));
        unchecked {
            totalAirdropsCount++;
        }
        emit NewAirdrop(rewardedNftCollection, address(tokenDropContract), msg.sender);
    }
}
