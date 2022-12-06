// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./affiliateCampaigns/ERC20AffiliateCampaign.sol";
import "./interfaces/IAirdropRegistry.sol";
import "./shared/AirdropAdminRequest.sol";
import "./shared/AirdropBeta.sol";
import "./interfaces/IAirBroCampaignFactory.sol";

/// @title AirbroLensCampaignFactory - NFT/Token airdrop tool factory contract - for owners of 1155 Nfts
contract AirbroAffiliateCampaignFactory is AirdropBeta, IAirBroCampaignFactory {
    IAirdropRegistry public immutable airdropRegistryAddress;
    address public immutable treasury;
    // protocol fee for claiming dropCampaign rewards
    uint256 public claimFee; // 0.000 ETH
    // protocol fee for creating dropCampaigns
    uint256 public creatorFee; // 0.000 ETH
    uint16 public claimPeriodInDays = 60;

    address public immutable erc20AffiliateCampaign;

    event ClaimFeeChanged(uint256 indexed claimFee);
    event CreatorFeeChanged(uint256 indexed creatorFee);
    event ClaimPeriodChanged(uint16 indexed claimPeriod);

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
        erc20AffiliateCampaign = address(new ERC20AffiliateCampaign());

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
    function createERC20AffiliateCampaign(
        address rewardToken,
        uint256 tokenSupply,
        uint256 costPerParticipant,
        uint256 rewardRatio,
        uint256 campaignDeadline
    ) external payable duringBeta validFeeAmount {
        // solhint-disable-next-line avoid-low-level-calls
        (bool success, ) = treasury.call{ value: msg.value }("");

        if (!success) {
            revert FeeNotSent();
        }

        ERC20AffiliateCampaign campaignContract = ERC20AffiliateCampaign(Clones.clone(erc20AffiliateCampaign));
        campaignContract.initialize(
            rewardToken,
            tokenSupply,
            costPerParticipant,
            rewardRatio,
            campaignDeadline,
            address(this) // airBroFactory contract address ->
            // -> used for getting back admin contract address in airdrop contracts)
        );
        // solhint-disable-next-line avoid-low-level-calls
        airdropRegistryAddress.addAirdrop(address(campaignContract), msg.sender, "ERC20");
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
