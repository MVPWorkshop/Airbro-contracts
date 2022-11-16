// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title An ERC1155 contract for minting tokens.
 * @notice This contract is intended to reference it's metadata on IPFS.
 */
contract Airbro1155Contract is ERC1155, Ownable {
    uint256 private constant _tokenID = 0;

    string public name = "Airbro";

    constructor(string memory uri_) ERC1155(uri_) {}

    /// @notice minting a 1155 NFT always of the same Id
    function mint() public {
        _mint(msg.sender, _tokenID, 1, "0x");
    }
}
