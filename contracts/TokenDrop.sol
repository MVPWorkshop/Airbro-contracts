// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.11;

import "@rari-capital/solmate/src/tokens/ERC20.sol";
import "@rari-capital/solmate/src/tokens/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract TokenDrop is ERC20 {
    IERC721 public immutable rewardedNft;
    uint256 public immutable tokensPerClaim;

    event Claimed(uint256 indexed tokenId, address indexed claimer);

    error NotOwner();
    error AlreadyRedeemed();

    mapping(uint256 => bool) public hasClaimed;

    constructor(
        address _rewardedNft,
        uint256 _tokensPerClaim,
        string memory name,
        string memory symbol
    ) ERC20(name, symbol, 18) {
        rewardedNft = IERC721(_rewardedNft);
        tokensPerClaim = _tokensPerClaim;
    }

    function claim(uint256 tokenId) external {
        if (hasClaimed[tokenId]) revert AlreadyRedeemed();
        if (rewardedNft.ownerOf(tokenId) != msg.sender) revert NotOwner();

        hasClaimed[tokenId] = true;
        emit Claimed(tokenId, msg.sender);

        _mint(msg.sender, tokensPerClaim);
    }

    function batchClaim(uint256[] memory tokenIds) external {
        for (uint256 index = 0; index < tokenIds.length; index++) {
            uint256 tokenId = tokenIds[index];

            if (hasClaimed[tokenId]) revert AlreadyRedeemed();
            if (rewardedNft.ownerOf(tokenId) != msg.sender) revert NotOwner();

            hasClaimed[tokenId] = true;
            emit Claimed(tokenId, msg.sender);
        }

        _mint(msg.sender, tokensPerClaim * tokenIds.length);
    }
}
