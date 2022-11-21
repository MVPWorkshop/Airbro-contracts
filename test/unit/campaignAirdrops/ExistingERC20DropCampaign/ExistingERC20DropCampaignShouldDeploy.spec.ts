import { expect } from "chai";

export function ExistingERC20DropCampaignShouldDeploy(): void {
  describe("should deploy", async function () {
    it("should display correct airdrop type", async function () {
      expect(await this.existingERC20DropCampaign.airdropType()).to.be.equal("ERC20");
    });

    // if merkleRoot is 0x00 by default, no one can just add an empty array [] as a merkleProof and claim the rewards right?
    it("should have merkleRoot set to 0x00", async function () {
      expect(await this.existingERC20DropCampaign.merkleRoot()).to.be.equal(
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      );
    });

    // this should be an integration test
    it("should set airbroCampaignFactoryAddress to the airbroFactory address", async function () {
      expect(await this.existingERC20DropCampaign.airbroCampaignFactory()).to.be.equal(
        this.mocks.mockAirbroCampaignFactory.address,
      );
    });
  });
}
