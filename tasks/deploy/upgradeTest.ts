// scripts/deploy_upgradeable_box.js
import { ethers, upgrades } from "hardhat";

/* STILL HAVE TO TEST IF THIS WORKS */
async function main() {
  const AirdropCampaignDataFactory = await ethers.getContractFactory("AirdropCampaignData");
  console.log("Deploying AirdropCampaignData...");
  const AirdropCampaignData = await upgrades.deployProxy(AirdropCampaignDataFactory, [42], { initializer: "store" });
  await AirdropCampaignData.deployed();
  console.log("AirdropCampaignData deployed to:", AirdropCampaignData.address);
  console.log("main");
}

/* ALSO, IMPLEMENT ALL OF THIS AS A TASK WITH setTask. So deloy of upgradable, and upgrade of upgradable. */

main();
