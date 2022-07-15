// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "../interfaces/AirdropMerkleProof.sol";
import "../interfaces/AirdropInfoSMCampaign.sol";
import "../interfaces/IAirBroFactory.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

/// @title Airdrops existing ERC1155 tokens for airdrop recipients
contract NewERC1155DropCampaign is ERC1155, AirdropInfoSMCampaign, AirdropMerkleProof {

}
