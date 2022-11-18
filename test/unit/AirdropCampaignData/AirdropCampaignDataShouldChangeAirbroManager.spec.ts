import { expect } from "chai";
import { randomAddress } from "../../shared/constants";

export function AirdropCampaignDataShouldChangeAirbroManager(): void {
  describe("should change airbroManager", async function () {
    it("should allow backend to change airbroManager", async function () {
      await expect(this.airdropCampaignData.connect(this.signers.backendWallet).changeAdmin(randomAddress))
        .to.emit(this.airdropCampaignData, "AirbroManagerChanged")
        .withArgs(randomAddress);
    });
    it("should revert airbroManager change from address that is not the bakckend wallet address", async function () {
      await expect(this.airdropCampaignData.connect(this.signers.alice).changeAdmin(randomAddress)).to.be.revertedWith("NotAirbroManager");
    });
  });
}
