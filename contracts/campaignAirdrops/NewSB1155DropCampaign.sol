// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

import "./shared/CampaignAirdropsShared.sol";

/// @title Airdrops existing ERC1155 tokens for airdrop recipients
contract NewSB1155DropCampaign is ERC1155, CampaignAidropsShared {
    uint256 private constant _tokenId = 0;
    uint256 private constant _tokenAmount = 1;
    uint256 public constant tokensPerClaim = 1; // 1 reward per wallet
    string public constant airdropType = "ERC1155";

    uint256 public airdropFundBlockTimestamp;

    address internal airdropFundingHolder;

    error SoulboundTokenUntransferable();
    error NotTokenOwner();

    event MerkleRootSet(bytes32 merkleRoot);

    event Attest(address indexed to);
    event Revoke(address indexed from);

    constructor(string memory uri, address _airbroCampaignFactoryAddress)
        ERC1155(uri)
        CampaignAidropsShared(_airbroCampaignFactoryAddress)
    {}

    /// @notice Sets the merkleRoot - can only be done if admin (different from the contract owner)
    /// @param _merkleRoot - The root hash of the Merle Tree
    function setMerkleRoot(bytes32 _merkleRoot) external onlyAdmin {
        super.setMerkleRootHandler(_merkleRoot);

        emit MerkleRootSet(_merkleRoot);
    }

    /// @notice Allows the NFT holder to claim their ERC1155 airdrop
    /// @param _merkleProof is the merkleRoot proof that this user is eligible for claiming reward
    function claim(bytes32[] calldata _merkleProof) public virtual {
        super.claimHandler(_merkleProof);

        _mint(msg.sender, _tokenId, _tokenAmount, "0x0");
    }

    /// @notice Checks if the user is eligible for this airdrop
    /// @param _merkleProof is the merkleRoot proof that this user is eligible for claiming reward
    /// @return true if user is eligibleto claim a reward
    function isEligibleForReward(bytes32[] calldata _merkleProof) public view virtual override returns (bool) {
        return super.isEligibleForReward(_merkleProof);
    }

    /// @notice Returns the amount of airdrop tokens a user can claim
    /// @param _merkleProof The proof a user can claim a reward
    function getAirdropAmount(bytes32[] calldata _merkleProof) external view returns (uint256) {
        return isEligibleForReward(_merkleProof) ? tokensPerClaim : 0;
    }

    /// @dev Overriding _beforeTokenTransfer in order to make soulbound tokens untransferable
    function _beforeTokenTransfer(
        address,
        address from,
        address to,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) internal virtual override {
        if (from != address(0) || to != address(0)) revert SoulboundTokenUntransferable();
    }

    /// @dev Overriding _afterTokenTransfer in order to emit propper events for minting and burning soulbound tokens
    function _afterTokenTransfer(
        address,
        address from,
        address to,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) internal virtual override {
        if (from == address(0)) {
            emit Attest(to);
        } else if (to == address(0)) {
            emit Revoke(from);
        }
    }

    function burn() external {
        if (balanceOf(msg.sender, _tokenId) != 1) revert NotTokenOwner();
        _burn(msg.sender, _tokenId, _tokenAmount);
    }
}
