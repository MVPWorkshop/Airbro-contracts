// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

// import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "../Airbro1155Contract.sol";
import "../interfaces/AirdropMerkleProof.sol";
import "../interfaces/AirdropInfoSMCampaign.sol";
import "../interfaces/IAirBroFactory.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

/// @title Airdrops existing ERC1155 tokens for airdrop recipients
contract NewERC1155DropCampaign is Airbro1155Contract, AirdropInfoSMCampaign, AirdropMerkleProof {
    address public immutable airbroCampaignFactoryAddress;

    constructor(string memory uri, address _airbroCampaignFactoryAddress) Airbro1155Contract(uri) {
        airbroCampaignFactoryAddress = _airbroCampaignFactoryAddress;
    }
}
