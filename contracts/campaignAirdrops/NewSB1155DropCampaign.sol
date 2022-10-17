// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";

import "./shared/CampaignAirdropsShared.sol";

/// @title Airdrops new SoulBound ERC1155 token for airdrop recipients
contract NewSB1155DropCampaign is ERC1155Upgradeable, CampaignAidropsShared {
    uint256 private constant _tokenId = 0;
    uint256 private constant _tokenAmount = 1;
    uint256 public constant tokensPerClaim = 1; // 1 reward per wallet
    string public constant airdropType = "SB1155";

    uint256 public airdropFundBlockTimestamp;

    address internal airdropFundingHolder;

    error SoulboundTokenUntransferable();
    error NotTokenOwner();

    event Attest(address indexed to);
    event Revoke(address indexed from);

    function initialize(
        string memory _uri,
        address _airbroCampaignFactoryAddress,
        address _trustedForwarderAddress
    ) public initializer {
        __ERC1155_init(_uri);
        ERC2771ContextUpgradeable(_trustedForwarderAddress);
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
    function claim(bytes32[] calldata _merkleProof) public payable virtual {
        super.claimHandler(_merkleProof);

        _mint(_msgSender(), _tokenId, _tokenAmount, "0x0");
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
        if (from != address(0) && to != address(0)) revert SoulboundTokenUntransferable();
    }

    function _msgSender() internal view virtual override(ContextUpgradeable, ERC2771ContextUpgradeable) returns (address sender) {
        return ERC2771ContextUpgradeable._msgSender();
    }

    function _msgData() internal view virtual override(ContextUpgradeable, ERC2771ContextUpgradeable) returns (bytes calldata) {
        return ERC2771ContextUpgradeable._msgData();
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
