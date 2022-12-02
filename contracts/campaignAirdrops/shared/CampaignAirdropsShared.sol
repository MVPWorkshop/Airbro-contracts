// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "../../shared/AirdropMerkleProof.sol";
import "../../interfaces/IAirBroCampaignFactory.sol";

abstract contract CampaignAidropsShared is AirdropMerkleProof {
    IAirBroCampaignFactory public airbroCampaignFactory;

    bool public merkleRootSet;

    /// @notice The root hash of the Merle Tree previously generated offchain when the airdrop concludes.
    bytes32 public merkleRoot;

    mapping(address => bool) public hasClaimed;

    modifier onlyAdmin() {
        if (msg.sender != airbroCampaignFactory.admin()) revert Unauthorized();
        _;
    }

    event MerkleRootSet(bytes32 merkleRoot);
    event Claimed(address indexed claimer);

    error Unauthorized();
    error AlreadyRedeemed();
    error NotEligible();
    error MerkleRootAlreadySet();
    error InvalidFeeAmount();
    error FeeNotSent();

    /// @notice Sets merkle root and state for contract variables.
    /// Sets only the shared variables, NewERC1155DropCampaign will have additional
    /// parameters set within its setMerkleRoot function.
    /// @dev Used in setMerkleRoot method for both campaign airdrops.
    /// @param _merkleRoot The root hash of the Merle Tree
    function setMerkleRootHandler(bytes32 _merkleRoot) internal {
        if (merkleRootSet) revert MerkleRootAlreadySet();

        merkleRootSet = true;
        merkleRoot = _merkleRoot;

        emit MerkleRootSet(_merkleRoot);
    }

    /// @notice Performs checks and changes state associated with claiming rewards
    /// @dev This method does not deal with the transfer/ minting of tokens
    /// - the logic for this is handled in the child contract.
    /// @param _merkleProof is the merkle proof that this user is eligible for claiming the ERC20 airdrop
    /// @param _sender is the address attempting to claim the reward, added due to use of relayers
    function claimHandler(bytes32[] calldata _merkleProof, address _sender) internal {
        if (hasClaimed[_sender]) revert AlreadyRedeemed();
        if (checkProof(_merkleProof, merkleRoot, _sender) == false) revert NotEligible();
        if (msg.value != airbroCampaignFactory.claimFee()) revert InvalidFeeAmount();

        hasClaimed[_sender] = true;

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, ) = airbroCampaignFactory.treasury().call{ value: msg.value }("");

        if (!success) revert FeeNotSent();
        emit Claimed(_sender);
    }

    /// @notice Checks if the user is eligible for this airdrop
    /// @dev This is a parent method used in campaign airdrop contracts
    /// @param _merkleProof is the merkleRoot proof that this user is eligible for claiming reward
    /// @return true if user is eligibleto claim a reward
    function isEligibleForReward(bytes32[] calldata _merkleProof) public view virtual returns (bool) {
        if (hasClaimed[msg.sender]) return false;
        return checkProof(_merkleProof, merkleRoot, msg.sender);
    }
}
