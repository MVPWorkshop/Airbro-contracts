// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@rari-capital/solmate/src/tokens/ERC20.sol";
import "@rari-capital/solmate/src/tokens/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/// @title Airdrops new ERC20 tokens for airdrop recipients
contract TokenDrop is ERC20 {
    IERC721 public immutable rewardedNft;
    uint256 public immutable tokensPerClaim;
    uint256 public immutable airdropDuration;
    uint256 public immutable airdropStartTime;
    uint256 public immutable airdropFinishTime;

    mapping(uint256 => bool) public hasClaimed;
    string public constant airdropType = "ERC20";

    event Claimed(uint256 indexed tokenId, address indexed claimer);

    error AlreadyRedeemed();
    error AirdropExpired();
    error Unauthorized();
    error NotEligible();

    constructor(
        address _rewardedNft,
        uint256 _tokensPerClaim,
        string memory name,
        string memory symbol,
        uint256 _airdropDuration
    ) ERC20(name, symbol, 18) {
        rewardedNft = IERC721(_rewardedNft);
        tokensPerClaim = _tokensPerClaim;
        airdropDuration = _airdropDuration * 1 days;
        airdropStartTime = block.timestamp;
        airdropFinishTime = block.timestamp + airdropDuration;
    }

    /// @notice Allows the NFT holder to claim their ERC20 airdrop
    /// @param tokenId is the rewarded NFT collections token ID
    function claim(uint256 tokenId) external {
        validateClaim(tokenId);

        hasClaimed[tokenId] = true;

        _mint(msg.sender, tokensPerClaim);
        emit Claimed(tokenId, msg.sender);
    }

    /// @notice Claim multiple ERC20 airdrops at once
    /// @param tokenIds are the rewarded NFT collections token ID's
    function batchClaim(uint256[] calldata tokenIds) external {
        if (block.timestamp > airdropFinishTime) revert AirdropExpired();

        for (uint256 index = 0; index < tokenIds.length; index++) {
            uint256 tokenId = tokenIds[index];

            validateClaim(tokenId);

            hasClaimed[tokenId] = true;
            emit Claimed(tokenId, msg.sender);
        }

        _mint(msg.sender, tokensPerClaim * tokenIds.length);
    }

    /// @notice Checks if the user is eligible for this airdrop
    /// @param tokenId is the rewarded NFT token ID
    function isEligibleForReward(uint256 tokenId) public view returns (bool) {
        if ((block.timestamp > airdropFinishTime) || (hasClaimed[tokenId]) || (rewardedNft.ownerOf(tokenId) != msg.sender)) {
            return false;
        }
        return true;
    }

    /// @notice Validation for claiming a reward (without the block.timestamp check)
    /// @param tokenId is the rewarded NFT token ID
    function validateClaim(uint256 tokenId) internal view {
        if (hasClaimed[tokenId]) revert AlreadyRedeemed();
        if (rewardedNft.ownerOf(tokenId) != msg.sender) revert Unauthorized();
    }

    /// @notice Returns the amount of airdrop tokens a user can claim
    function getAirdropAmount() external view returns (uint256) {
        return rewardedNft.balanceOf(msg.sender) * tokensPerClaim;
    }
}
