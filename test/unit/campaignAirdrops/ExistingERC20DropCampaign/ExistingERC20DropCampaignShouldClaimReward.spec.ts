import { expect } from "chai";
import { ethers, network } from "hardhat";
import { MerkleTree } from "merkletreejs";
const { keccak256 } = ethers.utils;
import { constants } from "ethers";

export function ExistingERC20DropCampaignShouldClaimReward(): void {
  describe("user should be able to claim reward", async function () {
    it("should be able to claim if part of merkleRoot", async function () {
      const tokenSupply: number = this.existingERC20DropCampaignArgs.tokenSupply;
      const numOfClaimers: number = 1;

      // making merkleTree and merkleRootHash
      const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
      const leaves = whitelisted.map(addr => keccak256(addr));
      const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
      const roothash = merkleTree.getHexRoot();

      // setting merkleRootHash
      expect(await this.existingERC20DropCampaign.connect(this.signers.backendWallet).setMerkleRoot(roothash, numOfClaimers))
        .to.emit(this.existingERC20DropCampaign, "MerkleRootChanged")
        .withArgs(roothash);

      // making merkleProof for alice's address
      const hexProof = merkleTree.getHexProof(leaves[0]);

      expect(await this.existingERC20DropCampaign.hasClaimed(this.signers.alice.address)).to.be.equal(false);

      //expect(await this.existingERC20DropCampaign.connect(this.signers.alice).isEligibleForReward(hexProof)).to.be.equal(true); // contract must be funded first, this is why this wont work

      // checking if hasClaimed is labeled true after claim
      /* expect(await this.existingERC20DropCampaign.hasClaimed(this.signers.alice.address)).to.be.equal(false); */
      /* expect(await this.existingERC20DropCampaign.balanceOf(this.signers.alice.address, constants.Zero)).to.be.equal(0); */
    });
  });
}
