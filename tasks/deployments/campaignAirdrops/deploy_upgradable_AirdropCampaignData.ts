import { HardhatEthersHelpers } from "@nomiclabs/hardhat-ethers/types";
import { HardhatUpgrades } from "@openzeppelin/hardhat-upgrades";

import { AirdropCampaignData } from "../../../src/types/contracts/AirdropCampaignData";
import { AirdropCampaignData__factory } from "../../../src/types/factories/contracts/AirdropCampaignData__factory";

export async function deploy_upgradable_AirdropCampaignData(
  this: { ethers: HardhatEthersHelpers; upgrades: HardhatUpgrades },
  BACKEND_WALLET_ADDRESS: string,
) {
  const airdropCampaignDataFactory: AirdropCampaignData__factory = <AirdropCampaignData__factory>(
    await this.ethers.getContractFactory("AirdropCampaignData")
  );

  console.log("Deploying AirdropCampaignData...");
  console.log("Constuctor args: ");
  console.log({ BACKEND_WALLET_ADDRESS });

  const airdropCampaignData: AirdropCampaignData = <AirdropCampaignData>(
    await this.upgrades.deployProxy(airdropCampaignDataFactory, [BACKEND_WALLET_ADDRESS])
  );

  console.log("Awaiting deployment confirmation...");
  await airdropCampaignData.deployed();

  console.log("AirdropCampaignData contract deployed to: ", airdropCampaignData.address);
  return airdropCampaignData;
}
