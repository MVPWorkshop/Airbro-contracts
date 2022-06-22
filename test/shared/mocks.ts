import { MockContract } from "ethereum-waffle";
import { Wallet } from "@ethersproject/wallet";
import { waffle } from "hardhat";
import TEST_TOKEN_ABI from "../../abis/TestToken.abi.json";

export async function deployMockTestToken(deployer:Wallet): Promise<MockContract>{
  const erc20: MockContract = await waffle.deployMockContract(deployer,TEST_TOKEN_ABI)
  
  await erc20.mock.decimals.returns(6);
  await erc20.mock.name.returns(`TestToken`);
  await erc20.mock.symbol.returns(`TTK`);
  await erc20.mock.transferFrom.returns(true);
  await erc20.mock.mint.returns(true);
  await erc20.mock._mint.returns(true);
  
  return erc20;
}