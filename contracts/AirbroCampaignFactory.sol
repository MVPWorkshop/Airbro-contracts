// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "./campaignAirdrops/NewERC1155DropCampaign.sol";
import "./campaignAirdrops/ExistingERC20DropCampaign.sol";

/// @title AirbroCampaignFactory - NFT/Token airdrop tool factory contract - for owners of 1155 Nfts
contract AirbroCampaignFactory {
    // index of deployed airdrop contracts
    address[] public airdrops;
    address public admin = 0xF4b5bFB92dD4E6D529476bCab28A65bb6B32EFb3;

    uint256 public totalAirdropsCount;

    event NewAirdrop(address indexed rewardedNftCollection, address indexed airdropContract, address indexed airdropCreator);
    event AdminChanged(address indexed adminAddress);

    error NotAdmin();

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor() {}

    /// @notice Creates a new airdrop claim contract for specific NFT collection holders that will reward with existing ERC20 tokens
    /// @param rewardToken - ERC20 token's address that will be distributed as a reward
    /// @param tokenSupply - total amount of ERC20 tokens to be supplied for the rewards
    function createExistingERC20DropCampaign(address rewardToken, uint256 tokenSupply) external {
        ExistingERC20DropCampaign airdropContract = new ExistingERC20DropCampaign(rewardToken, tokenSupply);
        airdrops.push(address(airdropContract));
        unchecked {
            totalAirdropsCount++;
        }
        emit NewAirdrop(address(airdropContract), msg.sender);
    }

    /// @notice Creates a new airdrop claim contract for specific NFT collection holders that will reward participants with newly created ERC1155 NFTs
    /// @param uri - ipfs link of the image uploaded by user
    function createNewERC1155DropCampaign(string uri) external {
        NewERC1155DropCampaign airdropContract = new NewERC1155DropCampaign(uri);
        airdrops.push(address(airdropContract));
        unchecked {
            totalAirdropsCount++;
        }
        emit NewAirdrop(address(airdropContract), msg.sender);
    }

    /// @notice Updates the address of the admin variable
    /// @param _newAdmin - New address for the admin of this contract, and the address for all newly created airdrop contracts
    function changeAdmin(address _newAdmin) external onlyAdmin {
        admin = _newAdmin;
        emit AdminChanged(_newAdmin);
    }
}
