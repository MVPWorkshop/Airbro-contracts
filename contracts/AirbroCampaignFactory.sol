// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./campaignAirdrops/NewERC1155DropCampaign.sol";
import "./campaignAirdrops/NewSB1155DropCampaign.sol";
import "./campaignAirdrops/ExistingERC20DropCampaign.sol";
import "./interfaces/IAirdropRegistry.sol";
import "./shared/AirdropAdminRequest.sol";
import "./shared/AirdropBeta.sol";
import "./interfaces/IAirBroCampaignFactory.sol";

/// @title AirbroCampaignFactory - NFT/Token airdrop tool factory contract - for owners of 1155 Nfts
contract AirbroCampaignFactory is AirdropBeta, IAirBroCampaignFactory {
    IAirdropRegistry public immutable airdropRegistryAddress;
    address public immutable treasury;
    // protocol fee for claiming dropCampaign rewards
    uint256 public claimFee = 2_000_000_000_000_000; // 0.002 ETH
    // protocol fee for creating dropCampaigns
    uint256 public creatorFee; // 0.000 ETH
    uint16 public claimPeriodInDays = 60;

    address public immutable erc20DropCampaign;
    address public immutable erc1155DropCampaign;
    address public immutable sb1155DropCampaign;

    event ClaimFeeChanged(uint256 indexed claimFee);
    event CreatorFeeChanged(uint256 indexed creatorFee);
    event ClaimPeriodChanged(uint16 indexed claimPeriod);
    event TrustedRelayerChanged(address indexed trustedRelayer);

    error InvalidFeeAmount();
    error FeeNotSent();

    modifier validFeeAmount() {
        if (msg.value != creatorFee) revert InvalidFeeAmount();
        _;
    }

    constructor(
        address _admin,
        address _airdropRegistryAddress,
        address _betaAddress
    ) AirdropBeta(_betaAddress, _admin) {
        erc20DropCampaign = address(new ExistingERC20DropCampaign());
        erc1155DropCampaign = address(new NewERC1155DropCampaign());
        sb1155DropCampaign = address(new NewSB1155DropCampaign());

        airdropRegistryAddress = IAirdropRegistry(_airdropRegistryAddress);
        treasury = payable(airdropRegistryAddress.treasury());
    }

    // solhint-disable-next-line no-empty-blocks
    receive() external payable {}

    fallback() external payable {}

    /// @notice Creates a new airdrop claim contract for specific NFT collection holders
    /// that will reward with existing ERC20 tokens
    /// @param rewardToken - ERC20 token's address that will be distributed as a reward
    /// @param tokenSupply - total amount of ERC20 tokens to be supplied for the rewards
    function createExistingERC20DropCampaign(address rewardToken, uint256 tokenSupply)
        external
        payable
        duringBeta
        validFeeAmount
    {
        // solhint-disable-next-line avoid-low-level-calls
        (bool success, ) = treasury.call{ value: msg.value }("");

        if (!success) {
            revert FeeNotSent();
        }

        ExistingERC20DropCampaign airdropContract = ExistingERC20DropCampaign(Clones.clone(erc20DropCampaign));
        airdropContract.initialize(
            rewardToken,
            tokenSupply,
            address(this) // airBroFactory contract address ->
            // -> used for getting back admin contract address in airdrop contracts)
        );
        // solhint-disable-next-line avoid-low-level-calls
        airdropRegistryAddress.addAirdrop(address(airdropContract), msg.sender, "ERC20");
    }

    /// @notice Creates a new airdrop claim contract for specific NFT collection holders that will
    /// reward participants with newly created ERC1155 NFTs
    /// @param uri - ipfs link of the image uploaded by user
    function createNewERC1155DropCampaign(
        string memory name,
        string memory symbol,
        string memory uri
    ) external payable duringBeta validFeeAmount {
        // solhint-disable-next-line avoid-low-level-calls
        (bool success, ) = treasury.call{ value: msg.value }("");

        if (!success) {
            revert FeeNotSent();
        }

        NewERC1155DropCampaign airdropContract = NewERC1155DropCampaign(Clones.clone(erc1155DropCampaign));
        airdropContract.initialize(
            name,
            symbol,
            uri,
            address(this) // airBroFactory contract address
        );
        airdropRegistryAddress.addAirdrop(address(airdropContract), msg.sender, "ERC1155");
    }

    /// @notice Creates a new airdrop claim contract for specific NFT collection holders that will
    /// reward participants with newly created Soulbound ERC1155 NFTs
    /// @param uri - ipfs link of the image uploaded by user
    function createNewSB1155DropCampaign(
        string memory name,
        string memory symbol,
        string memory uri
    ) external payable duringBeta validFeeAmount {
        // solhint-disable-next-line avoid-low-level-calls
        (bool success, ) = treasury.call{ value: msg.value }("");

        if (!success) {
            revert FeeNotSent();
        }

        NewSB1155DropCampaign airdropContract = NewSB1155DropCampaign(Clones.clone(sb1155DropCampaign));
        airdropContract.initialize(
            name,
            symbol,
            uri,
            address(this) // airBroFactory contract address
        );
        airdropRegistryAddress.addAirdrop(address(airdropContract), msg.sender, "SB1155");
    }

    /// @notice Updates the protocol fee for claiming dropCampaign rewards
    /// @param _newClaimFee - New claim fee that users will have to pay in order to claim their rewards
    function changeClaimFee(uint256 _newClaimFee) external onlyAdmin {
        claimFee = _newClaimFee;
        emit ClaimFeeChanged(_newClaimFee);
    }

    /// @notice Updates the protocol fee for creating dropCampaigns
    /// @param _newCreatorFee - New creator fee that users will have to pay in order to create new dropCampaigns
    function changeCreatorFee(uint256 _newCreatorFee) external onlyAdmin {
        creatorFee = _newCreatorFee;
        emit CreatorFeeChanged(_newCreatorFee);
    }

    /// @notice Updates the claim period
    /// @param _newClaimPeriod - New claim period in days
    function changeClaimPeriod(uint16 _newClaimPeriod) external onlyAdmin {
        claimPeriodInDays = _newClaimPeriod;
        emit ClaimPeriodChanged(_newClaimPeriod);
    }
}
