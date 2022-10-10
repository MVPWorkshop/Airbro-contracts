import { expect } from "chai";
import { randomAddress } from "../../shared/constants";

export function AirdropCampaignDataShouldChangeAdmin(): void {
  describe("should change admin", async function () {
    it("should allow backend to change admin", async function () {
      await expect(this.airdropCampaignData.connect(this.signers.backendWallet).changeAdmin(randomAddress))
        .to.emit(this.airdropCampaignData, "ContractAdminChanged")
        .withArgs(randomAddress);
    });
    it("should revert admin change from address that is not the bakckend wallet address", async function () {
      await expect(this.airdropCampaignData.connect(this.signers.alice).changeAdmin(randomAddress)).to.be.revertedWith("NotAdmin");
    });
  });
}
