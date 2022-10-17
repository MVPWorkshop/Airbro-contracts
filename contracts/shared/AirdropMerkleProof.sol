// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";

abstract contract AirdropMerkleProof is ERC2771ContextUpgradeable {
    function checkProof(bytes32[] calldata _merkleProof, bytes32 merkleRoot) public view returns (bool) {
        //check if merkle root hash exists
        if (merkleRoot != 0) {
            // Verify the provided _merkleProof, given to us through the API call on our website.
            bytes32 leaf = keccak256(abi.encodePacked(_msgSender()));
            return MerkleProof.verify(_merkleProof, merkleRoot, leaf);
        }
        return false;
    }
}
