import { expect } from "chai";

const randomAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

export function AirbroFactorySMCampaignShouldChangeAdminAddress(): void {
  it("should allow admin to change admin address", async function () {
    await this.airbroFactorySMCampaign.connect(this.signers.backendWallet).changeAdmin(randomAddress);
    expect(await this.airbroFactorySMCampaign.admin())
      .to.be.equal(randomAddress)
      .and.to.emit(this.airbroFactorySMCampaign, "AdminChanged")
      .withArgs(randomAddress);
  });

  it("should revert admin change from not admin address", async function () {
    await expect(
      this.airbroFactorySMCampaign.connect(this.signers.alice).changeAdmin(randomAddress),
    ).to.be.revertedWith("NotAdmin");
  });
}
