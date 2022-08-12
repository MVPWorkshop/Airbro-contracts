// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "./campaignAirdrops/NewERC1155DropCampaign.sol";
import "./campaignAirdrops/NewSB1155DropCampaign.sol";
import "./campaignAirdrops/ExistingERC20DropCampaign.sol";
import "./interfaces/IAirdropRegistry.sol";
import "./shared/AirdropAdmin.sol";

/// @title AirbroCampaignFactory - NFT/Token airdrop tool factory contract - for owners of 1155 Nfts
contract AirbroCampaignFactory is AirdropAdmin {
    IAirdropRegistry public immutable airdropRegistryAddress;
    address public immutable treasury;
    // protocol fee for claiming dropCampaign rewards
    uint256 public claimFee = 2_000_000_000_000_000; // 0.002 ETH
    uint16 public claimPeriodInDays = 60;

    event ClaimFeeChanged(uint256 indexed claimFee);
    event ClaimPeriodChanged(uint16 indexed claimPeriod);

    constructor(address _admin, address _airdropRegistryAddress) {
        admin = _admin;
        airdropRegistryAddress = IAirdropRegistry(_airdropRegistryAddress);
        treasury = payable(airdropRegistryAddress.treasury());
    }

    receive() external payable {}

    fallback() external payable {}

    /// @notice Creates a new airdrop claim contract for specific NFT collection holders that will reward with existing ERC20 tokens
    /// @param rewardToken - ERC20 token's address that will be distributed as a reward
    /// @param tokenSupply - total amount of ERC20 tokens to be supplied for the rewards
    function createExistingERC20DropCampaign(address rewardToken, uint256 tokenSupply) external {
        ExistingERC20DropCampaign airdropContract = new ExistingERC20DropCampaign(
            rewardToken,
            tokenSupply,
            address(this) // airBroFactory contract address -> used for getting back admin contract address in airdrop contracts
        );

        airdropRegistryAddress.addAirdrop(address(airdropContract), msg.sender, "ERC20");
    }

    /// @notice Creates a new airdrop claim contract for specific NFT collection holders that will reward participants with newly created ERC1155 NFTs
    /// @param uri - ipfs link of the image uploaded by user
    function createNewERC1155DropCampaign(string memory uri) external {
        NewERC1155DropCampaign airdropContract = new NewERC1155DropCampaign(
            uri,
            address(this) // airBroFactory contract address -> used for getting back admin contract address in airdrop contracts
        );

        airdropRegistryAddress.addAirdrop(address(airdropContract), msg.sender, "ERC1155");
    }

    /// @notice Creates a new airdrop claim contract for specific NFT collection holders that will reward participants with newly created Soulbound ERC1155 NFTs
    /// @param uri - ipfs link of the image uploaded by user
    function createNewSB1155DropCampaign(string memory uri) external {
        NewSB1155DropCampaign airdropContract = new NewSB1155DropCampaign(
            uri,
            address(this) // airBroFactory contract address -> used for getting back admin contract address in airdrop contracts
        );
        airdropRegistryAddress.addAirdrop(address(airdropContract), msg.sender, "SB1155");
    }

    /// @notice Updates the protocol fee for claiming dropCampaign rewards
    /// @param _newClaimFee - New claim fee that users will have to pay in order to claim their rewards
    function changeFee(uint256 _newClaimFee) external onlyAdmin {
        claimFee = _newClaimFee;
        emit ClaimFeeChanged(_newClaimFee);
    }

    /// @notice Updates the claim period
    /// @param _newClaimPeriod - New claim period in days
    function changeClaimPeriod(uint16 _newClaimPeriod) external onlyAdmin {
        claimPeriodInDays = _newClaimPeriod;
        emit ClaimPeriodChanged(_newClaimPeriod);
    }
}
