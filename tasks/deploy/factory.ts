import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { AirdropRegistry } from "../../src/types/contracts/AirdropRegistry";
import { AirdropRegistry__factory } from "../../src/types/factories/contracts/AirdropRegistry__factory";

import { AirbroCampaignFactory } from "../../src/types/contracts/AirbroCampaignFactory";
import { AirbroCampaignFactory__factory } from "../../src/types/factories/contracts/AirbroCampaignFactory__factory";

import { Signer } from "@ethersproject/abstract-signer";
import { isAddress } from "ethers/lib/utils";

task("deploy:AirbroCampaignFactory").setAction(async function (taskArguments: TaskArguments, { ethers }) {
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

  const accounts: Signer[] = await ethers.getSigners();

  console.log("Airdrop Registry:");

  console.log("Deployer address: " + (await accounts[0].getAddress()));
  console.log("Constuctor args: " + REGISTRY_ADMIN_WALLET_ADDRESS, TREASURY_WALLET_ADDRESS);

  const AirdropRegistryFactory: AirdropRegistry__factory = <AirdropRegistry__factory>await ethers.getContractFactory("AirdropRegistry");

  const airdropRegistry: AirdropRegistry = <AirdropRegistry>(
    await AirdropRegistryFactory.deploy(REGISTRY_ADMIN_WALLET_ADDRESS, TREASURY_WALLET_ADDRESS)
  );
  await airdropRegistry.deployed();

  console.log("Airdrop Registry deployed to: ", airdropRegistry.address);

  console.log("AirbroCampaignFactory:");

  console.log("Deployer address: " + (await accounts[0].getAddress()));
  console.log("Constuctor args: " + BACKEND_WALLET_ADDRESS, airdropRegistry.address);

  const AirbroCampaignFactoryFactory: AirbroCampaignFactory__factory = <AirbroCampaignFactory__factory>(
    await ethers.getContractFactory("AirbroCampaignFactory")
  );

  const airbroCampaignFactory: AirbroCampaignFactory = <AirbroCampaignFactory>(
    await AirbroCampaignFactoryFactory.deploy(BACKEND_WALLET_ADDRESS, airdropRegistry.address)
  );
  await airbroCampaignFactory.deployed();

  console.log("Airbro Campaign Factory deployed to: ", airbroCampaignFactory.address);
});
