import { expect } from "chai";

export const ExistingTokenDropShouldShowRewardAmount = (): void => {
  describe("should show airdrop reward amount for the user", async function () {
    it("show claimable amount of tokens based on number of NFTs owned", async function () {
      // mint 2 NFTs for deployer wallet because the mocked value of mockDAItoken's balanceOf is 2
      await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);
      await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);

      const rewardSum = (await this.mocks.mockDAItoken.balanceOf(this.signers.deployer.address)) * this.constructorArgs.tokensPerClaim;

      expect(await this.existingTokenDrop.getAirdropAmount()).to.be.equal(rewardSum);
    });
  });
};
