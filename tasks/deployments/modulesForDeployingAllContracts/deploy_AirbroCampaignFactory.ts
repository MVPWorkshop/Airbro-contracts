import { HardhatEthersHelpers } from "@nomiclabs/hardhat-ethers/types";
import { AirbroCampaignFactory } from "../../../src/types/contracts/AirbroCampaignFactory";
import { AirbroCampaignFactory__factory } from "../../../src/types/factories/contracts/AirbroCampaignFactory__factory";

export async function deployAirbroCampaignFactory(
  this: { ethers: HardhatEthersHelpers },
  BACKEND_WALLET_ADDRESS: string,
  airdropRegistryAddress: string,
  BETA_WALLET_ADDRESS: string,
) {
  const AirbroCampaignFactoryFactory: AirbroCampaignFactory__factory = <AirbroCampaignFactory__factory>(
    await this.ethers.getContractFactory("AirbroCampaignFactory")
  );

  console.log("Deploying AirbroCampaignFactory...");
  console.log("Constuctor args: ");
  console.log({ BACKEND_WALLET_ADDRESS, airdropRegistryAddress, BETA_WALLET_ADDRESS });

  const airbroCampaignFactory: AirbroCampaignFactory = <AirbroCampaignFactory>(
    await AirbroCampaignFactoryFactory.deploy(BACKEND_WALLET_ADDRESS, airdropRegistryAddress, BETA_WALLET_ADDRESS)
  );

  console.log("Awaiting deployment confirmation...");
  await airbroCampaignFactory.deployed();

  console.log("AirbroCampaignFactory contract deployed to: ", airbroCampaignFactory.address);
  return airbroCampaignFactory;
}
