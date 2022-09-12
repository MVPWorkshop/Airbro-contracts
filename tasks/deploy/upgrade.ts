import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

/**
 *
 *
 *
 * NOTE: Still have to test if this works.
 * Should work with the following script: yarn upgrade:AidropCampaignData --address [address_of_deployed_contract_here]
 *
 *
 *   */

task("upgrade:airdropCampaignData")
  .addParam("address", "Address of deployed AirdropCampaignData contract")
  .setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
    const airbroCampaignData_upgraded__factory = await ethers.getContractFactory("AirdropCampaignDataUpgrade");

    console.log("Upgrading AirdropCampaignData...");
    const upgraded = await upgrades.upgradeProxy(taskArguments.address, airbroCampaignData_upgraded__factory);

    console.log("Awaiting upgrade confirmation...");
    await upgraded.deployed();

    console.log(`AirdropCampaignData upgraded at ${upgraded.address}`); // or it is just taskAruguments.address ? Check if it is the same
  });
