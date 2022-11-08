import { expect } from "chai";
import { constants } from "ethers";

export function NewSB1155DropCampaignShouldDeploy(): void {
  describe("should deploy", async function () {
    it("should return correct airdrop type", async function () {
      expect(await this.newSB1155DropCampaign.airdropType()).to.be.equal("SB1155");
    });

    it("should have merkleRoot set to 0x00", async function () {
      expect(await this.newSB1155DropCampaign.merkleRoot()).to.be.equal(
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      );
    });

    // this should also be an integration test
    it("should set airbroCampaignFactoryAddress to the airbroFactory address", async function () {
      expect(await this.newSB1155DropCampaign.airbroCampaignFactoryAddress()).to.be.equal(this.mocks.mockAirbroCampaignFactory.address);
    });

    it("should set uri properly", async function () {
      // _tokenId variable is private, but its value is 0 -> that is why constants.Zero is here
      expect(await this.newSB1155DropCampaign.uri(constants.Zero)).to.be.equal(this.constructorArgs.uri);
    });
  });
}
