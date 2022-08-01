// not used anywhere
// not used anywhere
// not used anywhere
// not used anywhere

import { expect } from "chai";
export function ExistingERC20DropCampaignShouldFundCampaign(): void {
  describe("should fund campaign", async function () {
    it("should revert if funder balance and approved amount is not that of tokenSupply", async function () {
      const tokenSupply: number = this.existingERC20DropCampaignArgs.tokenSupply; // 100

      //   funding with 0 balance and no approve
      await this.mocks.mockDAItoken.mock.balanceOf.withArgs(this.signers.alice.address).returns(0);
      await expect(this.existingERC20DropCampaign.connect(this.signers.alice).fundAirdrop()).to.be.revertedWith(
        "ERC20: insufficient allowance",
      );

      //   funding with correct balance but no approval that is not tokenSupply
      await this.mocks.mockDAItoken.mock.balanceOf.withArgs(this.signers.alice.address).returns(tokenSupply);
      await this.mocks.mockDAItoken.mock.allowance.withArgs(this.signers.alice.address, this.existingERC20DropCampaign.address).returns(0);
      await expect(this.existingERC20DropCampaign.connect(this.signers.alice).fundAirdrop()).to.be.revertedWith(
        "ERC20: insufficient allowance",
      );
    });
  });
}
