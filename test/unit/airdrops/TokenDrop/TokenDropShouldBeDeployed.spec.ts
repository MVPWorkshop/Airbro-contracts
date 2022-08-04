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
      expect(await this.tokenDrop.airdropType()).to.be.equal("ERC20");
    });

    it("should return valid value from airdrop amount", async function () {
      // mocking the mock BAYC state for Alice and Bob
      await this.mocks.mockBaycNft.mock.ownerOf.withArgs(0).returns(this.signers.alice.address);
      await this.mocks.mockBaycNft.mock.balanceOf.withArgs(this.signers.alice.address).returns(1);
      await this.mocks.mockBaycNft.mock.balanceOf.withArgs(this.signers.bob.address).returns(0);

      expect(await this.tokenDrop.connect(this.signers.alice).getAirdropAmount()).to.be.equal(
        this.constructorArgs.tokensPerClaim, // since alice only has one BAYC, she can claim that many tokensPerClaim as a reward
      );

      expect(await this.tokenDrop.connect(this.signers.bob).getAirdropAmount()).to.be.equal(0); //bob has no BAYC, so has 0 as the airdrop amount
    });
  });
};
