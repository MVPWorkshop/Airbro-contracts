import { expect } from "chai";
import { ethers } from "hardhat";
import { constants } from "ethers";

export function ExistingERC20DropCampaignShouldFundCampaign(): void {
  describe("should fund campaign", async function () {
    it("should revert if funder does not have enough funds and/or has not approved them to the campaign", async function () {
      const tokenSupply: number = this.existingERC20DropCampaignArgs.tokenSupply; // 100

      await expect(this.existingERC20DropCampaign.connect(this.signers.alice).fundAirdrop()).to.be.revertedWith(
        "ERC20: insufficient allowance",
      );

      //   minting tokens to alice, should still revert because these tokens have not been approved to the campaign contract
      await this.testToken.mint(this.signers.alice.address, tokenSupply);
      await expect(this.existingERC20DropCampaign.connect(this.signers.alice).fundAirdrop()).to.be.revertedWith(
        "ERC20: insufficient allowance",
      );
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

    it("should unlock withdraw of funds early", async function () {
      const tokenSupply: number = this.existingERC20DropCampaignArgs.tokenSupply; // 100

      //   minting and  approving the tokens for spend
      await this.testToken.mint(this.signers.alice.address, tokenSupply);
      await this.testToken.connect(this.signers.alice).approve(this.existingERC20DropCampaign.address, tokenSupply);

      // not sure how to mock funding the contract
      await expect(this.existingERC20DropCampaign.connect(this.signers.alice).fundAirdrop()).to.emit(
        this.existingERC20DropCampaign,
        "AirdropFunded",
      );

      await expect(this.existingERC20DropCampaign.connect(this.signers.backendWallet).unlockWithdraw()).to.emit(
        this.existingERC20DropCampaign,
        "WithdrawUnlocked",
      );

      expect(await this.testToken.balanceOf(this.signers.alice.address)).to.be.equal(constants.Zero);

      expect(await this.existingERC20DropCampaign.connect(this.signers.alice).withdrawAirdropFunds()).to.emit(
        this.existingERC20DropCampaign,
        "FundsWithdrawn",
      );

      // checking if funds were returned to airdrop funder
      expect(await this.testToken.balanceOf(this.signers.alice.address)).to.be.equal(tokenSupply);
    });
  });
}
