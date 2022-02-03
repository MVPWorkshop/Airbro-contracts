// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.11;

import "@rari-capital/solmate/src/tokens/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTDrop is ERC721 {

    uint256 public immutable maxSupply;
    uint256 public totalSupply;

    string public baseURI;

    IERC721 public immutable rewardedNft;

    event Claimed(uint256 indexed tokenId, address indexed claimer);

    error NotOwner();
    error AlreadyRedeemed();
    error DoesNotExist();
    error NoTokensLeft();

    mapping(uint256 => bool) public hasClaimed;

    constructor(
        address _rewardedNft,
        uint256 _maxSupply,
        string memory name,
        string memory symbol,
        string memory _baseURI
    ) payable ERC721(name, symbol) {
        baseURI = _baseURI;
        rewardedNft = IERC721(_rewardedNft);
        maxSupply = _maxSupply;
    }

    function mint(uint256 tokenId) external {
        if (hasClaimed[tokenId]) revert AlreadyRedeemed();
        if (rewardedNft.ownerOf(tokenId) != msg.sender) revert NotOwner();
        if (totalSupply + 1 >= maxSupply) revert NoTokensLeft();

        hasClaimed[tokenId] = true;
        emit Claimed(tokenId, msg.sender);

        _mint(msg.sender, totalSupply++);
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        if (ownerOf[id] == address(0)) revert DoesNotExist();

        return string(abi.encodePacked(baseURI, id));
    }

    function supportsInterface(bytes4 interfaceId)
    public
    pure
    override(ERC721)
    returns (bool)
    {
        return
        interfaceId == 0x7f5828d0 || // ERC165 Interface ID for ERC173
        interfaceId == 0x80ac58cd || // ERC165 Interface ID for ERC721
        interfaceId == 0x5b5e139f || // ERC165 Interface ID for ERC165
        interfaceId == 0x01ffc9a7;
        // ERC165 Interface ID for ERC721Metadata
    }
}
