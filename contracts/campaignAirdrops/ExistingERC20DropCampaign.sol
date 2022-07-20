// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../interfaces/AirdropMerkleProof.sol";
import "../interfaces/IAirBroFactory.sol";

/// @title Airdrops existing ERC20 tokens for airdrop recipients
contract ExistingERC20DropCampaign is AirdropMerkleProof {
    using SafeERC20 for IERC20;

    IERC20 public immutable rewardToken;
    address public immutable airbroCampaignFactoryAddress;
    uint256 public immutable tokenSupply;

    string public airdropType = "ERC20";
    bool public airdropFunded;
    bool public merkleRootSet;
    uint256 internal numberOfClaimers;
    uint256 public tokensPerClaim;
    uint256 public airdropExpirationTimestamp;
    bytes32 public merkleRoot;

    mapping(address => bool) public hasClaimed;

    address internal airdropFunder;

    event MerkleRootChanged(bytes32 merkleRoot, uint256 _numberOfClaimers);
    event Claimed(address indexed claimer);
    event AirdropFunded(address contractAddress);

    error AlreadyFunded();
    error Unauthorized();
    error AlreadyRedeemed();
    error AirdropStillActive();
    error AirdropExpired();
    error NotEligible();
    error InsufficientAmount();
    error InsufficientLiquidity();
    error MerkleRootAlreadySet();

    modifier onlyAdmin() {
        if (msg.sender != IAirBroFactory(airbroCampaignFactoryAddress).admin()) revert Unauthorized();
        _;
    }

    constructor(
        address _rewardToken,
        uint256 _tokenSupply,
        address _airbroCampaignFactoryAddress
    ) {
        rewardToken = IERC20(_rewardToken);
        tokenSupply = _tokenSupply;
        airbroCampaignFactoryAddress = _airbroCampaignFactoryAddress;
    }

    /// @notice Sets the merkleRoot and the number of claimers (also setting the amount each claimer receivers)
    /// @notice can only be done by admin
    /// @param _merkleRoot The root hash of the Merle Tree
    /// @param _numberOfClaimers The number of people eligible to claim
    function setMerkleRoot(bytes32 _merkleRoot, uint256 _numberOfClaimers) external onlyAdmin {
        if (merkleRootSet) revert MerkleRootAlreadySet();

        merkleRootSet = true;
        merkleRoot = _merkleRoot;
        airdropExpirationTimestamp = block.timestamp + 60 days;
        numberOfClaimers = _numberOfClaimers;
        tokensPerClaim = tokenSupply / numberOfClaimers;

        emit MerkleRootChanged(_merkleRoot, _numberOfClaimers);
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

    /// @notice Allows the airdrop creator to withdraw back the funds after the airdrop has finished
    function withdrawAirdropFunds() external {
        if (airdropFunder != msg.sender) revert Unauthorized();
        if (block.timestamp <= airdropExpirationTimestamp) revert AirdropStillActive();

        rewardToken.safeTransfer(msg.sender, rewardToken.balanceOf(address(this)));
    }

    /// @notice Allows eligible users to claim their ERC20 airdrop
    /// @param _merkleProof is the merkle proof that this user is eligible for claiming the ERC20 airdrop
    function claim(bytes32[] calldata _merkleProof) external {
        if (isEligibleForReward(_merkleProof)) {
            if (rewardToken.balanceOf(address(this)) < tokensPerClaim) revert InsufficientLiquidity();

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
        if (block.timestamp > airdropExpirationTimestamp) revert AirdropExpired();

        return checkProof(_merkleProof, merkleRoot);
    }

    /// @notice Returns the amount of airdrop tokens a user can claim
    /// @param _merkleProof The proof a user can claim a reward
    function getAirdropAmount(bytes32[] calldata _merkleProof) external view returns (uint256) {
        return isEligibleForReward(_merkleProof) ? tokensPerClaim : 0;
    }
}
