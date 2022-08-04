// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "./campaignAirdrops/NewERC1155DropCampaign.sol";
import "./campaignAirdrops/NewSB1155DropCampaign.sol";
import "./campaignAirdrops/ExistingERC20DropCampaign.sol";

/// @title AirbroCampaignFactory - NFT/Token airdrop tool factory contract - for owners of 1155 Nfts
contract AirbroCampaignFactory {
    // index of deployed airdrop contracts
    address[] public airdrops;
    address public admin;
    // protocol fee for claiming dropCampaign rewards
    uint256 public claimFee = 20000000000000000; // 0.02 ETH

    uint256 public totalAirdropsCount;

    event NewAirdrop(address indexed airdropContract, address indexed airdropCreator, string airdropType);
    event AdminChanged(address indexed adminAddress);
    event ClaimFeeChanged(uint256 indexed claimFee);

    error NotAdmin();

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(address _admin) {
        admin = _admin;
    }

    /// @notice Creates a new airdrop claim contract for specific NFT collection holders that will reward with existing ERC20 tokens
    /// @param rewardToken - ERC20 token's address that will be distributed as a reward
    /// @param tokenSupply - total amount of ERC20 tokens to be supplied for the rewards
    function createExistingERC20DropCampaign(address rewardToken, uint256 tokenSupply) external {
        ExistingERC20DropCampaign airdropContract = new ExistingERC20DropCampaign(
            rewardToken,
            tokenSupply,
            address(this) // airBroFactory contract address -> used for getting back admin contract address in airdrop contracts
        );
        airdrops.push(address(airdropContract));
        unchecked {
            totalAirdropsCount++;
        }
        emit NewAirdrop(address(airdropContract), msg.sender, "ERC20");
    }

    /// @notice Creates a new airdrop claim contract for specific NFT collection holders that will reward participants with newly created ERC1155 NFTs
    /// @param uri - ipfs link of the image uploaded by user
    function createNewERC1155DropCampaign(string memory uri) external {
        NewERC1155DropCampaign airdropContract = new NewERC1155DropCampaign(
            uri,
            address(this) // airBroFactory contract address -> used for getting back admin contract address in airdrop contracts
        );
        airdrops.push(address(airdropContract));
        unchecked {
            totalAirdropsCount++;
        }
        emit NewAirdrop(address(airdropContract), msg.sender, "ERC1155");
    }

    /// @notice Creates a new airdrop claim contract for specific NFT collection holders that will reward participants with newly created Soulbound ERC1155 NFTs
    /// @param uri - ipfs link of the image uploaded by user
    function createNewSB1155DropCampaign(string memory uri) external {
        NewSB1155DropCampaign airdropContract = new NewSB1155DropCampaign(
            uri,
            address(this) // airBroFactory contract address -> used for getting back admin contract address in airdrop contracts
        );
        airdrops.push(address(airdropContract));
        unchecked {
            totalAirdropsCount++;
        }
        emit NewAirdrop(address(airdropContract), msg.sender, "SB1155");
    }

    /// @notice Updates the address of the admin variable
    /// @param _newAdmin - New address for the admin of this contract, and the address for all newly created airdrop contracts
    function changeAdmin(address _newAdmin) external onlyAdmin {
        admin = _newAdmin;
        emit AdminChanged(_newAdmin);
    }

    /// @notice Updates the protocol fee for claiming dropCampaign rewards
    /// @param _newClaimFee - New claim fee that users will have to pay in order to claim their rewards
    function changeFee(uint256 _newClaimFee) external onlyAdmin {
        claimFee = _newClaimFee;
        emit ClaimFeeChanged(_newClaimFee);
    }
}
