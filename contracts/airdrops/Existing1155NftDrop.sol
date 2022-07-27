// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

import "../interfaces/airdrops/AirdropExistingToken.sol";
import "../interfaces/airdrops/AirdropTimeData.sol";

/// @title Airdrops existing ERC1155 tokens for airdrop recipients
contract Existing1155NftDrop is IERC1155Receiver, AirdropExistingToken, AirdropTimeData {
    IERC1155 public immutable rewardToken;
    uint256 public immutable rewardTokenId;

    string public constant airdropType = "ERC1155";

    constructor(
        address _rewardedNft,
        address _reward1155Nft,
        uint256 _tokensPerClaim,
        uint256 _tokenId,
        uint256 _totalAirdropAmount,
        uint256 _airdropDuration
    ) AirdropExistingToken(_rewardedNft, _tokensPerClaim, _totalAirdropAmount) AirdropTimeData(_airdropDuration) {
        rewardToken = IERC1155(_reward1155Nft);
        rewardTokenId = _tokenId;
    }

    /// @notice Allows one wallet to provide funds for the airdrop reward once
    function fundAirdrop() external {
        if (airdropFunded) revert AlreadyFunded();

        airdropFunded = true;
        airdropFundBlockTimestamp = block.timestamp;
        airdropFundingHolder = msg.sender;

        rewardToken.safeTransferFrom(msg.sender, address(this), rewardTokenId, totalAirdropAmount, "");
        emit AirdropFunded(address(this));
    }

    /// @notice Allows the airdrop funder to withdraw back their funds after the airdrop has finished
    function withdrawAirdropFunds() external {
        if (airdropFundingHolder != msg.sender) revert Unauthorized();
        if (block.timestamp < airdropFinishTime) revert AirdropStillInProgress();

        rewardToken.safeTransferFrom(address(this), msg.sender, rewardTokenId, rewardToken.balanceOf(address(this), rewardTokenId), "");
    }

    /// @notice Allows the NFT holder to claim his ERC1155 airdrop
    /// @param tokenId the token id based on which the user wishes to claim the reward
    function claim(uint256 tokenId) external {
        validateClaim(tokenId);
        if (block.timestamp > airdropFinishTime) revert AirdropExpired();

        hasClaimed[tokenId] = true;

        rewardToken.safeTransferFrom(address(this), msg.sender, rewardTokenId, tokensPerClaim, "");
        emit Claimed(tokenId, msg.sender);
    }

    /// @notice Allows the NFT holder to claim all their ERC1155 airdrops
    /// @param tokenIds are the rewarded NFT collections token ID's
    function batchClaim(uint256[] calldata tokenIds) external {
        if (block.timestamp > airdropFinishTime) revert AirdropExpired();

        for (uint256 index = 0; index < tokenIds.length; index++) {
            uint256 tokenId = tokenIds[index];

            validateClaim(tokenId);

            hasClaimed[tokenId] = true;
            emit Claimed(tokenId, msg.sender);
        }

        rewardToken.safeTransferFrom(address(this), msg.sender, rewardTokenId, tokensPerClaim * tokenIds.length, "");
    }

    /// @notice Checks if the user is eligible for this airdrop
    /// @param tokenId the token id based on which the user wishes to claim the reward
    /// @return true if user is eligible to receive a reward
    function isEligibleForReward(uint256 tokenId) public view returns (bool) {
        if ((block.timestamp > airdropFinishTime) || (hasClaimed[tokenId]) || (rewardedNft.ownerOf(tokenId) != msg.sender)) {
            return false;
        }
        return true;
    }

    function supportsInterface(bytes4 interfaceId) external pure override returns (bool) {
        return interfaceId == 0xf23a6e61;
    }

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}
