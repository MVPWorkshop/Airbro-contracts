// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../interfaces/AirdropMerkleProof.sol";
import "../interfaces/IAirBroFactory.sol";

/// @title Airdrops existing ERC1155 tokens for airdrop recipients
contract NewERC1155DropCampaign is ERC1155, AirdropMerkleProof {
    address public immutable airbroCampaignFactoryAddress;
    uint8 private immutable _tokenId = 0; // yes, for immutable/constant I had to set the variable to = 0;
    uint8 private immutable _tokenAmount = 1;

    string public airdropType = "ERC1155";
    uint256 public airdropFundBlockTimestamp;
    bool public airdropFunded;

    address internal airdropFundingHolder;

    mapping(address => bool) public hasClaimed;

    /// @notice The root hash of the Merle Tree previously generated offchain when the airdrop concludes.
    bytes32 public merkleRoot;

    event Claimed(address indexed claimer);
    event AirdropFunded(address contractAddress);
    event MerkleRootChanged(bytes32 merkleRoot);

    error Unauthorized();
    error AlreadyRedeemed();
    error NotEligible();

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
        merkleRoot = _merkleRoot;
        emit MerkleRootChanged(_merkleRoot);
    }

    /// @notice Allows the NFT holder to claim their ERC1155 airdrop
    /// @param _merkleProof is the merkleRoot proof that this user is eligible for claiming reward
    function claim(bytes32[] calldata _merkleProof) external {
        if (isEligibleForReward(_merkleProof)) {
            hasClaimed[msg.sender] = true;
            _mint(msg.sender, _tokenId, _tokenAmount, "0x0");
            emit Claimed(msg.sender);
        } else {
            revert NotEligible();
        }
    }

    /// @notice Checks if the user is eligible for this airdrop
    /// @param _merkleProof is the merkleRoot proof that this user is eligible for claiming reward
    function isEligibleForReward(bytes32[] calldata _merkleProof) public view returns (bool) {
        if (hasClaimed[msg.sender]) revert AlreadyRedeemed();
        bool isEligible = checkProof(_merkleProof, merkleRoot);
        return isEligible;
    }
}
