// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.11;

import "@rari-capital/solmate/src/tokens/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./AirdropInfo.sol";

contract NFTDrop is ERC721, AirdropInfo {
    uint256 public immutable maxSupply;
    uint256 public totalSupply;

    string public baseURI;

    IERC721 public immutable rewardedNft;

    event Claimed(uint256 indexed tokenId, address indexed claimer);

    error NotOwner();
    error AlreadyRedeemed();
    error DoesNotExist();
    error NoTokensLeft();
    error InvalidProof();

    mapping(uint256 => bool) public hasClaimed;

    // The root hash of the Merle Tree we previously generated in our JavaScript code. Remember
    // to provide this as a bytes32 type and not string. Ox should be prepended.
    bytes32 public immutable merkleRoot;

    constructor(
        address _rewardedNft,
        uint256 _maxSupply,
        string memory name,
        string memory symbol,
        string memory _baseURI,
        bytes32 _merkleRoot
    ) ERC721(name, symbol) {
        baseURI = _baseURI;
        rewardedNft = IERC721(_rewardedNft);
        maxSupply = _maxSupply;
        merkleRoot = _merkleRoot;
    }

    function claim(uint256 tokenId, bytes32[] calldata _merkleProof) external {
        // Basic data validation to ensure the wallet hasn't already claimed.
        if (hasClaimed[tokenId]) revert AlreadyRedeemed();

        if (rewardedNft.ownerOf(tokenId) != msg.sender) revert NotOwner();

        if (totalSupply + 1 >= maxSupply) revert NoTokensLeft();

        //check if merkle root hash exists
        if (merkleRoot != 0) {
            // Verify the provided _merkleProof, given to us through the API call on our website.
            bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
            if (!MerkleProof.verify(_merkleProof, merkleRoot, leaf)) revert InvalidProof();
        }

        hasClaimed[tokenId] = true;
        emit Claimed(tokenId, msg.sender);

        _mint(msg.sender, totalSupply++);
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        // if (ownerOf[id] == address(0)) revert DoesNotExist();

        return string(abi.encodePacked(baseURI, id));
    }

    function supportsInterface(bytes4 interfaceId) public pure override(ERC721) returns (bool) {
        return
            interfaceId == 0x7f5828d0 || // ERC165 Interface ID for ERC173
            interfaceId == 0x80ac58cd || // ERC165 Interface ID for ERC721
            interfaceId == 0x5b5e139f || // ERC165 Interface ID for ERC165
            interfaceId == 0x01ffc9a7;
        // ERC165 Interface ID for ERC721Metadata
    }

    //@notice Get the type of airdrop, it's either ERC20, ERC721, ERC1155
    function getAirdropType() external pure returns (string memory) {
        return "ERC721";
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
        return rewardedNft.balanceOf(msg.sender);
    }
}
