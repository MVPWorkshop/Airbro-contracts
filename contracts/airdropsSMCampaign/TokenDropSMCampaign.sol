// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "@rari-capital/solmate/src/tokens/ERC20.sol";
// import "@rari-capital/solmate/src/tokens/ERC1155.sol"; // have to comment it out otherwise error
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/AirdropInfoSMCampaign.sol";
import "../interfaces/AirdropMerkleProof.sol";
import "../interfaces/IAirBroFactory.sol";

/// @title Airdrops new ERC20 tokens for airdrop recipients
contract TokenDropSMCampaign is ERC20, AirdropInfoSMCampaign, AirdropMerkleProof, Ownable {
    IERC1155 public immutable rewardedNft;
    uint256 public immutable tokensPerClaim;
    address public immutable airBroFactoryAddress;

    event Claimed(address indexed claimer);
    event MerkleRootChanged(bytes32 merkleRoot);

    error NotOwner();
    error AlreadyRedeemed();
    error AirdropExpired();
    error NotAdmin();
    error NotEligible();

    mapping(address => bool) public hasClaimed;

    // The root hash of the Merle Tree we previously generated in our JavaScript code. Remember
    // to provide this as a bytes32 type and not string. Ox should be prepended.
    bytes32 public merkleRoot;

    uint256 public immutable airdropDuration;
    uint256 public immutable airdropStartTime;
    uint256 public immutable airdropFinishTime;

    modifier onlyAdmin() {
        if (msg.sender != IAirBroFactory(airBroFactoryAddress).admin()) revert NotAdmin();
        _;
    }

    constructor(
        address _rewardedNft,
        uint256 _tokensPerClaim,
        string memory name,
        string memory symbol,
        uint256 _airdropDuration,
        address _airBroFactoryAddress
    ) ERC20(name, symbol, 18) {
        rewardedNft = IERC1155(_rewardedNft);
        tokensPerClaim = _tokensPerClaim;
        airdropDuration = _airdropDuration * 1 days;
        airdropStartTime = block.timestamp;
        airdropFinishTime = block.timestamp + airdropDuration;
        airBroFactoryAddress = _airBroFactoryAddress;
    }

    /// @notice Sets the merkleRoot - can only be done if admin (different from the contract owner)
    /// @param _merkleRoot - The root hash of the Merle Tree
    function setMerkleRoot(bytes32 _merkleRoot) external onlyAdmin {
        merkleRoot = _merkleRoot;
        emit MerkleRootChanged(_merkleRoot);
    }

    function claim(bytes32[] calldata _merkleProof) external {
        if (hasClaimed[msg.sender]) revert AlreadyRedeemed();
        if (block.timestamp > airdropFinishTime) revert AirdropExpired();

        bool isEligible = checkProof(_merkleProof, merkleRoot);

        if (isEligible) {
            hasClaimed[msg.sender] = true;
            emit Claimed(msg.sender);

            _mint(msg.sender, tokensPerClaim);
        } else {
            revert NotEligible();
        }
    }

    ///@notice Get the type of airdrop, it's either ERC20, ERC721, ERC1155
    function getAirdropType() external pure returns (string memory) {
        return "ERC20";
    }

    ///@notice Checks if the user is eligible for this airdrop
    function isEligibleForReward(bytes32[] calldata _merkleProof) public view returns (bool) {
        if (hasClaimed[msg.sender]) revert AlreadyRedeemed();
        if (block.timestamp > airdropFinishTime) revert AirdropExpired();
        bool isEligible = checkProof(_merkleProof, merkleRoot);
        return isEligible;
    }

    ///@notice Returns the amount(number) of airdrop tokens to claim
    //@param tokenId is the rewarded NFT collections token ID
    function getAirdropAmount(bytes32[] calldata _merkleProof) external view returns (uint256) {
        return isEligibleForReward(_merkleProof) ? tokensPerClaim : 0;
    }

    function getAirdropFinishTime() external view override returns (uint256) {
        return airdropFinishTime;
    }

    function getAirdropDuration() external view override returns (uint256) {
        return airdropDuration;
    }

    function getAirdropStartTime() external view override returns (uint256) {
        return airdropStartTime;
    }
}
