import { expect } from "chai";
import { ethers } from "hardhat";
import { constants } from "ethers";

export function NewERC1155DropCampaignShouldDeploy(): void {
  describe("should deploy", async function () {
    it("should return correct airdrop type", async function () {
      expect(await this.newERC1155DropCampaign.airdropType()).to.be.equal("ERC1155");
    });
    // if merkleRoot is 0x00 by default, no one can just add an empty array [] as a merkleProof and claim the rewards right?
    it("should have merkleRoot set to 0x00", async function () {
      expect(await this.newERC1155DropCampaign.merkleRoot()).to.be.equal(
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      );
    });

    // this should be an integration test
    it("should set airBroFactoryAddress to the airbroFactory address", async function () {
      expect(await this.newERC1155DropCampaign.airbroCampaignFactoryAddress()).to.be.equal(this.mocks.mockAirbroCampaignFactory.address);
    });

    it("should set uri properly", async function () {
      // _tokenId variable is private, but its value is 0 -> that is why constants.Zero is here
      expect(await this.newERC1155DropCampaign.uri(constants.Zero)).to.be.equal(this.constructorArgs.uri);
    });
  });
}
