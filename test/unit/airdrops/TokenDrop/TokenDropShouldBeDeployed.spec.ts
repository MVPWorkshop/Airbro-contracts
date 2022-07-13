import { expect } from "chai";
import { ethers } from "hardhat";

const dayInSeconds: number = 86400;

export const TokenDropShouldDeploy = (): void => {
  describe("should deploy", async function () {
    
    it("should have rewardedNft set to correct hardcoded address", async function () {
      expect(await this.tokenDrop.rewardedNft()).to.be.equal(this.constructorArgs.rewardedNft);
    });

    it("should have tokensPerClaim set to correct amount", async function () {
      expect(await this.tokenDrop.tokensPerClaim()).to.be.equal(this.constructorArgs.tokensPerClaim);
    });

    it("should have token name set to correct name", async function () {
      expect(await this.tokenDrop.name()).to.be.equal(this.constructorArgs.name);
    });

    it("should have token symbol set to correct symbol", async function () {
      expect(await this.tokenDrop.symbol()).to.be.equal(this.constructorArgs.symbol);
    });

    it("should have token decimals set to 18", async function () {
      expect(await this.tokenDrop.decimals()).to.be.equal(18);
    });

    it("should have airdropDuration set to 1 day (specifically, 86400 seconds)", async function () {
      expect(await this.tokenDrop.airdropDuration()).to.be.equal(this.constructorArgs.airdropDuration * dayInSeconds);
    });

    it("expect airdropStartTime to be the block timestamp", async function () {
      const blockNumBefore = await ethers.provider.getBlockNumber();
      const blockBefore = await ethers.provider.getBlock(blockNumBefore);

      expect(await this.tokenDrop.airdropStartTime()).to.be.equal(blockBefore.timestamp);
    });

    it("expect airdropFinishTime to be correctly set", async function () {
      const blockNumBefore = await ethers.provider.getBlockNumber();
      const blockBefore = await ethers.provider.getBlock(blockNumBefore);

      expect(await this.tokenDrop.airdropFinishTime()).to.be.equal(
        blockBefore.timestamp + this.constructorArgs.airdropDuration * dayInSeconds,
      );
    });

    it("should return correct airdrp type", async function () {
      expect(await this.tokenDrop.getAirdropType()).to.be.equal("ERC20");
    });

  });
};
