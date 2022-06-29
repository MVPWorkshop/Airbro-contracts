import { MockContract } from "ethereum-waffle";
import { Signer } from "ethers";
import { waffle } from "hardhat";
import AirBroFactory from "../../artifacts/contracts/AirbroFactory.sol/AirbroFactory.json"
import AirBroFactory1155Holder from "../../artifacts/contracts/AirbroFactory1155Holder.sol/AirbroFactory1155Holder.json"
import { contractAdminAddress } from "./constants";

export async function deployMockAirBroFactory(deployer: Signer): Promise<MockContract> {
  const airBroFactory: MockContract = await waffle.deployMockContract(deployer, AirBroFactory.abi);

  await airBroFactory.mock.admin.returns("0xF4b5bFB92dD4E6D529476bCab28A65bb6B32EFb3");

  return airBroFactory;
}

export async function deployMockAirBroFactory1155Holder(deployer: Signer): Promise<MockContract> {
  const airBroFactory1155Holder: MockContract = await waffle.deployMockContract(deployer, AirBroFactory1155Holder.abi);

  await airBroFactory1155Holder.mock.admin.returns("0xF4b5bFB92dD4E6D529476bCab28A65bb6B32EFb3");

  return airBroFactory1155Holder;
}