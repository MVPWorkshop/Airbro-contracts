import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";
const { keccak256 } = ethers.utils;

const dayInSeconds: number = 86400;

export const ExistingTokenDropSMCampaignShouldDeploy = (): void => {
  describe("should deploy", async function () {
    it("should have rewardedNft set to correct hardcoded address", async function () {
      expect(await this.existingTokenDropSMCampaign.rewardedNft()).to.be.equal(this.constructorArgs.rewardedNft);
    });

    it("should have tokensPerClaim set to correct amount", async function () {
      expect(await this.existingTokenDropSMCampaign.tokensPerClaim()).to.be.equal(this.constructorArgs.tokensPerClaim);
    });

    it("should have rewardToken set to correct hardcoded address", async function () {
      expect(await this.existingTokenDropSMCampaign.rewardToken()).to.be.equal(this.constructorArgs.rewardToken);
    });

    it("should have totalAirdropAmount set to correct value", async function () {
      expect(await this.existingTokenDropSMCampaign.totalAirdropAmount()).to.be.equal(
        this.constructorArgs.totalAirdropAmount,
      );
    });

    it("should have airdropDuration set to 1 day (specifically, 86400 seconds)", async function () {
      expect(await this.existingTokenDropSMCampaign.airdropDuration()).to.be.equal(
        this.constructorArgs.airdropDuration * dayInSeconds,
      );
    });

    it("expect airdropStartTime to be the block timestamp", async function () {
      const blockNumBefore = await ethers.provider.getBlockNumber();
      const blockBefore = await ethers.provider.getBlock(blockNumBefore);

      expect(await this.existingTokenDropSMCampaign.airdropStartTime()).to.be.equal(blockBefore.timestamp);
    });

    it("expect airdropFinishTime to be correctly set", async function () {
      const blockNumBefore = await ethers.provider.getBlockNumber();
      const blockBefore = await ethers.provider.getBlock(blockNumBefore);

      expect(await this.existingTokenDropSMCampaign.airdropFinishTime()).to.be.equal(
        blockBefore.timestamp + this.constructorArgs.airdropDuration * dayInSeconds,
      );
    });

    it("should return correct airdrop type", async function () {
      expect(await this.existingTokenDropSMCampaign.airdropType()).to.be.equal("ERC20");
    });

    it("should have merkleRoot set to 0x00", async function () {
      expect(await this.existingTokenDropSMCampaign.merkleRoot()).to.be.equal(
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      );
    });

    it("should set airBroFactorySMCampaignAddress to a the airbroFactorySMCampaign address", async function () {
      expect(await this.existingTokenDropSMCampaign.airBroFactorySMCampaignAddress()).to.be.equal(
        this.mocks.mockAirBroFactorySMCampaign.address,
      );
    });

    it("should return vaid from airdrop amount when using valid and invalid merkle proof", async function () {
      const leaves = [this.signers.alice.address].map(addr => keccak256(addr));
      const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
      const roothash = merkleTree.getHexRoot();

      await this.existingTokenDropSMCampaign.connect(this.signers.backendWallet).setMerkleRoot(roothash);

      const hexProof = merkleTree.getHexProof(leaves[0]);
      // mocking balance of mock DAI
      await this.mocks.mockDAItoken.mock.balanceOf.returns(ethers.utils.parseEther("1000"));
      expect(await this.existingTokenDropSMCampaign.connect(this.signers.alice).getAirdropAmount(hexProof)).to.be.equal(
        this.constructorArgs.tokensPerClaim,
      );

      expect(await this.existingTokenDropSMCampaign.connect(this.signers.bob).getAirdropAmount(hexProof)).to.be.equal(
        0,
      );
    });
  });
};