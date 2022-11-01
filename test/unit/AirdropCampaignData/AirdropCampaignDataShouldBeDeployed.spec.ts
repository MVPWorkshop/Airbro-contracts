import { expect } from "chai";

export function AirdropCampaignDataShouldBeDeployed(): void {
  describe("should be deployed", async function () {
    it("should set admin to be the correct address", async function () {
      expect(await this.airdropCampaignData.airbroManager()).to.be.equal(this.signers.backendWallet.address);
    });
  });
}
