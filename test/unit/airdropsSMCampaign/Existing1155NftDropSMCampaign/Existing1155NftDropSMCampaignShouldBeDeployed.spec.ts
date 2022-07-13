import { expect } from "chai";
import { ethers } from "hardhat";

const dayInSeconds: number = 86400;
const airdropDuration: number = 2;

export const Existing1155NftDropSMCampaignShouldDeploy = (): void => {
  describe("should deploy", async function () {
    it("should return correct airdrop type", async function () {
      expect(await this.existing1155NFTDropSMCampaign.airdropType()).to.be.equal("ERC1155");
    });

    it("should have merkleRoot set to 0x00", async function () {
      expect(await this.existing1155NFTDropSMCampaign.merkleRoot()).to.be.equal(
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      );
    });

    it("should set airBroFactoryAddress to the airbroFactory address", async function () {
      expect(await this.existing1155NFTDropSMCampaign.airBroFactoryAddress()).to.be.equal(this.mocks.mockAirBroFactorySMCampaign.address);
    });
  });
};
