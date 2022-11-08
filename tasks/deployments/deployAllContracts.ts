import { task } from "hardhat/config";
import { Signer } from "@ethersproject/abstract-signer";
import { TaskArguments } from "hardhat/types";

// Contract types
import { AirdropRegistry } from "../../src/types/contracts/AirdropRegistry";
import { AirbroCampaignFactory } from "../../src/types/contracts/AirbroCampaignFactory";
import { AirdropCampaignData } from "../../src/types/contracts/AirdropCampaignData";

// methods for individual contract deployments
import { deployAirdrpRegistry } from "./campaignAirdrops/deploy_AirdropRegistry";
import { deployAirbroCampaignFactory } from "./campaignAirdrops/deploy_AirbroCampaignFactory";
import { deploy_upgradable_AirdropCampaignData } from "./campaignAirdrops/deploy_upgradable_AirdropCampaignData";

task("deploy").setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
  /* ---- necessary checks before all contracts can be deployed ---- */
  const REGISTRY_ADMIN_WALLET_ADDRESS: string | undefined = process.env.REGISTRY_ADMIN_WALLET_ADDRESS;
  if (REGISTRY_ADMIN_WALLET_ADDRESS === undefined || REGISTRY_ADMIN_WALLET_ADDRESS === "") {
    throw new Error("Please define the REGISTRY_ADMIN_WALLET_ADDRESS in your .env file.");
  }

  const TREASURY_WALLET_ADDRESS: string | undefined = process.env.TREASURY_WALLET_ADDRESS;
  if (TREASURY_WALLET_ADDRESS === undefined || TREASURY_WALLET_ADDRESS === "") {
    throw new Error("Please define the TREASURY_WALLET_ADDRESS in your .env file.");
  }

  const BACKEND_WALLET_ADDRESS: string | undefined = process.env.BACKEND_WALLET_ADDRESS;
  if (BACKEND_WALLET_ADDRESS === undefined || BACKEND_WALLET_ADDRESS === "") {
    throw new Error("Please define the BACKEND_WALLET_ADDRESS in your .env file.");
  }

  const BETA_WALLET_ADDRESS: string | undefined = process.env.BETA_WALLET_ADDRESS;
  if (BETA_WALLET_ADDRESS === undefined || BETA_WALLET_ADDRESS === "") {
    throw new Error("Please define the BETA_WALLET_ADDRESS in your .env file.");
  }

  const lineBreak = "-".repeat(process.stdout.columns);

  /* ---- Getting deployer account */
  const accounts: Signer[] = await ethers.getSigners();
  const DEPLOYER_ADDRESS = await accounts[0].getAddress();

  console.log("Deployer address: " + DEPLOYER_ADDRESS);

  /* ---- Performing deployments */
  /* ****************** 1. Deployment of Airdrop Registry ****************** */
  console.log("\n 1. AirdropRegistry");
  const airdropRegistry: AirdropRegistry = await deployAirdrpRegistry.apply({ ethers }, [
    REGISTRY_ADMIN_WALLET_ADDRESS,
    TREASURY_WALLET_ADDRESS,
  ]);

  /* ****************** 2. Deployment of AirbroCampaignFactory ****************** */
  console.log(lineBreak);
  console.log("\n 2. AirbroCampaignFactory");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const airbroCapaignFactory: AirbroCampaignFactory = await deployAirbroCampaignFactory.apply({ ethers }, [
    BACKEND_WALLET_ADDRESS,
    airdropRegistry.address,
    BETA_WALLET_ADDRESS,
  ]);

  /* ****************** 3. Deployment of AirdropCampaignData - now upgradable ****************** */
  console.log(lineBreak);
  console.log("\n 3. AirdropCampaignData");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const airdropCampaignData: AirdropCampaignData = await deploy_upgradable_AirdropCampaignData.apply({ ethers, upgrades }, [
    BACKEND_WALLET_ADDRESS,
  ]);
});
