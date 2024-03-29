// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

abstract contract AirdropMerkleProof {
    function checkProof(
        bytes32[] calldata _merkleProof,
        bytes32 _merkleRoot,
        address _sender
    ) public pure returns (bool) {
        //check if merkle root hash exists
        if (_merkleRoot != 0) {
            // Verify the provided _merkleProof, given to us through the API call on our website.
            bytes32 leaf = keccak256(abi.encodePacked(_sender));
            return MerkleProof.verify(_merkleProof, _merkleRoot, leaf);
        }
        return false;
    }
}
