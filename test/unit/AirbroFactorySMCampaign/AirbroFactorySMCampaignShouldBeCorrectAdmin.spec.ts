import { expect } from "chai";
import { contractAdminAddress } from "../../shared/constants";

export function AirbroFactorySMCampaignShouldBeCorrectAdmin(): void {
  it("should be correct admin address", async function () {
    expect(await this.airbroFactorySMCampaign.admin()).to.equal(contractAdminAddress);
  });
}
