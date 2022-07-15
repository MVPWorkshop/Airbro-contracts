// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "@rari-capital/solmate/src/tokens/ERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "../interfaces/AirdropInfoSMCampaign.sol";
import "../interfaces/AirdropMerkleProof.sol";
import "../interfaces/IAirBroFactory.sol";

/// @title Airdrops new ERC20 tokens for airdrop recipients
contract ExistingERC20DropCampaign is ERC20, AirdropInfoSMCampaign, AirdropMerkleProof {

}
