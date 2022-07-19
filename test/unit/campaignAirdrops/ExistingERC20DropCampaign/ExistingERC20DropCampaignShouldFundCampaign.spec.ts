// not used anywhere
// not used anywhere
// not used anywhere
// not used anywhere

import { expect } from "chai";
import { ethers } from "ethers";

export function ExistingERC20DropCampaignShouldFundCampaign(): void {
  describe("should fund campaign", async function () {
    it("should revert if funder balance and approved amount is not that of tokenSupply", async function () {
      const tokenSupply: number = this.existingERC20DropCampaignArgs.tokenSupply; // 100

      //   funding with 0 balance and no approve
      await this.mocks.mockDAItoken.mock.balanceOf.withArgs(this.signers.alice.address).returns(0);
      await expect(this.existingERC20DropCampaign.connect(this.signers.alice).fundAirdrop()).to.be.revertedWith("InsufficientAmount");

      //   funding with correct balance but no approval that is not tokenSupply
      await this.mocks.mockDAItoken.mock.balanceOf.withArgs(this.signers.alice.address).returns(tokenSupply);
      await this.mocks.mockDAItoken.mock.allowance.withArgs(this.signers.alice.address, this.existingERC20DropCampaign.address).returns(0);
      await expect(this.existingERC20DropCampaign.connect(this.signers.alice).fundAirdrop()).to.be.revertedWith("InsufficientAmount");
    });

    // this does not work, cannot mock safeTransfer
    it.only("should fund contract", async function () {
      // const tokenSupply: number = this.existingERC20DropCampaignArgs.tokenSupply; // 100

      // //   funding with correct balance and correct approval
      // await this.mocks.mockDAItoken.mock.balanceOf.withArgs(this.signers.alice.address).returns(tokenSupply);
      // await this.mocks.mockDAItoken.mock.allowance
      //   .withArgs(this.signers.alice.address, this.existingERC20DropCampaign.address)
      //   .returns(tokenSupply);

      // //   this mock wont work. We use safeTransferFrom, which uses transferFrom - 'Mock on the method is not initialized'
      // await this.mocks.mockDAItoken.mock["transferFrom(address,address,uint256)"]
      //   .withArgs(this.signers.alice.address, this.signers.backendWallet.address, tokenSupply)
      //   .returns(true);

      const amt = ethers.utils.parseEther('100')

      await this.mocks.mockDAItoken.mint(this.signers.alice.address, amt)
      await this.mocks.mockDAItoken.connect(this.signers.alice).approve(this.existingERC20DropCampaign.address, amt)

      await expect(this.existingERC20DropCampaign.connect(this.signers.alice).fundAirdrop()).to.emit(
        this.existingERC20DropCampaign,
        "AirdropFunded",
      );
    });
  });
}
