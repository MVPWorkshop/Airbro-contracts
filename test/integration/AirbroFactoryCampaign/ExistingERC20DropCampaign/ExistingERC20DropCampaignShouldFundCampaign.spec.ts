import { expect } from "chai";
import { ethers } from "hardhat";

export function ExistingERC20DropCampaignShouldFundCampaign(): void {
  describe("should fund campaign", async function () {
    it("should revert if funder does not have enough funds and/or has not approved them to the campaign", async function () {
      const tokenSupply: number = this.existingERC20DropCampaignArgs.tokenSupply; // 100

      await expect(this.existingERC20DropCampaign.connect(this.signers.alice).fundAirdrop()).to.be.revertedWith("InsufficientAmount");

      //   minting tokens to alice, should still revert because these tokens have not been approved to the campaign contract
      await this.testToken.mint(this.signers.alice.address, tokenSupply);
      await expect(this.existingERC20DropCampaign.connect(this.signers.alice).fundAirdrop()).to.be.revertedWith("InsufficientAmount");
    });

    it("should fund airdrop campaign only once", async function () {
      const tokenSupply: number = this.existingERC20DropCampaignArgs.tokenSupply; // 100

      expect(await this.existingERC20DropCampaign.airdropFunded()).to.be.equal(false);

      //   minting and  approving the tokens for spend
      await this.testToken.mint(this.signers.alice.address, tokenSupply);
      await this.testToken.connect(this.signers.alice).approve(this.existingERC20DropCampaign.address, tokenSupply);

      await expect(this.existingERC20DropCampaign.connect(this.signers.alice).fundAirdrop()).to.emit(
        this.existingERC20DropCampaign,
        "AirdropFunded",
      );

      expect(await this.existingERC20DropCampaign.airdropFunded()).to.be.equal(true);

      //   trying to fund 2nd time, should revert
      await expect(this.existingERC20DropCampaign.fundAirdrop()).to.be.revertedWith("AlreadyFunded");
    });
  });
}
