import { MockContract } from "ethereum-waffle";
import { Signer } from "ethers";
import { waffle } from "hardhat";
import AirBroFactory from "../../artifacts/contracts/AirbroFactory.sol/AirbroFactory.json";
import AirbroCampaignFactory from "../../artifacts/contracts/AirbroCampaignFactory.sol/AirbroCampaignFactory.json";

import ERC20 from "../../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json";
import ERC721 from "../../artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json";
import ERC1155 from "../../artifacts/@openzeppelin/contracts/token/ERC1155/ERC1155.sol/ERC1155.json";

import { contractAdminAddress, claimFee, treasuryAddress } from "./constants";

export async function deployMockAirBroFactory(deployer: Signer): Promise<MockContract> {
  const airBroFactory: MockContract = await waffle.deployMockContract(deployer, AirBroFactory.abi);

  return airBroFactory;
}

export async function deployMockAirbroCampaignFactory(deployer: Signer): Promise<MockContract> {
  const airbroCampaignFactory: MockContract = await waffle.deployMockContract(deployer, AirbroCampaignFactory.abi);

  await airbroCampaignFactory.mock.admin.returns(contractAdminAddress);
  await airbroCampaignFactory.mock.claimFee.returns(claimFee);
  await airbroCampaignFactory.mock.treasury.returns(treasuryAddress);

  return airbroCampaignFactory;
}

export async function deployMockDAItoken(deployer: Signer): Promise<MockContract> {
  const mockDAItoken: MockContract = await waffle.deployMockContract(deployer, ERC20.abi);

  await mockDAItoken.mock.name.returns("DAI token");
  await mockDAItoken.mock.symbol.returns("DAI");
  await mockDAItoken.mock.balanceOf.returns(2);

  return mockDAItoken;
}

export async function deployMockBaycNft(deployer: Signer): Promise<MockContract> {
  const mockBaycNft: MockContract = await waffle.deployMockContract(deployer, ERC721.abi);

  await mockBaycNft.mock.name.returns("Bored Ape Yacht Club");
  await mockBaycNft.mock.symbol.returns("BAYC");

  return mockBaycNft;
}

export async function deployMock1155Nft(deployer: Signer): Promise<MockContract> {
  const mock1155Nft: MockContract = await waffle.deployMockContract(deployer, ERC1155.abi);

  await mock1155Nft.mock.uri.returns("https://i.pinimg.com/originals/dc/88/53/dc885311515fd89c897ae815cabd27d4.jpg");

  return mock1155Nft;
}
