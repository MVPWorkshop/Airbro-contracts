import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

/**
 *
 *
 *
 * NOTE: Still have to write script to upgrade the AirdropCampaignData contract
 *
 *
 *
 *   */

/* task("deploy:upgradable").setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
  const BACKEND_WALLET_ADDRESS: string | undefined = process.env.BACKEND_WALLET_ADDRESS;
  if (BACKEND_WALLET_ADDRESS === undefined || BACKEND_WALLET_ADDRESS === "") {
    throw new Error("Please define the BACKEND_WALLET_ADDRESS in your .env file.");
  }

  const AirdropCampaignDataFactory = await ethers.getContractFactory("AirdropCampaignData");

  console.log("Deploying AirdropCampaignData...");
  const AirdropCampaignData = await upgrades.deployProxy(AirdropCampaignDataFactory, [BACKEND_WALLET_ADDRESS]);
  await AirdropCampaignData.deployed();

  console.log("AirdropCampaignData deployed to:", AirdropCampaignData.address);
}); */
