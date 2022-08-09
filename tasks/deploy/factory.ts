import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { AirbroCampaignFactory } from "../../src/types/contracts/AirbroCampaignFactory";
import { AirbroCampaignFactory__factory } from "../../src/types/factories/contracts/AirbroCampaignFactory__factory";

import { Signer } from "@ethersproject/abstract-signer";
import { isAddress } from "ethers/lib/utils";

task("deploy:AirbroCampaignFactory").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const BACKEND_WALLET_ADDRESS: string | undefined = process.env.BACKEND_WALLET_ADDRESS;
  if (BACKEND_WALLET_ADDRESS === undefined || BACKEND_WALLET_ADDRESS === "") {
    throw new Error("Please define the BACKEND_WALLET_ADDRESS in your .env file.");
  }
  const TREASURY_WALLET_ADDRESS: string | undefined = process.env.TREASURY_WALLET_ADDRESS;
  if (TREASURY_WALLET_ADDRESS === undefined || TREASURY_WALLET_ADDRESS === "") {
    throw new Error("Please define the TREASURY_WALLET_ADDRESS in your .env file.");
  }

  const accounts: Signer[] = await ethers.getSigners();
  console.log("Deployer address: " + (await accounts[0].getAddress()));
  console.log("Constuctor args: " + BACKEND_WALLET_ADDRESS);

  const AirbroCampaignFactoryFactory: AirbroCampaignFactory__factory = <AirbroCampaignFactory__factory>(
    await ethers.getContractFactory("AirbroCampaignFactory")
  );
  // for some reason TREASURY_WALLET_ADDRESS here is displayed as an error
  const AirbroCampaignFactory: AirbroCampaignFactory = <AirbroCampaignFactory>(
    await AirbroCampaignFactoryFactory.deploy(BACKEND_WALLET_ADDRESS, TREASURY_WALLET_ADDRESS)
  );
  await AirbroCampaignFactory.deployed();

  console.log("Airbro Campaign Factory deployed to: ", AirbroCampaignFactory.address);
});
