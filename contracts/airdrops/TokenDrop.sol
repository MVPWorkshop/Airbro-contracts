// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "@rari-capital/solmate/src/tokens/ERC20.sol";
import "@rari-capital/solmate/src/tokens/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../interfaces/AirdropInfo.sol";
import "../interfaces/AirdropMerkleProof.sol";

/// @title Airdrops new ERC20 tokens for airdrop recipients
contract TokenDrop is ERC20, AirdropInfo, AirdropMerkleProof {
    IERC721 public immutable rewardedNft;
    uint256 public immutable tokensPerClaim;

    event Claimed(uint256 indexed tokenId, address indexed claimer);

    error NotOwner();
    error AlreadyRedeemed();
    error AirdropExpired();

    mapping(uint256 => bool) public hasClaimed;

    // The root hash of the Merle Tree we previously generated in our JavaScript code. Remember
    // to provide this as a bytes32 type and not string. Ox should be prepended.
    bytes32 public immutable merkleRoot;

    uint256 public immutable airdropDuration;
    uint256 public immutable airdropStartTime;
    uint256 public immutable airdropFinishTime;

    constructor(
        address _rewardedNft,
        uint256 _tokensPerClaim,
        string memory name,
        string memory symbol,
        uint256 _airdropDuration,
        bytes32 _merkleRoot
    ) ERC20(name, symbol, 18) {
        rewardedNft = IERC721(_rewardedNft);
        tokensPerClaim = _tokensPerClaim;
        merkleRoot = _merkleRoot;
        airdropDuration = _airdropDuration * 1 days;
        airdropStartTime = block.timestamp;
        airdropFinishTime = block.timestamp + airdropDuration;
    }

    function claim(uint256 tokenId, bytes32[] calldata _merkleProof) external {
        if (hasClaimed[tokenId]) revert AlreadyRedeemed();
        if (rewardedNft.ownerOf(tokenId) != msg.sender) revert NotOwner();
        if (block.timestamp > airdropFinishTime) revert AirdropExpired();

        checkProof(_merkleProof, merkleRoot);

        hasClaimed[tokenId] = true;
        emit Claimed(tokenId, msg.sender);

        _mint(msg.sender, tokensPerClaim);
    }

    function batchClaim(uint256[] memory tokenIds, bytes32[] calldata _merkleProof) external {
        if (block.timestamp > airdropFinishTime) revert AirdropExpired();
        checkProof(_merkleProof, merkleRoot);

        for (uint256 index = 0; index < tokenIds.length; index++) {
            uint256 tokenId = tokenIds[index];

            if (hasClaimed[tokenId]) revert AlreadyRedeemed();
            if (rewardedNft.ownerOf(tokenId) != msg.sender) revert NotOwner();

            hasClaimed[tokenId] = true;
            emit Claimed(tokenId, msg.sender);
        }

        _mint(msg.sender, tokensPerClaim * tokenIds.length);
    }

    //@notice Get the type of airdrop, it's either ERC20, ERC721, ERC1155
    function getAirdropType() external pure returns (string memory) {
        return "ERC20";
    }

    //@notice Checks if the user is eligible for this airdrop
    function isEligibleForReward(uint256 tokenId) external view returns (bool) {
        if (hasClaimed[tokenId]) revert AlreadyRedeemed();
        if (rewardedNft.ownerOf(tokenId) != msg.sender) revert NotOwner();
        return true;
    }

    //@notice Returns the amount(number) of airdrop tokens to claim
    //@param tokenId is the rewarded NFT collections token ID
    function getAirdropAmount() external view returns (uint256) {
        return rewardedNft.balanceOf(msg.sender) * tokensPerClaim;
    }

    function getAirdropFinishTime() external view override returns (uint256) {
        return airdropFinishTime;
    }

    function getAirdropDuration() external view override returns (uint256) {
        return airdropDuration;
    }

    function getAirdropStartTime() external view override returns (uint256) {
        return airdropStartTime;
    }
}