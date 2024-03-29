import { expect } from "chai";
import { ethers } from "hardhat";

const dayInSeconds: number = 86400;

export const ExistingTokenDropShouldDeploy = (): void => {
  describe("should deploy", async function () {
    it("should have rewardedNft set to correct hardcoded address", async function () {
      expect(await this.existingTokenDrop.rewardedNft()).to.be.equal(this.constructorArgs.rewardedNft);
    });

    it("should have tokensPerClaim set to correct amount", async function () {
      expect(await this.existingTokenDrop.tokensPerClaim()).to.be.equal(this.constructorArgs.tokensPerClaim);
    });

    it("should have rewardToken set to correct hardcoded address", async function () {
      expect(await this.existingTokenDrop.rewardToken()).to.be.equal(this.constructorArgs.rewardToken);
    });

    it("should have totalAirdropAmount set to correct value", async function () {
      expect(await this.existingTokenDrop.totalAirdropAmount()).to.be.equal(this.constructorArgs.totalAirdropAmount);
    });

    it("should have airdropDuration set to 1 day (specifically, 86400 seconds)", async function () {
      expect(await this.existingTokenDrop.airdropDuration()).to.be.equal(this.constructorArgs.airdropDuration * 86400);
    });

    it("expect airdropStartTime to be the block timestamp", async function () {
      const blockNumBefore = await ethers.provider.getBlockNumber();
      const blockBefore = await ethers.provider.getBlock(blockNumBefore);

      expect(await this.existingTokenDrop.airdropStartTime()).to.be.equal(blockBefore.timestamp);
    });

    it("expect airdropFinishTime to be correctly set", async function () {
      const blockNumBefore = await ethers.provider.getBlockNumber();
      const blockBefore = await ethers.provider.getBlock(blockNumBefore);

      expect(await this.existingTokenDrop.airdropFinishTime()).to.be.equal(
        blockBefore.timestamp + this.constructorArgs.airdropDuration * dayInSeconds,
      );
    });

    it("should return correct airdrp type", async function () {
      expect(await this.existingTokenDrop.airdropType()).to.be.equal("ERC20");
    });

    it("should return valid value from airdrop amount", async function () {
      // mocking the mock BAYC state for Alice and Bob
      await this.mocks.mockBaycNft.mock.ownerOf.withArgs(0).returns(this.signers.alice.address);
      await this.mocks.mockBaycNft.mock.balanceOf.withArgs(this.signers.alice.address).returns(1);
      await this.mocks.mockBaycNft.mock.balanceOf.withArgs(this.signers.bob.address).returns(0);

      expect(await this.existingTokenDrop.connect(this.signers.alice).getAirdropAmount()).to.be.equal(
        this.constructorArgs.tokensPerClaim, // since alice only has one BAYC, she can claim that many tokensPerClaim as a reward
      );

      expect(await this.existingTokenDrop.connect(this.signers.bob).getAirdropAmount()).to.be.equal(0); //bob has no BAYC, so has 0 as the airdrop amount
    });
  });
};
