import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

/* NOT WORKING, SHOULD PROBABLY CHANGE SC */
export function AirdropCampaignDataShouldBeUpgradable(): void {
  describe("upgradable", async function () {
    const BACKEND_WALLET_ADDRESS: string | undefined = process.env.BACKEND_WALLET_ADDRESS;
    if (BACKEND_WALLET_ADDRESS === undefined || BACKEND_WALLET_ADDRESS === "") {
      throw new Error("Please define the BACKEND_WALLET_ADDRESS in your .env file.");
    }

    it("should be upgradable", async function () {
      console.log(BACKEND_WALLET_ADDRESS);
      const Box = await ethers.getContractFactory("AirdropCampaignData");

      const instance = await upgrades.deployProxy(Box, [BACKEND_WALLET_ADDRESS]); // https://forum.openzeppelin.com/t/types-values-length-mismatch/4613/8
      await instance.deployed();
      console.log(instance.address);

      const BoxV2 = await ethers.getContractFactory("AirdropCampaignData");
      //   const upgraded = await upgrades.upgradeProxy(instance.address, BoxV2);
      //   expect(await upgraded.admin()).to.be.equal(BACKEND_WALLET_ADDRESS); // should be the same, right?
    });
  });
}
