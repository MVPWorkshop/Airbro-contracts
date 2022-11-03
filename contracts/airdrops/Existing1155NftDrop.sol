// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "./shared/AirdropExistingToken.sol";

/// @title Airdrops existing ERC1155 tokens for airdrop recipients
contract Existing1155NftDrop is IERC1155Receiver, AirdropExistingToken {
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
    ) AirdropExistingToken(_rewardedNft, _tokensPerClaim, _totalAirdropAmount, _airdropDuration) {
        rewardToken = IERC1155(_reward1155Nft);
        rewardTokenId = _tokenId;
    }

    /// @notice Allows one wallet to provide funds for the airdrop reward once
    /// @dev Implements a handler method from the parent contract for checks and state change
    function fundAirdrop() public virtual {
        super.fundAirdropHandler();
        rewardToken.safeTransferFrom(msg.sender, address(this), rewardTokenId, totalAirdropAmount, "");
    }

    /// @notice Allows the airdrop funder to withdraw back their funds after the airdrop has finished
    /// @dev Implements a handler method from the parent contract for checks
    function withdrawAirdropFunds() external virtual {
        super.withdrawAirdropFundsHandler();
        rewardToken.safeTransferFrom(address(this), msg.sender, rewardTokenId, rewardToken.balanceOf(address(this), rewardTokenId), "");
    }

    /// @notice Allows the NFT holder to claim his ERC1155 airdrop
    /// @dev Implements a handler method from the parent contract for checks and state change
    /// @param tokenId the token id based on which the user wishes to claim the reward
    function claim(uint256 tokenId) external virtual {
        super.claimHandler(tokenId);
        rewardToken.safeTransferFrom(address(this), msg.sender, rewardTokenId, tokensPerClaim, "");
    }

    /// @notice Allows the NFT holder to claim all their ERC1155 airdrops
    /// @dev Implements a handler method from the parent contract for checks and state change
    /// @param tokenIds are the rewarded NFT collections token ID's
    function batchClaim(uint256[] calldata tokenIds) external virtual {
        super.batchClaimHandler(tokenIds);
        rewardToken.safeTransferFrom(address(this), msg.sender, rewardTokenId, tokensPerClaim * tokenIds.length, "");
    }

    /// @notice Implemented method in acordance with the ERC1155 standard to indicate support of ERC1155Recievable
    /// @dev Necessary implementation for ERC1155Recievable
    /// @return true if interfaceId is '0xf23a6e61'
    function supportsInterface(bytes4 interfaceId) external pure override returns (bool) {
        return interfaceId == 0xf23a6e61;
    }

    /// @notice Implemented method in acordance with the ERC1155 standard to indicate support of ERC1155Recievable
    /// @dev Necessary implementation for ERC1155Recievable
    /// @return selector for onERC1155Received
    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    /// @notice Implemented method in acordance with the ERC1155 standard to indicate support of ERC1155Recievable
    /// @dev Necessary implementation for ERC1155Recievable
    /// @return selector for onERC1155BatchReceived
    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}
