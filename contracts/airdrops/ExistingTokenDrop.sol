// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./shared/AirdropExistingToken.sol";

/// @title Airdrops existing ERC20 tokens for airdrop recipients
contract ExistingTokenDrop is AirdropExistingToken {
    using SafeERC20 for IERC20;

    IERC20 public immutable rewardToken;

    string public constant airdropType = "ERC20";

    constructor(
        address _rewardedNft,
        uint256 _tokensPerClaim,
        address _rewardToken,
        uint256 _totalAirdropAmount,
        uint256 _airdropDuration
    ) AirdropExistingToken(_rewardedNft, _tokensPerClaim, _totalAirdropAmount, _airdropDuration) {
        rewardToken = IERC20(_rewardToken);
    }

    /// @notice Allows one wallet to provide funds for the airdrop reward once
    /// @dev Implements a handler method from the parent contract for checks and state change
    function fundAirdrop() external virtual {
        super.fundAirdropHandler();
        rewardToken.safeTransferFrom(msg.sender, address(this), totalAirdropAmount);
    }

    /// @notice Allows the airdrop funder to withdraw back their funds after the airdrop has finished
    /// @dev Implements a handler method from the parent contract for checks
    function withdrawAirdropFunds() external virtual {
        super.withdrawAirdropFundsHandler();
        rewardToken.safeTransfer(msg.sender, rewardToken.balanceOf(address(this)));
    }

    /// @notice Allows the NFT holder to claim their ERC20 airdrop
    /// @dev Implements a handler method from the parent contract for checks and state change
    /// @param tokenId is the rewarded NFT collections token ID
    function claim(uint256 tokenId) external virtual {
        super.claimHandler(tokenId);
        rewardToken.safeTransfer(msg.sender, tokensPerClaim);
    }

    /// @notice Claim multiple ERC20 airdrops at once
    /// @dev Implements a handler method from the parent contract for checks and state change
    /// @param tokenIds are the rewarded NFT collections token ID's
    function batchClaim(uint256[] calldata tokenIds) external virtual {
        super.batchClaimHandler(tokenIds);
        rewardToken.safeTransfer(msg.sender, tokensPerClaim * tokenIds.length);
    }
}
