// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";

import "./shared/CampaignAirdropsShared.sol";

/// @title Airdrops new ERC1155 tokens for airdrop recipients
contract NewERC1155DropCampaign is ERC1155Upgradeable, CampaignAidropsShared {
    uint256 private constant _tokenId = 0;
    uint256 private constant _tokenAmount = 1;
    uint256 public constant tokensPerClaim = 1; // 1 reward per wallet
    string public constant airdropType = "ERC1155";

    uint256 public airdropFundBlockTimestamp;

    address internal airdropFundingHolder;

    constructor() {
        _disableInitializers();
    }

    function initialize(string memory _uri, address _airbroCampaignFactoryAddress) public initializer {
        __ERC1155_init(_uri);
        airbroCampaignFactoryAddress = IAirBroFactory(_airbroCampaignFactoryAddress);
    }

    function contractURI() public pure returns (string memory) {
        return "https://jsonkeeper.com/b/I5UO";
    }

    /// @notice Sets the merkleRoot - can only be done if admin (different from the contract owner)
    /// @dev Implements a handler method from the parent contract for performing checks and changing state
    /// @param _merkleRoot - The root hash of the Merle Tree
    function setMerkleRoot(bytes32 _merkleRoot) external onlyAdmin {
        super.setMerkleRootHandler(_merkleRoot);
    }

    /// @notice Allows the NFT holder to claim their ERC1155 airdrop
    /// @dev Implements a handler method from the parent contract for performing checks and changing state
    /// @param _merkleProof is the merkleRoot proof that this user is eligible for claiming reward
    function claim(bytes32[] calldata _merkleProof) external payable {
        super.claimHandler(_merkleProof);
        _mint(msg.sender, _tokenId, _tokenAmount, "0x0");
    }

    /// @notice Returns the amount of airdrop tokens a user can claim
    /// @dev Implements a method from the parent contract to check for reward eligibility
    /// @param _merkleProof The proof a user can claim a reward
    function getAirdropAmount(bytes32[] calldata _merkleProof) external view returns (uint256) {
        return super.isEligibleForReward(_merkleProof) ? tokensPerClaim : 0;
    }
}
