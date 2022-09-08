import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

/* NOT WORKING, SHOULD PROBABLY CHANGE SC */
export function AirdropCampaignDataShouldBeUpgradable(): void {
  describe("upgradable", async function () {
    it("should be upgradable", async function () {
      const airbroCampaignData_upgraded__factory = await ethers.getContractFactory("AirdropCampaignDataUpgrade");
      const upgraded = await upgrades.upgradeProxy(this.airdropCampaignData.address, airbroCampaignData_upgraded__factory);
      await upgraded.deployed();

      expect(await upgraded.getUpgradedValue()).to.be.equal("test_text");
    });
  });
}
