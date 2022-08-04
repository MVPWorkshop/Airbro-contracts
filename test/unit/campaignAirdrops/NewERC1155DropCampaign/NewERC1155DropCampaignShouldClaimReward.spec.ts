import { expect } from "chai";
import { ethers, network } from "hardhat";
import { MerkleTree } from "merkletreejs";
const { keccak256 } = ethers.utils;
import { constants } from "ethers";
import { oneWeekInSeconds } from "../../../shared/constants";

export function NewERC1155DropCampaignShouldClaimReward(): void {
  describe("user should be able to claim reward", async function () {
    it("should be able to claim if part of merkleRoot", async function () {
      // making merkleTree and merkleRootHash
      const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
      const leaves = whitelisted.map(addr => keccak256(addr));
      const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
      const roothash = merkleTree.getHexRoot();

      // setting merkleRootHash
      expect(await this.newERC1155DropCampaign.connect(this.signers.backendWallet).setMerkleRoot(roothash))
        .to.emit(this.newERC1155DropCampaign, "MerkleRootSet")
        .withArgs(roothash);

      // making merkleProof for alice's address
      const hexProof = merkleTree.getHexProof(leaves[0]);

      expect(await this.newERC1155DropCampaign.hasClaimed(this.signers.alice.address)).to.be.equal(false);

      // alice claiming her reward
      expect(await this.newERC1155DropCampaign.connect(this.signers.alice).claim(hexProof, { value: ethers.utils.parseEther("0.02") }))
        .to.emit(this.newERC1155DropCampaign, "Claimed")
        .withArgs(this.signers.alice.address);

      // checking if hasClaimed is labeled true after claim
      expect(await this.newERC1155DropCampaign.hasClaimed(this.signers.alice.address)).to.be.equal(true);
      // _tokenId variable is private and constant, but its value is 0 -> that is why constants.Zero is here
      // checking if alice is actual owner of 1 1155 NFT after claiming
      expect(await this.newERC1155DropCampaign.balanceOf(this.signers.alice.address, constants.Zero)).to.be.equal(constants.One);
    });

    it("should revert claim if not part of merkleRoot", async function () {
      const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
      const leaves = whitelisted.map(addr => keccak256(addr));
      const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
      const roothash = merkleTree.getHexRoot();

      expect(await this.newERC1155DropCampaign.connect(this.signers.backendWallet).setMerkleRoot(roothash))
        .to.emit(this.newERC1155DropCampaign, "MerkleRootSet")
        .withArgs(roothash);

      const hexProof = merkleTree.getHexProof(leaves[0]);

      await expect(
        this.newERC1155DropCampaign.connect(this.signers.peter).claim(hexProof, { value: ethers.utils.parseEther("0.02") }),
      ).to.be.revertedWith(`NotEligible`);
    });

    it("should revert claim if already redeemed", async function () {
      // making merkleTree and merkleRootHash
      const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
      const leaves = whitelisted.map(addr => keccak256(addr));
      const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
      const roothash = merkleTree.getHexRoot();

      // setting merkleRootHash
      expect(await this.newERC1155DropCampaign.connect(this.signers.backendWallet).setMerkleRoot(roothash))
        .to.emit(this.newERC1155DropCampaign, "MerkleRootSet")
        .withArgs(roothash);

      // making merkleProof for alice's address
      const hexProof = merkleTree.getHexProof(leaves[0]);

      // alice claiming her reward
      expect(await this.newERC1155DropCampaign.connect(this.signers.alice).claim(hexProof, { value: ethers.utils.parseEther("0.02") }))
        .to.emit(this.newERC1155DropCampaign, "Claimed")
        .withArgs(this.signers.alice.address);

      await expect(
        this.newERC1155DropCampaign.connect(this.signers.alice).claim(hexProof, { value: ethers.utils.parseEther("0.02") }),
      ).to.be.revertedWith(`AlreadyRedeemed`);
    });

    it("function isEligibleForReward() should return true if eligible for reward", async function () {
      const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
      const leaves = whitelisted.map(addr => keccak256(addr));
      const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
      const roothash = merkleTree.getHexRoot();

      expect(await this.newERC1155DropCampaign.connect(this.signers.backendWallet).setMerkleRoot(roothash))
        .to.emit(this.newERC1155DropCampaign, "MerkleRootSet")
        .withArgs(roothash);

      const hexProof = merkleTree.getHexProof(leaves[0]);

      const isEligibleForReward = await this.newERC1155DropCampaign.connect(this.signers.alice).isEligibleForReward(hexProof);

      expect(isEligibleForReward).to.equal(true);
    });

    it("function isEligibleForReward() should return false if user already redeemed reward", async function () {
      const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
      const leaves = whitelisted.map(addr => keccak256(addr));
      const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
      const roothash = merkleTree.getHexRoot();

      expect(await this.newERC1155DropCampaign.connect(this.signers.backendWallet).setMerkleRoot(roothash))
        .to.emit(this.newERC1155DropCampaign, "MerkleRootSet")
        .withArgs(roothash);

      const hexProof = merkleTree.getHexProof(leaves[0]);

      // alice claiming her reward
      expect(await this.newERC1155DropCampaign.connect(this.signers.alice).claim(hexProof, { value: ethers.utils.parseEther("0.02") }))
        .to.emit(this.newERC1155DropCampaign, "Claimed")
        .withArgs(this.signers.alice.address);

      expect(await this.newERC1155DropCampaign.connect(this.signers.alice).isEligibleForReward(hexProof)).to.be.equal(false);
    });

    it("should return correct amount from isEligibleForReward method", async function () {
      const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
      const leaves = whitelisted.map(addr => keccak256(addr));
      const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
      const roothash = merkleTree.getHexRoot();

      expect(await this.newERC1155DropCampaign.connect(this.signers.backendWallet).setMerkleRoot(roothash))
        .to.emit(this.newERC1155DropCampaign, "MerkleRootSet")
        .withArgs(roothash);

      const hexProof = merkleTree.getHexProof(leaves[0]);

      // bob checking if he is eligible, he should not be
      expect(await this.newERC1155DropCampaign.connect(this.signers.bob).getAirdropAmount(hexProof)).to.be.equal(0);

      // alice checking if she is eligible, she should be
      expect(await this.newERC1155DropCampaign.connect(this.signers.alice).getAirdropAmount(hexProof)).to.be.equal(1);

      // alice claiming her reward
      await this.newERC1155DropCampaign.connect(this.signers.alice).claim(hexProof, { value: ethers.utils.parseEther("0.02") });

      // alice checking if she is eligible, now she isn't
      expect(await this.newERC1155DropCampaign.connect(this.signers.alice).isEligibleForReward(hexProof)).to.be.equal(false);
    });
  });
}
