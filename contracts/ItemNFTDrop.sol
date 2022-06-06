// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;


import "@rari-capital/solmate/src/tokens/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./AirdropInfo.sol";

contract ItemNFTDrop is ERC1155, AirdropInfo {

    uint256 public immutable maxSupply;
    uint256 public totalSupply;

    string public baseURI;
    bytes data;

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
        string memory _baseURI,
        bytes memory _data,
        bytes32 _merkleRoot
    ) ERC1155() {
        baseURI = _baseURI;
        rewardedNft = IERC721(_rewardedNft);
        maxSupply = _maxSupply;
        data = _data;
        merkleRoot = _merkleRoot;
    }

    function claim(uint256 tokenId, bytes32[] calldata _merkleProof) external {
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

        _mint(msg.sender, totalSupply++, 1, data);
    }

    function uri(uint256 id) public view override returns (string memory) {
        return string(abi.encodePacked(baseURI, id));
    }

    //@notice Get the type of airdrop, it's either ERC20, ERC721, ERC1155
    function getAirdropType() external pure returns (string memory){
        return "ERC1155";
    }

    //@notice Checks if the user is eligible for this airdrop
    function isEligibleForReward(uint256 tokenId) external view returns (bool){
        if (hasClaimed[tokenId]) revert AlreadyRedeemed();
        if (rewardedNft.ownerOf(tokenId) != msg.sender) revert NotOwner();
        return true;
    }

    //@notice Returns the amount(number) of airdrop tokens to claim
    //@param tokenId is the rewarded NFT collections token ID
    function getAirdropAmount() external view returns (uint256){
        return rewardedNft.balanceOf(msg.sender);
    }
}
