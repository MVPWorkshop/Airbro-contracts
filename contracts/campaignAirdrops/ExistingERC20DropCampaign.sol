// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./shared/CampaignAirdropsShared.sol";

/// @title Airdrops existing ERC20 tokens for airdrop recipients
contract ExistingERC20DropCampaign is CampaignAidropsShared {
    using SafeERC20 for IERC20;

    IERC20 public rewardToken;
    uint256 public tokenSupply;
    bool public initialized;

    string public constant airdropType = "ERC20";
    uint256 internal numberOfClaimers;
    uint256 public tokensPerClaim;
    uint256 public airdropExpirationTimestamp;
    uint16 public claimPeriodInDays;

    address internal airdropFunder;

    event WithdrawUnlocked();
    event FundsWithdrawn();

    error AlreadyFunded();
    error AirdropStillActive();
    error AirdropExpired();
    error MerkleRootHashSet();

    function initialize(
        address _rewardToken,
        uint256 _tokenSupply,
        address _airbroCampaignFactoryAddress
    ) external {
        require(!initialized);
        initialized = true;
        rewardToken = IERC20(_rewardToken);
        tokenSupply = _tokenSupply;
        airbroCampaignFactoryAddress = IAirBroFactory(_airbroCampaignFactoryAddress);
        claimPeriodInDays = airbroCampaignFactoryAddress.claimPeriodInDays();
    }

    /// @notice Sets the merkleRoot and the number of claimers (also setting the amount each claimer receivers).
    /// Can only be done by admin.
    /// @dev Implements a handler method from the parent contract for performing checks and changing state
    /// @param _merkleRoot The root hash of the Merle Tree
    /// @param _numberOfClaimers The number of users eligible to claim
    function setMerkleRoot(bytes32 _merkleRoot, uint256 _numberOfClaimers) external onlyAdmin {
        super.setMerkleRootHandler(_merkleRoot);

        airdropExpirationTimestamp = block.timestamp + (claimPeriodInDays * 1 days);
        numberOfClaimers = _numberOfClaimers;
        tokensPerClaim = tokenSupply / _numberOfClaimers;
    }

    /// @notice Allows a wallet to provide funds for the airdrop reward
    function fundAirdrop() external {
        if (airdropFunded) revert AlreadyFunded();

        airdropFunded = true;
        airdropFunder = msg.sender;

        rewardToken.safeTransferFrom(msg.sender, address(this), tokenSupply);
        emit AirdropFunded(address(this));
    }

    /// @notice Allows admin to enable the funder address to withdraw funds early if no addresses are eligible to claim
    function unlockWithdraw() external onlyAdmin {
        if (merkleRootSet) revert MerkleRootHashSet();

        airdropExpirationTimestamp = block.timestamp;
        emit WithdrawUnlocked();
    }

    /// @notice Allows airdrop funder to withdraw back the funds after the airdrop has finished
    function withdrawAirdropFunds() external {
        if (airdropFunder != msg.sender) revert Unauthorized();
        if (block.timestamp <= airdropExpirationTimestamp) revert AirdropStillActive();

        rewardToken.safeTransfer(msg.sender, rewardToken.balanceOf(address(this)));
        emit FundsWithdrawn();
    }

    /// @notice Allows eligible users to claim their ERC20 airdrop
    /// @dev Implements a handler method from the parent contract for performing checks and changing state
    /// @param _merkleProof is the merkle proof that this user is eligible for claiming the ERC20 airdrop
    function claim(bytes32[] calldata _merkleProof) external payable virtual {
        if (block.timestamp > airdropExpirationTimestamp) revert AirdropExpired();
        super.claimHandler(_merkleProof);
        rewardToken.safeTransfer(msg.sender, tokensPerClaim);
    }

    /// @notice Checks if the user is eligible for this airdrop
    /// @dev Implements a handler method from the parent contract for performing checks,
    /// but implements an additional expirationd date check beforehand
    /// @param _merkleProof The proof a user can claim a reward
    /// @return bool if user is eligible for reward
    function isEligibleForReward(bytes32[] calldata _merkleProof) public view virtual override returns (bool) {
        if (block.timestamp > airdropExpirationTimestamp) return false;
        return super.isEligibleForReward(_merkleProof);
    }

    /// @notice Returns the amount of airdrop tokens a user can claim
    /// @dev Implements a method from the parent contract to check for reward eligibility.
    /// Uses the 'isEligibleForReward' method from this contract which contains
    /// an additional necessary check
    /// @param _merkleProof The proof a user can claim a reward
    function getAirdropAmount(bytes32[] calldata _merkleProof) external view returns (uint256) {
        return isEligibleForReward(_merkleProof) ? tokensPerClaim : 0;
    }
}
