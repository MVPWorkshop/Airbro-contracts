// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../interfaces/AirdropMerkleProof.sol";
import "../interfaces/IAirBroFactory.sol";

/// @title Airdrops existing ERC1155 tokens for airdrop recipients
contract NewERC1155DropCampaign is ERC1155, AirdropMerkleProof {
    address public immutable airbroCampaignFactoryAddress;

    uint256 private constant _tokenId = 0;
    uint256 private constant _tokenAmount = 1;
    string public constant airdropType = "ERC1155";

    uint256 public airdropFundBlockTimestamp;
    bool public airdropFunded;
    bool public merkleRootSet;

    address internal airdropFundingHolder;

    mapping(address => bool) public hasClaimed;

    /// @notice The root hash of the Merle Tree previously generated offchain when the airdrop concludes.
    bytes32 public merkleRoot;

    event Claimed(address indexed claimer);
    event AirdropFunded(address contractAddress);
    event MerkleRootSet(bytes32 merkleRoot);

    error Unauthorized();
    error AlreadyRedeemed();
    error NotEligible();
    error MerkleRootAlreadySet();

    modifier onlyAdmin() {
        if (msg.sender != IAirBroFactory(airbroCampaignFactoryAddress).admin()) revert Unauthorized();
        _;
    }

    constructor(string memory uri, address _airbroCampaignFactoryAddress) ERC1155(uri) {
        airbroCampaignFactoryAddress = _airbroCampaignFactoryAddress;
    }

    /// @notice Sets the merkleRoot - can only be done if admin (different from the contract owner)
    /// @param _merkleRoot - The root hash of the Merle Tree
    function setMerkleRoot(bytes32 _merkleRoot) external onlyAdmin {
        if (merkleRootSet) revert MerkleRootAlreadySet();

        merkleRootSet = true;
        merkleRoot = _merkleRoot;
        emit MerkleRootSet(_merkleRoot);
    }

    /// @notice Allows the NFT holder to claim their ERC1155 airdrop
    /// @param _merkleProof is the merkleRoot proof that this user is eligible for claiming reward
    function claim(bytes32[] calldata _merkleProof) external {
        validateClaim(_merkleProof);

        hasClaimed[msg.sender] = true;

        _mint(msg.sender, _tokenId, _tokenAmount, "0x0");
        emit Claimed(msg.sender);
    }

    /// @notice Checks if the user is eligible for this airdrop
    /// @param _merkleProof is the merkleRoot proof that this user is eligible for claiming reward
    /// @return bool true or false
    function isEligibleForReward(bytes32[] calldata _merkleProof) public view returns (bool) {
        if (hasClaimed[msg.sender]) {
            return false;
        } else {
            return checkProof(_merkleProof, merkleRoot);
        }
    }

    /// @notice Validation for claiming a reward
    /// @param _merkleProof The proof a user can claim a reward
    function validateClaim(bytes32[] calldata _merkleProof) internal view {
        if (hasClaimed[msg.sender]) revert AlreadyRedeemed();
        if (checkProof(_merkleProof, merkleRoot) == false) revert NotEligible();
    }
}
