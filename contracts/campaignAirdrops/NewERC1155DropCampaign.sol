// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

import "./shared/CampaignAirdropsShared.sol";

/// @title Airdrops new ERC1155 tokens for airdrop recipients
contract NewERC1155DropCampaign is ERC1155, CampaignAidropsShared {
    uint256 private constant _tokenId = 0;
    uint256 private constant _tokenAmount = 1;
    uint256 public constant tokensPerClaim = 1; // 1 reward per wallet
    string public constant airdropType = "ERC1155";

    uint256 public airdropFundBlockTimestamp;

    address internal airdropFundingHolder;

    constructor(string memory uri, address _airbroCampaignFactoryAddress)
        ERC1155(uri)
        CampaignAidropsShared(_airbroCampaignFactoryAddress)
    {}

    /// @notice Sets the merkleRoot - can only be done if admin (different from the contract owner)
    /// @dev Implements a handler method from the parent contract for performing checks and changing state
    /// @param _merkleRoot - The root hash of the Merle Tree
    function setMerkleRoot(bytes32 _merkleRoot) external onlyAdmin {
        super.setMerkleRootHandler(_merkleRoot);
        emit MerkleRootSet(_merkleRoot);
    }

    /// @notice Allows the NFT holder to claim their ERC1155 airdrop
    /// @dev Implements a handler method from the parent contract for performing checks and changing state
    /// @param _merkleProof is the merkleRoot proof that this user is eligible for claiming reward
    function claim(bytes32[] calldata _merkleProof) external {
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
