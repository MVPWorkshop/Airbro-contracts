import { expect } from "chai";
import { ethers, network } from "hardhat";
import { MerkleTree } from "merkletreejs";
const { keccak256 } = ethers.utils;

const dayInSeconds: number = 86400;

export function ExistingERC20DropCampaignShouldBeEligible(): void {
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

    it("should show the user if they are eligible to claim", async function () {
      const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
      const leaves = whitelisted.map(addr => keccak256(addr));
      const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
      const roothash = merkleTree.getHexRoot();
      const aliceHexProof = merkleTree.getHexProof(leaves[0]);

      //   admin sets merkle root
      await this.existingERC20DropCampaign.connect(this.signers.backendWallet).setMerkleRoot(roothash, 4);
      expect(await this.existingERC20DropCampaign.connect(this.signers.alice).isEligibleForReward(aliceHexProof)).to.be.equal(true);
      expect(await this.existingERC20DropCampaign.connect(this.signers.bob).isEligibleForReward(aliceHexProof)).to.be.equal(false); // bob is trying with Alice's proof, should be false;
    });

    it("should return false if user has already claimed reward", async function () {
      const tokenSupply: number = this.existingERC20DropCampaignArgs.tokenSupply;

      // deployer funding airdrop
      await this.testToken.mint(this.signers.deployer.address, tokenSupply);
      await this.testToken.connect(this.signers.deployer).approve(this.existingERC20DropCampaign.address, tokenSupply);
      await this.existingERC20DropCampaign.connect(this.signers.deployer).fundAirdrop();

      // setting merkleRoot
      const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
      const leaves = whitelisted.map(addr => keccak256(addr));
      const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
      const roothash = merkleTree.getHexRoot();
      const aliceHexProof = merkleTree.getHexProof(leaves[0]);

      await this.existingERC20DropCampaign.connect(this.signers.backendWallet).setMerkleRoot(roothash, 4);

      expect(await this.existingERC20DropCampaign.connect(this.signers.alice).isEligibleForReward(aliceHexProof)).to.be.equal(true);
      // alice claiming reward
      await this.existingERC20DropCampaign.connect(this.signers.alice).claim(aliceHexProof);

      // should be false since user is no longer eligible for reward
      expect(await this.existingERC20DropCampaign.connect(this.signers.alice).isEligibleForReward(aliceHexProof)).to.be.equal(false);
    });

    it("should return false if user checks eligibility after airdrop expires", async function () {
      const tokenSupply: number = this.existingERC20DropCampaignArgs.tokenSupply;

      // deployer funding airdrop
      await this.testToken.mint(this.signers.deployer.address, tokenSupply);
      await this.testToken.connect(this.signers.deployer).approve(this.existingERC20DropCampaign.address, tokenSupply);
      await this.existingERC20DropCampaign.connect(this.signers.deployer).fundAirdrop();

      // setting merkleRoot
      const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
      const leaves = whitelisted.map(addr => keccak256(addr));
      const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
      const roothash = merkleTree.getHexRoot();
      const aliceHexProof = merkleTree.getHexProof(leaves[0]);

      await this.existingERC20DropCampaign.connect(this.signers.backendWallet).setMerkleRoot(roothash, 4);

      // changing the timestamp
      await network.provider.send("evm_increaseTime", [60 * dayInSeconds + 1]); // 1 seconds after expirationTimestamp
      await network.provider.send("evm_mine");

      // should return false since user is no longer eligible for reward
      expect(await this.existingERC20DropCampaign.connect(this.signers.alice).isEligibleForReward(aliceHexProof)).to.be.equal(false);
    });
  });
}
