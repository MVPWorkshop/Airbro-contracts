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
    address internal airdropFundingHolder;
    uint256 public airdropFundBlockTimestamp;
    uint256 public numberOfClaimers;

    bytes32 public merkleRoot;

    mapping(address => bool) public hasClaimed;

    event MerkleRootChanged(bytes32 merkleRoot);
    event Claimed(address indexed claimer);
    event AirdropFunded(address contractAddress);

    error AlreadyFunded();
    error Unauthorized();
    error AlreadyRedeemed();
    error NotEligible();
    error InsufficientAmount();
    error InsufficientLiquidity();

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

    /// @notice Allows the airdrop creator to provide funds for the airdrop reward
    function fundAirdrop() external {
        if (airdropFunded) revert AlreadyFunded();

        if (rewardToken.balanceOf(msg.sender) < tokenSupply) revert InsufficientAmount();
        if (rewardToken.allowance(msg.sender, address(this)) < tokenSupply) revert InsufficientAmount();

        airdropFunded = true;
        airdropFundBlockTimestamp = block.timestamp;
        airdropFundingHolder = msg.sender;

        rewardToken.safeTransferFrom(msg.sender, address(this), tokenSupply);
        emit AirdropFunded(address(this));
    }

    /// @notice Sets the merkleRoot - can only be done if admin (different from the contract owner)
    /// @param _merkleRoot The root hash of the Merle Tree
    /// @param _numberOfClaimers The number of people eligible to claim
    function setMerkleRoot(bytes32 _merkleRoot, uint256 _numberOfClaimers) external onlyAdmin {
        merkleRoot = _merkleRoot;
        numberOfClaimers = _numberOfClaimers;
        emit MerkleRootChanged(_merkleRoot);
    }

    /// @notice Allows eligible users to claim their ERC20 airdrop
    /// @param _merkleProof is the merkle proof that this user is eligible for claiming the ERC20 airdrop
    function claim(bytes32[] calldata _merkleProof) external {
        if (isEligibleForReward(_merkleProof)) {
            hasClaimed[msg.sender] = true;
            // rewardToken.safeTransfer(msg.sender, tokensPerClaim);
            emit Claimed(msg.sender);
        } else {
            revert NotEligible();
        }
    }

    /// @notice Checks if the user is eligible for this airdrop
    /// @param _merkleProof The proof a user can claim a reward
    function isEligibleForReward(bytes32[] calldata _merkleProof) public view returns (bool) {
        if (hasClaimed[msg.sender]) revert AlreadyRedeemed();
        if (rewardToken.balanceOf(address(this)) < tokenSupply / numberOfClaimers) revert InsufficientLiquidity(); // do we actually need this ?
        return checkProof(_merkleProof, merkleRoot);
    }

    /// @notice Returns the amount of airdrop tokens a user can claim
    /// @param _merkleProof The proof a user can claim a reward
    function getAirdropAmount(bytes32[] calldata _merkleProof) external view returns (uint256) {
        return isEligibleForReward(_merkleProof) ? (tokenSupply / numberOfClaimers) : 0;
    }
}
