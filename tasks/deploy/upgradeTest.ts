import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

/* STILL HAVE TO TEST IF THIS WORKS */
task("deploy:upgradable").setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
  const BACKEND_WALLET_ADDRESS: string | undefined = process.env.BACKEND_WALLET_ADDRESS;
  if (BACKEND_WALLET_ADDRESS === undefined || BACKEND_WALLET_ADDRESS === "") {
    throw new Error("Please define the BACKEND_WALLET_ADDRESS in your .env file.");
  }

  const airdropCampaignDataFactory = await ethers.getContractFactory("AirdropCampaignData");

  console.log("Deploying AirdropCampaignData...");
  const airdropCampaignData = await upgrades.deployProxy(airdropCampaignDataFactory, [BACKEND_WALLET_ADDRESS]);
  await airdropCampaignData.deployed();

  console.log("airdropCampaignData deployed to:", airdropCampaignData.address);
});
