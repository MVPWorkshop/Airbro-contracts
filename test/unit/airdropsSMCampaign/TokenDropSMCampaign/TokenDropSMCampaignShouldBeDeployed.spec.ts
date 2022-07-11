import { expect } from "chai";
import { ethers } from "hardhat";

const dayInSeconds: number = 86400;

export const TokenDropSMCampaignShouldDeploy = (): void => {
  describe("should deploy", async function () {
    // potentially remove this later
    it("should have contract owner to address of deployer upon deployment", async function () {
      expect(await this.tokenDropSMCampaign.owner()).to.be.equal(this.signers.deployer.address);
    });

    it("should have rewardedNft set to correct hardcoded address", async function () {
      expect(await this.tokenDropSMCampaign.rewardedNft()).to.be.equal(this.constructorArgs.rewardedNft);
    });

    it("should have tokensPerClaim set to correct amount", async function () {
      expect(await this.tokenDropSMCampaign.tokensPerClaim()).to.be.equal(this.constructorArgs.tokensPerClaim);
    });

    it("should have token name set to correct name", async function () {
      expect(await this.tokenDropSMCampaign.name()).to.be.equal(this.constructorArgs.name);
    });

    it("should have token symbol set to correct symbol", async function () {
      expect(await this.tokenDropSMCampaign.symbol()).to.be.equal(this.constructorArgs.symbol);
    });

    it("should have token decimals set to 18", async function () {
      expect(await this.tokenDropSMCampaign.decimals()).to.be.equal(18);
    });

    it("should have airdropDuration set to 1 day (specifically, 86400 seconds)", async function () {
      expect(await this.tokenDropSMCampaign.airdropDuration()).to.be.equal(this.constructorArgs.airdropDuration * dayInSeconds);
    });

    it("expect airdropStartTime to be the block timestamp", async function () {
      const blockNumBefore = await ethers.provider.getBlockNumber();
      const blockBefore = await ethers.provider.getBlock(blockNumBefore);

      expect(await this.tokenDropSMCampaign.airdropStartTime()).to.be.equal(blockBefore.timestamp);
    });

    it("expect airdropFinishTime to be correctly set", async function () {
      const blockNumBefore = await ethers.provider.getBlockNumber();
      const blockBefore = await ethers.provider.getBlock(blockNumBefore);

      expect(await this.tokenDropSMCampaign.airdropFinishTime()).to.be.equal(
        blockBefore.timestamp + this.constructorArgs.airdropDuration * dayInSeconds,
      );
    });

    it("should return correct airdrop type", async function () {
      expect(await this.tokenDropSMCampaign.getAirdropType()).to.be.equal("ERC20");
    });

    it("should have merkleRoot set to 0x00", async function () {
      expect(await this.tokenDropSMCampaign.merkleRoot()).to.be.equal("0x0000000000000000000000000000000000000000000000000000000000000000");
    });

    it("should set airBroFactoryAddress to a the airbroFactory address", async function () {
      expect(await this.tokenDropSMCampaign.airBroFactoryAddress()).to.be.equal(this.mocks.mockAirBroFactorySMCampaign.address);
    });
  });
};
