import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { AirdropRegistry } from "../../src/types/contracts/AirdropRegistry";
import { AirdropRegistry__factory } from "../../src/types/factories/contracts/AirdropRegistry__factory";

import { AirbroCampaignFactory } from "../../src/types/contracts/AirbroCampaignFactory";
import { AirbroCampaignFactory__factory } from "../../src/types/factories/contracts/AirbroCampaignFactory__factory";

import { AirdropCampaignData } from "../../src/types/contracts/AirdropCampaignData";
import { AirdropCampaignData__factory } from "../../src/types/factories/contracts/AirdropCampaignData__factory";

import { Signer } from "@ethersproject/abstract-signer";

task("deploy").setAction(async function (taskArguments: TaskArguments, { ethers }) {
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
  const DEPLOYER_ADDRESS = await accounts[0].getAddress();

  /* Deployment of Airdrop Registry */
  console.log("| -- 1. Airdrop Registry -- |");
  console.log("Deployer address: " + DEPLOYER_ADDRESS);
  console.log("Constuctor args: " + REGISTRY_ADMIN_WALLET_ADDRESS, TREASURY_WALLET_ADDRESS);

  const AirdropRegistryFactory: AirdropRegistry__factory = <AirdropRegistry__factory>await ethers.getContractFactory("AirdropRegistry");

  console.log("Deploying AirdropRegistry...");
  const airdropRegistry: AirdropRegistry = <AirdropRegistry>(
    await AirdropRegistryFactory.deploy(REGISTRY_ADMIN_WALLET_ADDRESS, TREASURY_WALLET_ADDRESS)
  );

  console.log("Awaiting deployment confirmation...");
  await airdropRegistry.deployed();

  // deploy blueprints
  // const existingerc20blueprint = await ethers.getContractFactory("ExistingERC20DropCampaign");
  // let tx = await existingerc20blueprint.deploy();
  // await tx.deployed();
  // const existingAdress = tx.address;
  // console.log("ExistingERC20DropCampaign: ", tx.address);

  // const new1155 = await ethers.getContractFactory("NewERC1155DropCampaign");
  // tx = await new1155.deploy();
  // await tx.deployed();
  // const new1155address = tx.address;
  // console.log("NewERC1155DropCampaign: ", tx.address);

  // const newsb = await ethers.getContractFactory("NewSB1155DropCampaign");
  // tx = await newsb.deploy();
  // await tx.deployed();
  // const sbaddress = tx.address;
  // console.log("NewSB1155DropCampaign: ", tx.address);

  console.log("Airdrop Registry deployed to: ", airdropRegistry.address);

  /* Deployment of AirbroCampaignFactory */
  console.log("| -- --------------------- -- |");
  console.log("| -- 2. AirbroCampaignFactory -- |");
  console.log("Deployer address: " + DEPLOYER_ADDRESS);
  console.log("Constuctor args: " + BACKEND_WALLET_ADDRESS, airdropRegistry.address);

  const AirbroCampaignFactoryFactory: AirbroCampaignFactory__factory = <AirbroCampaignFactory__factory>(
    await ethers.getContractFactory("AirbroCampaignFactory")
  );

  console.log("Deploying AirbroCampaignFactory...");
  const airbroCampaignFactory: AirbroCampaignFactory = <AirbroCampaignFactory>(
    await AirbroCampaignFactoryFactory.deploy(BACKEND_WALLET_ADDRESS, airdropRegistry.address)
  );
  // , existingAdress, new1155address, sbaddress

  console.log("Awaiting deployment confirmation...");
  await airbroCampaignFactory.deployed();

  console.log("Airbro Campaign Factory deployed to: ", airbroCampaignFactory.address);
  console.log("| -- --------------------- -- |");

  /* Deployment of AirdropCampaignData */
  console.log("| -- --------------------- -- |");
  console.log("| -- 3. AirdropCampaignData -- |");
  console.log("Deployer address: " + DEPLOYER_ADDRESS);
  console.log("Constuctor args: " + BACKEND_WALLET_ADDRESS);

  const AirdropCampaignDataFactory: AirdropCampaignData__factory = <AirdropCampaignData__factory>(
    await ethers.getContractFactory("AirdropCampaignData")
  );

  console.log("Deploying AirdropCampaignData...");
  const airdropCampaignData: AirdropCampaignData = <AirdropCampaignData>await AirdropCampaignDataFactory.deploy(BACKEND_WALLET_ADDRESS);

  console.log("Awaiting deployment confirmation...");
  await airdropCampaignData.deployed();

  console.log("Airdrop Campaign Data Contract deployed to: ", airdropCampaignData.address);
  console.log("| -- --------------------- -- |");
});
