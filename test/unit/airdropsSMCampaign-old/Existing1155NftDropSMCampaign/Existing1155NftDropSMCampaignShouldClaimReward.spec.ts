import { expect } from "chai";
import { ethers, network } from "hardhat";
import { MerkleTree } from "merkletreejs";
const { keccak256 } = ethers.utils;
import { constants } from "ethers";
import { oneWeekInSeconds } from "../../../shared/constants";

export const Existing1155NftDropSMCampaignShouldClaimReward = (): void => {
  describe("user should be able to claim reward", async function () {
    it("should be able to claim if part of merkleRoot", async function () {
      const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
      const leaves = whitelisted.map(addr => keccak256(addr));
      const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
      const roothash = merkleTree.getHexRoot();

      expect(await this.existing1155NFTDropSMCampaign.connect(this.signers.backendWallet).setMerkleRoot(roothash))
        .to.emit(this.existing1155NFTDropSMCampaign, "MerkleRootChanged")
        .withArgs(roothash);

      const hexProof = merkleTree.getHexProof(leaves[0]);

      expect(await this.existing1155NFTDropSMCampaign.connect(this.signers.alice).claim(hexProof))
        .to.emit(this.existing1155NFTDropSMCampaign, "Claimed")
        .withArgs(this.signers.alice.address);
    });

    it("should revert claim if airdrop has expired", async function () {
      await ethers.provider.send("evm_increaseTime", [oneWeekInSeconds]); // add one week worth of seconds

      const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
      const leaves = whitelisted.map(addr => keccak256(addr));
      const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
      const roothash = merkleTree.getHexRoot();

      expect(await this.existing1155NFTDropSMCampaign.connect(this.signers.backendWallet).setMerkleRoot(roothash))
        .to.emit(this.existing1155NFTDropSMCampaign, "MerkleRootChanged")
        .withArgs(roothash);

      const hexProof = merkleTree.getHexProof(leaves[0]);

      await expect(this.existing1155NFTDropSMCampaign.connect(this.signers.alice).claim(hexProof)).to.be.revertedWith(`AirdropExpired`);
    });

    it("should revert claim if not part of merkleRoot", async function () {
      const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
      const leaves = whitelisted.map(addr => keccak256(addr));
      const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
      const roothash = merkleTree.getHexRoot();

      expect(await this.existing1155NFTDropSMCampaign.connect(this.signers.backendWallet).setMerkleRoot(roothash))
        .to.emit(this.existing1155NFTDropSMCampaign, "MerkleRootChanged")
        .withArgs(roothash);

      const hexProof = merkleTree.getHexProof(leaves[0]);

      await expect(this.existing1155NFTDropSMCampaign.connect(this.signers.peter).claim(hexProof)).to.be.revertedWith(`NotEligible`);
    });

    it("should return true if eligible for reward", async function () {
      const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
      const leaves = whitelisted.map(addr => keccak256(addr));
      const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
      const roothash = merkleTree.getHexRoot();

      expect(await this.existing1155NFTDropSMCampaign.connect(this.signers.backendWallet).setMerkleRoot(roothash))
        .to.emit(this.existing1155NFTDropSMCampaign, "MerkleRootChanged")
        .withArgs(roothash);

      const hexProof = merkleTree.getHexProof(leaves[0]);

      const isEligibleForReward = await this.existing1155NFTDropSMCampaign.connect(this.signers.alice).isEligibleForReward(hexProof);

      expect(isEligibleForReward).to.equal(true);
    });

    it("should return airdropAmount if eligible for reward", async function () {
      const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
      const leaves = whitelisted.map(addr => keccak256(addr));
      const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
      const roothash = merkleTree.getHexRoot();

      expect(await this.existing1155NFTDropSMCampaign.connect(this.signers.backendWallet).setMerkleRoot(roothash))
        .to.emit(this.existing1155NFTDropSMCampaign, "MerkleRootChanged")
        .withArgs(roothash);

      const hexProof = merkleTree.getHexProof(leaves[0]);

      const airdropAmount = await this.existing1155NFTDropSMCampaign.connect(this.signers.alice).getAirdropAmount(hexProof);

      expect(airdropAmount).to.not.equal(constants.Zero);
    });

    it("should return 0 for airdropAmount if not eligible for reward", async function () {
      const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
      const leaves = whitelisted.map(addr => keccak256(addr));
      const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
      const roothash = merkleTree.getHexRoot();

      expect(await this.existing1155NFTDropSMCampaign.connect(this.signers.backendWallet).setMerkleRoot(roothash))
        .to.emit(this.existing1155NFTDropSMCampaign, "MerkleRootChanged")
        .withArgs(roothash);

      const hexProof = merkleTree.getHexProof(leaves[0]);

      const airdropAmount = await this.existing1155NFTDropSMCampaign.connect(this.signers.peter).getAirdropAmount(hexProof);

      expect(airdropAmount).to.equal(constants.Zero);
    });

    it("should revert if insuficcient liquidity to payout reward", async function () {
      const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
      const leaves = whitelisted.map(addr => keccak256(addr));
      const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
      const roothash = merkleTree.getHexRoot();

      expect(await this.existing1155NFTDropSMCampaign.connect(this.signers.backendWallet).setMerkleRoot(roothash))
        .to.emit(this.existing1155NFTDropSMCampaign, "MerkleRootChanged")
        .withArgs(roothash);

      const hexProof = merkleTree.getHexProof(leaves[0]);

      await network.provider.send("evm_increaseTime", [oneWeekInSeconds]);
      await network.provider.send("evm_mine");

      await expect(this.existing1155NFTDropSMCampaign.connect(this.signers.alice).claim(hexProof)).to.be.revertedWith(`AirdropExpired`);
    });
  });
};