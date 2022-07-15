// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../interfaces/AirdropInfoSMCampaign.sol";
import "../interfaces/AirdropMerkleProof.sol";
import "../interfaces/IAirBroFactory.sol";

/// @title Airdrops existing ERC20 tokens for airdrop recipients
contract ExistingERC20DropCampaign is AirdropInfoSMCampaign, AirdropMerkleProof {
    using SafeERC20 for IERC20;

    IERC20 public immutable rewardToken;
    address public immutable airBroFactorySMCampaignAddress;
    uint256 public immutable tokenSupply;

    string public airdropType = "ERC20";
    bool public airdropFunded;
    bool public fundsLocked = true;
    uint256 public tokensPerClaim;
    bytes32 public merkleRoot;

    mapping(address => bool) public hasClaimed;

    address internal airdropFunder;
    uint256 internal numberOfClaimers;

    event MerkleRootChanged(bytes32 merkleRoot);
    event Claimed(address indexed claimer);
    event AirdropFunded(address contractAddress);

    error AlreadyFunded();
    error Unauthorized();
    error AlreadyRedeemed();
    error NotEligible();
    error InsufficientAmount();
    error InsufficientLiquidity();
    error FundsLocked();

    modifier onlyAdmin() {
        if (msg.sender != IAirBroFactory(airBroFactorySMCampaignAddress).admin()) revert Unauthorized();
        _;
    }

    constructor(
        address _rewardToken,
        uint256 _tokenSupply,
        address _airBroFactorySMCampaignAddress
    ) {
        rewardToken = IERC20(_rewardToken);
        tokenSupply = _tokenSupply;
        airBroFactorySMCampaignAddress = _airBroFactorySMCampaignAddress;
    }

    /// @notice Sets the merkleRoot and the number of claimers (also setting the amount each claimer receivers)
    /// @notice can only be done by admin
    /// @param _merkleRoot The root hash of the Merle Tree
    /// @param _numberOfClaimers The number of people eligible to claim
    function setMerkleRoot(bytes32 _merkleRoot, uint256 _numberOfClaimers) external onlyAdmin {
        merkleRoot = _merkleRoot;
        numberOfClaimers = _numberOfClaimers;
        tokensPerClaim = tokenSupply / numberOfClaimers;
        emit MerkleRootChanged(_merkleRoot);
    }

    /// @notice Allows the airdrop creator to provide funds for the airdrop reward
    function fundAirdrop() external {
        if (airdropFunded) revert AlreadyFunded();

        if (rewardToken.balanceOf(msg.sender) < tokenSupply) revert InsufficientAmount();
        if (rewardToken.allowance(msg.sender, address(this)) < tokenSupply) revert InsufficientAmount();

        airdropFunded = true;
        airdropFunder = msg.sender;

        rewardToken.safeTransferFrom(msg.sender, address(this), tokenSupply);
        emit AirdropFunded(address(this));
    }

    /// @notice Unlocks withdrawal of funds deposited to this contract
    function unlockFunds() external onlyAdmin {
        fundsLocked = false;
    }

    /// @notice Locks withdrawal of funds deposited to this contract
    function lockFunds() external onlyAdmin {
        fundsLocked = true;
    }

    /// @notice Allows the airdrop creator to withdraw back the funds after the airdrop has finished
    function withdrawAirdropFunds() external {
        if (airdropFunder != msg.sender) revert Unauthorized();
        if (fundsLocked == true) revert FundsLocked();

        rewardToken.safeTransfer(msg.sender, rewardToken.balanceOf(address(this)));
    }

    /// @notice Allows eligible users to claim their ERC20 airdrop
    /// @param _merkleProof is the merkle proof that this user is eligible for claiming the ERC20 airdrop
    function claim(bytes32[] calldata _merkleProof) external {
        if (isEligibleForReward(_merkleProof)) {
            hasClaimed[msg.sender] = true;
            rewardToken.safeTransfer(msg.sender, tokensPerClaim);
            emit Claimed(msg.sender);
        } else {
            revert NotEligible();
        }
    }

    /// @notice Checks if the user is eligible for this airdrop
    /// @param _merkleProof The proof a user can claim a reward
    function isEligibleForReward(bytes32[] calldata _merkleProof) public view returns (bool) {
        if (hasClaimed[msg.sender]) revert AlreadyRedeemed();
        if (rewardToken.balanceOf(address(this)) < tokensPerClaim) revert InsufficientLiquidity();
        return checkProof(_merkleProof, merkleRoot);
    }

    /// @notice Returns the amount of airdrop tokens a user can claim
    /// @param _merkleProof The proof a user can claim a reward
    function getAirdropAmount(bytes32[] calldata _merkleProof) external view returns (uint256) {
        return isEligibleForReward(_merkleProof) ? tokensPerClaim : 0;
    }
}
