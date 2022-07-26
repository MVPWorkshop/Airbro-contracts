// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "../interfaces/IAirBroFactory.sol";

/// @title Airdrops existing ERC1155 tokens for airdrop recipients
contract Existing1155NftDrop is IERC1155Receiver {
    IERC721 public immutable rewardedNft;
    IERC1155 public immutable rewardToken;
    uint256 public immutable rewardTokenId;
    uint256 public immutable tokensPerClaim;
    uint256 public immutable totalAirdropAmount;
    uint256 public immutable airdropDuration;
    uint256 public immutable airdropStartTime;
    uint256 public immutable airdropFinishTime;

    mapping(uint256 => bool) public hasClaimed;
    string public constant airdropType = "ERC1155";
    uint256 public airdropFundBlockTimestamp;
    bool public airdropFunded;

    address internal airdropFundingHolder;

    event Claimed(uint256 indexed tokenId, address indexed claimer);
    event AirdropFunded(address contractAddress);

    error Unauthorized();
    error AirdropStillInProgress();
    error AlreadyRedeemed();
    error AlreadyFunded();
    error AirdropExpired();

    constructor(
        address _rewardedNft,
        address _reward1155Nft,
        uint256 _tokensPerClaim,
        uint256 _tokenId,
        uint256 _totalAirdropAmount,
        uint256 _airdropDuration
    ) {
        rewardedNft = IERC721(_rewardedNft);
        tokensPerClaim = _tokensPerClaim;
        totalAirdropAmount = _totalAirdropAmount;
        rewardToken = IERC1155(_reward1155Nft);
        rewardTokenId = _tokenId;
        airdropDuration = _airdropDuration * 1 days;
        airdropStartTime = block.timestamp;
        airdropFinishTime = block.timestamp + airdropDuration;
    }

    /// @notice Allows the airdrop creator to provide funds for airdrop reward
    function fundAirdrop() external {
        if (airdropFunded) revert AlreadyFunded();

        airdropFunded = true;
        airdropFundBlockTimestamp = block.timestamp;
        airdropFundingHolder = msg.sender;

        rewardToken.safeTransferFrom(msg.sender, address(this), rewardTokenId, totalAirdropAmount, "");
        emit AirdropFunded(address(this));
    }

    /// @notice Allows the airdrop creator to withdraw back his funds after the airdrop has finished
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

    /// @notice Allows the NFT holder to claim all his ERC1155 airdrops
    /// @param tokenIds the token id based on which the user wishes to claim the reward
    function batchClaim(uint256[] memory tokenIds) external {
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
    /// @return bool if user is eligible for reward
    function isEligibleForReward(uint256 tokenId) public view returns (bool) {
        if ((block.timestamp > airdropFinishTime) || (hasClaimed[tokenId]) || (rewardedNft.ownerOf(tokenId) != msg.sender)) {
            return false;
        }
        return true;
    }

    /// @notice Validation for claiming a reward (excluding the block.timestamp check)
    /// @param tokenId the token id based on which the user wishes to claim the reward
    function validateClaim(uint256 tokenId) internal view {
        if (hasClaimed[tokenId]) revert AlreadyRedeemed();
        if (rewardedNft.ownerOf(tokenId) != msg.sender) revert Unauthorized();
    }

    /// @notice Returns the amount(number) of airdrop tokens to claim
    function getAirdropAmount() external view returns (uint256) {
        return rewardedNft.balanceOf(msg.sender) * tokensPerClaim;
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
