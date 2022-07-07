import { MockContract } from "ethereum-waffle";
import { ethers, Signer } from "ethers";
import { waffle } from "hardhat";
import AirBroFactory from "../../artifacts/contracts/AirbroFactory.sol/AirbroFactory.json"
import AirBroFactory1155Holder from "../../artifacts/contracts/AirbroFactory1155Holder.sol/AirbroFactory1155Holder.json"
import ERC20 from "../../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json"
import { contractAdminAddress } from "./constants";

export async function deployMockAirBroFactory(deployer: Signer): Promise<MockContract> {
  const airBroFactory: MockContract = await waffle.deployMockContract(deployer, AirBroFactory.abi);

  await airBroFactory.mock.admin.returns(contractAdminAddress);

  return airBroFactory;
}

export async function deployMockAirBroFactory1155Holder(deployer: Signer): Promise<MockContract> {
  const airBroFactory1155Holder: MockContract = await waffle.deployMockContract(deployer, AirBroFactory1155Holder.abi);

  await airBroFactory1155Holder.mock.admin.returns(contractAdminAddress);

  return airBroFactory1155Holder;
}

export async function deployMockDAItoken(deployer:Signer): Promise<MockContract> {
  const mockDAItoken: MockContract = await waffle.deployMockContract(deployer, ERC20.abi);
  
  await mockDAItoken.mock.name.returns("DAI token");
  await mockDAItoken.mock.symbol.returns("DAI");
  await mockDAItoken.mock.balanceOf.returns(ethers.utils.parseEther("1000")); //so this contract will have 1000 units of something
  
  return mockDAItoken;

}