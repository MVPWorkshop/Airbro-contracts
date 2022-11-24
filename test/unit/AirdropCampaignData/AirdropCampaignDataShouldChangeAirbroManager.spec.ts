import { expect } from "chai";
import { Wallet } from "ethers";

export function AirdropCampaignDataShouldChangeAirbroManager(): void {
  describe("should change airbroManager", async function () {
    it("should be able to change airbroManager", async function () {
      const newAirbroManager: Wallet = this.signers.jerry;
      // changing airbro manager address in the airdropRegistry Contract
      await expect(
        this.airdropCampaignData.connect(this.signers.backendWallet).changeAirbroManager(newAirbroManager.address),
      )
        .to.emit(this.airdropCampaignData, `AirbroManagerChanged`)
        .withArgs(newAirbroManager.address);

      expect(await this.airdropCampaignData.airbroManager()).to.be.equal(newAirbroManager.address);
    });
    it("should revert when non manager or non owner address try to initialize manager change", async function () {
      const nonAirbroManager: Wallet = this.signers.jerry;
      await expect(
        this.airdropCampaignData.connect(nonAirbroManager).changeAirbroManager(this.signers.jerry.address),
      ).to.be.revertedWith(`NotOwnerOrAirbroManager`);
    });
  });
}
