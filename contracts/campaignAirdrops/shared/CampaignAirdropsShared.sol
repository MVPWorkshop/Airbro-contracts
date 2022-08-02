// SPDX-License-Identifier: UNLICENSED

import "../../shared/AirdropMerkleProof.sol";
import "../../interfaces/IAirBroFactory.sol";

pragma solidity ^0.8.15;

abstract contract CampaignAidropsShared is AirdropMerkleProof {
    address public immutable airbroCampaignFactoryAddress;

    bool public airdropFunded;
    bool public merkleRootSet;

    /// @notice The root hash of the Merle Tree previously generated offchain when the airdrop concludes.
    bytes32 public merkleRoot;

    mapping(address => bool) public hasClaimed;

    modifier onlyAdmin() {
        if (msg.sender != IAirBroFactory(airbroCampaignFactoryAddress).admin()) revert Unauthorized();
        _;
    }

    constructor(address _campaignFactoryAddress) {
        airbroCampaignFactoryAddress = _campaignFactoryAddress;
    }

    event MerkleRootSet(bytes32 merkleRoot);
    event Claimed(address indexed claimer);
    event AirdropFunded(address contractAddress);

    error Unauthorized();
    error AlreadyRedeemed();
    error NotEligible();
    error MerkleRootAlreadySet();

    /// @notice Sets merkle root and state for contract variables.
    /// Sets only the shared variables, NewERC1155DropCampaign will have additional
    /// parameters set within its setMerkleRoot function.
    /// @dev Used in setMerkleRoot method for both campaign airdrops.
    /// @param _merkleRoot The root hash of the Merle Tree
    function setMerkleRootHandler(bytes32 _merkleRoot) internal {
        if (merkleRootSet) revert MerkleRootAlreadySet();

        merkleRootSet = true;
        merkleRoot = _merkleRoot;
    }

    /// @notice Performs checks and changes state associated with claiming rewards
    /// @dev This method does not deal with the transfer/ minting of tokens
    /// - the logic for this is handled in the child contract.
    /// @param _merkleProof is the merkle proof that this user is eligible for claiming the ERC20 airdrop
    function claimHandler(bytes32[] calldata _merkleProof) internal {
        if (hasClaimed[msg.sender]) revert AlreadyRedeemed();
        if (checkProof(_merkleProof, merkleRoot) == false) revert NotEligible();

        hasClaimed[msg.sender] = true;

        emit Claimed(msg.sender);
    }

    /// @notice Checks if the user is eligible for this airdrop
    /// @dev This is a parent method used in campaign airdrop contracts
    /// @param _merkleProof is the merkleRoot proof that this user is eligible for claiming reward
    /// @return true if user is eligibleto claim a reward
    function isEligibleForReward(bytes32[] calldata _merkleProof) public view virtual returns (bool) {
        if (hasClaimed[msg.sender]) return false;
        return checkProof(_merkleProof, merkleRoot);
    }
}
