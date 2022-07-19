import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";
const { keccak256 } = ethers.utils;

export function ExistingERC20DropCampaignShouldShowEligibiility(): void {
  describe("should show eligibility", async function () {
    it("should show the user is eligible for claim", async function () {
      const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
      const leaves = whitelisted.map(addr => keccak256(addr));
      const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
      const roothash = merkleTree.getHexRoot();
      const aliceHexProof = merkleTree.getHexProof(leaves[0]);

      //   admin sets merkle root
      await this.existingERC20DropCampaign.connect(this.signers.backendWallet).setMerkleRoot(roothash, 4);

      //   eligibility check
      expect(await this.existingERC20DropCampaign.connect(this.signers.alice).isEligibleForReward(aliceHexProof)).to.be.equal(true);
    });
  });
}
