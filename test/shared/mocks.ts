import { MockContract } from "ethereum-waffle";
import { ethers, Signer } from "ethers";
import { waffle } from "hardhat";
import AirBroFactory from "../../artifacts/contracts/AirbroFactory.sol/AirbroFactory.json";
import AirBroFactorySMCampaign from "../../artifacts/contracts/AirbroFactorySMCampaign.sol/AirbroFactorySMCampaign.json";
import ERC20 from "../../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json";
import { contractAdminAddress } from "./constants";

export async function deployMockAirBroFactory(deployer: Signer): Promise<MockContract> {
  const airBroFactory: MockContract = await waffle.deployMockContract(deployer, AirBroFactory.abi);

  // await airBroFactory.mock.admin.returns(contractAdminAddress); // admin variable has been removed

  return airBroFactory;
}

export async function deployMockAirBroFactorySMCampaign(deployer: Signer): Promise<MockContract> {
  const airBroFactorySMCampaign: MockContract = await waffle.deployMockContract(deployer, AirBroFactorySMCampaign.abi);

  await airBroFactorySMCampaign.mock.admin.returns(contractAdminAddress);

  return airBroFactorySMCampaign;
}

export async function deployMockDAItoken(deployer: Signer): Promise<MockContract> {
  const mockDAItoken: MockContract = await waffle.deployMockContract(deployer, ERC20.abi);

  await mockDAItoken.mock.name.returns("DAI token");
  await mockDAItoken.mock.symbol.returns("DAI");
  await mockDAItoken.mock.balanceOf.returns(2);

  return mockDAItoken;
}
