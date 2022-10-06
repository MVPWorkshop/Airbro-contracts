import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

// Transparent upgrade proxy - DEPRECATED
task("upgrade:airdropCampaignData")
  .addParam("address", "Address of deployed AirdropCampaignData contract")
  .setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
    if (!ethers.utils.isAddress(taskArguments.address)) {
      throw new Error("Invalid address. Please enter the address for the deployed AirdropCapaignData contract.");
    }

    const airbroCampaignData_upgraded__factory = await ethers.getContractFactory("AirdropCampaignDataUpgrade");

    console.log("Upgrading AirdropCampaignData...");

    const upgraded = await upgrades.upgradeProxy(taskArguments.address, airbroCampaignData_upgraded__factory);

    console.log("Awaiting upgrade confirmation...");
    await upgraded.deployed();

    console.log(`AirdropCampaignData upgraded at ${taskArguments.address}`);
  });
