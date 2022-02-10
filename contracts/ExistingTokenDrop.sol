// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.11;

import "@rari-capital/solmate/src/tokens/ERC20.sol";
import "@rari-capital/solmate/src/tokens/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./AirdropInfo.sol";

contract ExistingTokenDrop is AirdropInfo {
    IERC721 public immutable rewardedNft;
    IERC20 public immutable rewardToken;
    uint256 public immutable tokensPerClaim;
    uint256 public immutable totalAirdropAmount;

    bool public airdropFunded = false;
    uint256 public airdropFundBlockTimestamp;
    address internal airdropFundingHolder;

    event Claimed(uint256 indexed tokenId, address indexed claimer);

    error NotOwner();
    error AirdropStillInProgress();
    error AlreadyRedeemed();
    error AlreadyFunded();
    error InsufficientAmount();
    error InsufficientLiquidity();

    mapping(uint256 => bool) public hasClaimed;

    constructor(
        address _rewardedNft,
        uint256 _tokensPerClaim,
        address _rewardToken,
        uint256 _totalAirdropAmount
    ) {
        rewardedNft = IERC721(_rewardedNft);
        tokensPerClaim = _tokensPerClaim;
        totalAirdropAmount = _totalAirdropAmount;
        rewardToken = IERC20(_rewardToken);
    }

    /// @notice Allows the airdrop creator to provide funds for airdrop reward
    function fundAirdrop() external {
        if (rewardToken.balanceOf(msg.sender) < totalAirdropAmount) revert InsufficientAmount();
        if (airdropFunded) revert AlreadyFunded();
        rewardToken.transferFrom(msg.sender, address(this), totalAirdropAmount);
        airdropFunded = true;
        airdropFundBlockTimestamp = block.timestamp;
        airdropFundingHolder = msg.sender;
    }

    /// @notice Allows the airdrop creator to withdraw back his funds after the airdrop has finished
    function withdrawAirdropFunds() external {
        if (airdropFundingHolder != msg.sender) revert NotOwner();
        if (block.timestamp < airdropFundBlockTimestamp + 30 days) revert AirdropStillInProgress();
        rewardToken.transfer(msg.sender, rewardToken.balanceOf(address(this)));
    }

    /// @notice Allows the NFT holder to claim his ERC20 airdrop
    function claim(uint256 tokenId) external {
        if (hasClaimed[tokenId]) revert AlreadyRedeemed();
        if (rewardToken.balanceOf(address(this)) < tokensPerClaim) revert InsufficientLiquidity();
        if (rewardedNft.ownerOf(tokenId) != msg.sender) revert NotOwner();

        hasClaimed[tokenId] = true;
        emit Claimed(tokenId, msg.sender);

        rewardToken.transfer(msg.sender, tokensPerClaim);
    }

    function batchClaim(uint256[] memory tokenIds) external {
        if (rewardToken.balanceOf(address(this)) < tokensPerClaim * tokenIds.length) revert InsufficientLiquidity();

        for (uint256 index = 0; index < tokenIds.length; index++) {
            uint256 tokenId = tokenIds[index];

            if (hasClaimed[tokenId]) revert AlreadyRedeemed();
            if (rewardedNft.ownerOf(tokenId) != msg.sender) revert NotOwner();

            hasClaimed[tokenId] = true;
            emit Claimed(tokenId, msg.sender);
        }

        rewardToken.transfer(msg.sender, tokensPerClaim * tokenIds.length);
    }

    //@notice Get the type of airdrop, it's either ERC20, ERC721, ERC1155
    function getAirdropType() external override view returns (string memory){
        return "ERC20";
    }

    //@notice Checks if the user is eligible for this airdrop
    function isEligibleForReward(uint256 tokenId) external view returns (bool){
        if (hasClaimed[tokenId]) revert AlreadyRedeemed();
        if (rewardToken.balanceOf(address(this)) < tokensPerClaim) revert InsufficientLiquidity();
        if (rewardedNft.ownerOf(tokenId) != msg.sender) revert NotOwner();
        return true;
    }

    //@notice Returns the amount(number) of airdrop tokens to claim
    //@param tokenId is the rewarded NFT collections token ID
    function getAirdropAmount() external view returns (uint256){
        return rewardedNft.balanceOf(msg.sender) * tokensPerClaim;
    }

}
