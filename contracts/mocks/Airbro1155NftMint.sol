// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title An ERC1155 contract for minting tokens.
 * @notice This contract is intended to reference it's metadata on IPFS.
 */
contract AirBro1155NftMint is ERC1155, Ownable {
    uint256 private _currentTokenID = 0;

    string public name = "Airbro";

    // token reference maps
    mapping(string => uint256) public idMap;
    mapping(uint256 => string) public lookupMap;

    // solhint-disable-next-line no-empty-blocks
    constructor() ERC1155("https://ipfs.moralis.io:2053/ipfs/") {}

    function setURI(string memory newUri) public onlyOwner {
        _setURI(newUri);
    }

    /**
     * @notice Override ERC1155 base uri function to use IPFS CIDs instead of token ids
     * @param id ID of token to get URI for
     * @return Correctly formatted IPFS URI for token
     */
    function uri(uint256 id) public view virtual override returns (string memory) {
        return string(abi.encodePacked(super.uri(id), lookupMap[id]));
    }

    function mint(string memory cid, uint256 amount) public {
        _currentTokenID = _currentTokenID + 1;
        // add to reference maps
        idMap[cid] = _currentTokenID;
        lookupMap[_currentTokenID] = cid;

        _mint(msg.sender, _currentTokenID, amount, bytes(cid));
    }
}
