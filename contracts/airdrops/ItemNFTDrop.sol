// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "@rari-capital/solmate/src/tokens/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../interfaces/AirdropInfo.sol";
import "../interfaces/AirdropMerkleProof.sol";
import "../interfaces/IAirBroFactory.sol";

/// @title Airdrops new ERC1155 tokens for airdrop recipients
contract ItemNFTDrop is ERC1155, AirdropInfo, AirdropMerkleProof {
    uint256 public immutable maxSupply;
    uint256 public totalSupply;
    address public immutable airBroFactoryAddress;

    string public baseURI;
    string airdropType = "ERC1155";
    bytes data;

    IERC721 public immutable rewardedNft;

    event Claimed(uint256 indexed tokenId, address indexed claimer);
    event AdminChanged(address indexed adminAddress);
    event MerkleRootChanged(bytes32 merkleRoot);

    error NotOwner();
    error AlreadyRedeemed();
    error DoesNotExist();
    error NoTokensLeft();
    error AirdropExpired();
    error NotAdmin();

    mapping(uint256 => bool) public hasClaimed;

    // The root hash of the Merle Tree we previously generated in our JavaScript code. Remember
    // to provide this as a bytes32 type and not string. Ox should be prepended.
    bytes32 public merkleRoot;

    uint256 public immutable airdropDuration;
    uint256 public immutable airdropStartTime;
    uint256 public immutable airdropFinishTime;

    modifier onlyAdmin() {
        if (msg.sender != IAirBroFactory(airBroFactoryAddress).admin()) revert NotAdmin();
        _;
    }

    constructor(
        address _rewardedNft,
        uint256 _maxSupply,
        string memory _baseURI,
        bytes memory _data,
        uint256 _airdropDuration,
        address _airBroFactoryAddress
    ) ERC1155() {
        baseURI = _baseURI;
        rewardedNft = IERC721(_rewardedNft);
        maxSupply = _maxSupply;
        data = _data;
        airdropDuration = _airdropDuration * 1 days;
        airdropStartTime = block.timestamp;
        airdropFinishTime = block.timestamp + airdropDuration;
        airBroFactoryAddress = _airBroFactoryAddress;
    }

    /// @notice Sets the merkleRoot - can only be done if admin (different from the contract owner)
    /// @param _merkleRoot - The root hash of the Merle Tree
    function setMerkleRoot(bytes32 _merkleRoot) external onlyAdmin {
        merkleRoot = _merkleRoot;
        emit MerkleRootChanged(_merkleRoot);
    }

    function claim(uint256 tokenId, bytes32[] calldata _merkleProof) external {
        if (hasClaimed[tokenId]) revert AlreadyRedeemed();
        if (rewardedNft.ownerOf(tokenId) != msg.sender) revert NotOwner();
        if (totalSupply + 1 >= maxSupply) revert NoTokensLeft();
        if (block.timestamp > airdropFinishTime) revert AirdropExpired();

        checkProof(_merkleProof, merkleRoot);

        hasClaimed[tokenId] = true;
        emit Claimed(tokenId, msg.sender);

        _mint(msg.sender, totalSupply++, 1, data);
    }

    function uri(uint256 id) public view override returns (string memory) {
        return string(abi.encodePacked(baseURI, id));
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
