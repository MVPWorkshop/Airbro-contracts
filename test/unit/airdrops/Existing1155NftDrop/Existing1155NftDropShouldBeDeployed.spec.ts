import { expect } from "chai";
import { ethers } from "hardhat";

const dayInSeconds: number = 86400;

export const Existing1155NftDropShouldDeploy = (): void => {
  describe("should deploy", async function () {
    it("should have rewardedNft set to correct hardcoded address", async function () {
      expect(await this.existing1155NFTDrop.rewardedNft()).to.be.equal(this.constructorArgs.rewardedNft);
    });

    it("should have tokensPerClaim set to correct amount", async function () {
      expect(await this.existing1155NFTDrop.tokensPerClaim()).to.be.equal(this.constructorArgs.tokensPerClaim);
    });

    it("should have totalAirdropAmount set to correct value", async function () {
      expect(await this.existing1155NFTDrop.totalAirdropAmount()).to.be.equal(this.constructorArgs.totalAirdropAmount); // this.constructorArgs.totalAirdropAmount
    });

    it("should have airdropDuration set to 1 day (specifically, 86400 seconds)", async function () {
      expect(await this.existing1155NFTDrop.airdropDuration()).to.be.equal(this.constructorArgs.airdropDuration * dayInSeconds);
    });

    it("expect airdropStartTime to be the block timestamp", async function () {
      const blockNumBefore = await ethers.provider.getBlockNumber();
      const blockBefore = await ethers.provider.getBlock(blockNumBefore);

      expect(await this.existing1155NFTDrop.airdropStartTime()).to.be.equal(blockBefore.timestamp);
    });

    it("expect airdropFinishTime to be correctly set", async function () {
      const blockNumBefore = await ethers.provider.getBlockNumber();
      const blockBefore = await ethers.provider.getBlock(blockNumBefore);

      expect(await this.existing1155NFTDrop.airdropFinishTime()).to.be.equal(
        blockBefore.timestamp + this.constructorArgs.airdropDuration * dayInSeconds,
      );
    });

    it("should return correct airdrop type", async function () {
      expect(await this.existing1155NFTDrop.airdropType()).to.be.equal("ERC1155");
    });

    it("should return valid value from airdrop amount", async function () {
      // mocking the mock BAYC state for Alice and Bob
      await this.mocks.mockBaycNft.mock.ownerOf.withArgs(0).returns(this.signers.alice.address);
      await this.mocks.mockBaycNft.mock.balanceOf.withArgs(this.signers.alice.address).returns(1);
      await this.mocks.mockBaycNft.mock.balanceOf.withArgs(this.signers.bob.address).returns(0);

      expect(await this.existing1155NFTDrop.connect(this.signers.alice).getAirdropAmount()).to.be.equal(
        this.constructorArgs.tokensPerClaim, // since alice only has one BAYC, she can claim that many tokensPerClaim as a reward
      );

      expect(await this.existing1155NFTDrop.connect(this.signers.bob).getAirdropAmount()).to.be.equal(0); //bob has no BAYC, so has 0 as the airdrop amount
    });

    it("should support 0xf23a6e61 interface", async function () {
      expect(await this.existing1155NFTDrop.supportsInterface("0xf23a6e61")).to.be.equal(true);
    });
  });
};
