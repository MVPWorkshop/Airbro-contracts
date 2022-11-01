import { HardhatEthersHelpers } from "@nomiclabs/hardhat-ethers/types";
import { AirdropRegistry } from "../../../src/types/contracts/AirdropRegistry";
import { AirdropRegistry__factory } from "../../../src/types/factories/contracts/AirdropRegistry__factory";

export async function deployAirdrpRegistry(
  this: { ethers: HardhatEthersHelpers },
  REGISTRY_ADMIN_WALLET_ADDRESS: string,
  TREASURY_WALLET_ADDRESS: string,
) {
  const AirdropRegistryFactory: AirdropRegistry__factory = <AirdropRegistry__factory>(
    await this.ethers.getContractFactory("AirdropRegistry")
  );

  console.log("Deploying AirdropRegistry...");
  console.log("Constuctor args: ");
  console.log({ REGISTRY_ADMIN_WALLET_ADDRESS, TREASURY_WALLET_ADDRESS });

  const airdropRegistry: AirdropRegistry = <AirdropRegistry>(
    await AirdropRegistryFactory.deploy(REGISTRY_ADMIN_WALLET_ADDRESS, TREASURY_WALLET_ADDRESS)
  );

  console.log("Awaiting deployment confirmation...");
  await airdropRegistry.deployed();

  console.log("AirdropRegistry contract deployed to: ", airdropRegistry.address);
  return airdropRegistry;
}
