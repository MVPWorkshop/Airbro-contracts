// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

error InvalidProof();

abstract contract AirdropMerkleProof {

    function checkProof(bytes32[] calldata _merkleProof, bytes32 merkleRoot) public {
        //check if merkle root hash exists
        if (merkleRoot != 0) {
            // Verify the provided _merkleProof, given to us through the API call on our website.
            bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
            if (!MerkleProof.verify(_merkleProof, merkleRoot, leaf)) revert InvalidProof();
        }
    }

}

