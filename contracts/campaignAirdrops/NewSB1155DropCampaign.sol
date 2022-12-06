// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";

import "./shared/CampaignAirdropsShared.sol";

/// @title Airdrops new SoulBound ERC1155 token for airdrop recipients
contract NewSB1155DropCampaign is ERC1155Upgradeable, CampaignAidropsShared {
    uint256 private constant _tokenId = 0;
    uint256 private constant _tokenAmount = 1; // 1 token per claim
    string public constant airdropType = "SB1155";

    string public name;
    string public symbol;
    string public contractURI;
    bool public contractURIset;

    event Attest(address indexed to);
    event Revoke(address indexed from);
    event ContractURISet(string indexed contractURI);

    error SoulboundTokenUntransferable();

    function initialize(
        string memory _name,
        string memory _symbol,
        string memory uri_,
        address _airbroCampaignFactoryAddress
    ) external initializer {
        __ERC1155_init(uri_);
        airbroCampaignFactory = IAirBroCampaignFactory(_airbroCampaignFactoryAddress);
        name = _name;
        symbol = _symbol;
    }

    /// @notice Sets the contractURI - can only be done by admin
    /// @param _contractURI - link to contract metadata
    function setContractURI(string memory _contractURI) external onlyAdmin {
        contractURI = _contractURI;
        contractURIset = true;
        emit ContractURISet(_contractURI);
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
    /// @param _claimerAddress is the address of the one signing the transaction and trying to claim the reward,
    /// added due to use of relayers
    function claim(bytes32[] calldata _merkleProof, address _claimerAddress) public payable virtual {
        super.claimHandler(_merkleProof, _claimerAddress);
        _mint(_claimerAddress, _tokenId, _tokenAmount, "0x0");
    }

    /// @notice Returns the amount of airdrop tokens a user can claim
    /// @param _merkleProof The proof a user can claim a reward
    function getAirdropAmount(bytes32[] calldata _merkleProof) external view returns (uint256) {
        return super.isEligibleForReward(_merkleProof) ? _tokenAmount : 0;
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
        if (from != address(0) && to != address(0)) revert SoulboundTokenUntransferable();
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
        _burn(msg.sender, _tokenId, _tokenAmount);
    }
}
