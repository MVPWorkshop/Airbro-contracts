// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

abstract contract CampaignAidropsShared {
    address public immutable airbroCampaignFactoryAddress;

    bool public airdropFunded;
    bool public merkleRootSet;

    /// @notice The root hash of the Merle Tree previously generated offchain when the airdrop concludes.
    bytes32 public merkleRoot;

    mapping(address => bool) public hasClaimed;

    constructor(address _campaignFactoryAddress) {
        airbroCampaignFactoryAddress = _campaignFactoryAddress;
    }

    event Claimed(address indexed claimer);
    event AirdropFunded(address contractAddress);

    error Unauthorized();
    error AlreadyRedeemed();
    error NotEligible();
    error MerkleRootAlreadySet();
}
