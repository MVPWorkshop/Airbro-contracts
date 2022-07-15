import { Fixture, MockContract } from "ethereum-waffle";
import { ContractFactory } from "ethers";
import { ethers } from "hardhat";

import { AirbroFactory } from "../../src/types/contracts/AirbroFactory";
import { TestNftCollection } from "../../src/types/contracts/mocks/TestNftCollection";
import { TestToken } from "../../src/types/contracts/mocks/TestToken";
import { Wallet } from "@ethersproject/wallet";
import { Existing1155NftDrop } from "../../src/types/contracts/airdrops/Existing1155NftDrop";
import { ExistingTokenDrop } from "../../src/types/contracts/airdrops/ExistingTokenDrop";
import { TokenDrop } from "../../src/types/contracts/airdrops/TokenDrop";
import { AirBro1155NftMint } from "../../src/types/contracts/mocks/Airbro1155NftMint.sol/AirBro1155NftMint";
import { NewERC1155DropCampaign } from "../../src/types/contracts/campaignAirdrops/NewERC1155DropCampaign";

import { AirbroCampaignFactory } from "../../src/types/contracts/AirbroCampaignFactory";

import {
  unitExistingTokenDropFixtureArguments,
  unitTokenDropFixtureArguments,
  unitExisting1155NFTDropArguments,
  unitNewERC1155DropCampaignArguments,
} from "./constants";
import {
  deployMockAirBroFactory,
  deployMockAirbroCampaignFactory,
  deployMockBaycNft,
  deployMockDAItoken,
  deployMock1155Nft,
} from "./mocks";

// airbroCampaign fixture types

type UnitNewERC1155DropCampaignFixtureType = {
  newERC1155DropCampaign: NewERC1155DropCampaign;
  mockAirbroCampaignFactory: MockContract;
  newERC1155DropCampaignArgs: any;
};

type IntegrationCampaignFixtureType = {
  airbroCampaignFactory: AirbroCampaignFactory;
};

// airbro classic fixture types

type UnitExisting1155NFTDropFixtureType = {
  existing1155NftDrop: Existing1155NftDrop;
  mockAirBroFactory: MockContract;
  mock1155Nft: MockContract;
  mockBaycNft: MockContract;
  existing1155NFTDropConstructorArgs: any;
};

type UnitExistingTokenDropFixtureType = {
  existingTokenDrop: ExistingTokenDrop;
  existingTokenDropConstructorArgs: any;
  mockDAItoken: MockContract;
  mockBaycNft: MockContract;
};

type UnitTokenDropFixtureType = {
  tokenDrop: TokenDrop;
  mockAirBroFactory: MockContract;
  tokenDropConstructorArgs: any;
  mockBaycNft: MockContract;
};

type IntegrationFixtureType = {
  airbroFactory: AirbroFactory;
  testNftCollection: TestNftCollection;
  testToken: TestToken;
  airBro1155NftMint: AirBro1155NftMint;
};

// airbroCampaign

export const unitNewERC1155DropCampaignFixture: Fixture<UnitNewERC1155DropCampaignFixtureType> = async (signers: Wallet[]) => {
  const deployer: Wallet = signers[0];

  const mockAirbroCampaignFactory = await deployMockAirbroCampaignFactory(deployer);
  await mockAirbroCampaignFactory.deployed();

  const newERC1155DropCampaignFactory: ContractFactory = await ethers.getContractFactory(`NewERC1155DropCampaign`);

  const newERC1155DropCampaignArgs = await unitNewERC1155DropCampaignArguments(mockAirbroCampaignFactory.address);

  const newERC1155DropCampaign: NewERC1155DropCampaign = (await newERC1155DropCampaignFactory
    .connect(deployer)
    .deploy(...Object.values(newERC1155DropCampaignArgs))) as NewERC1155DropCampaign;

  return { mockAirbroCampaignFactory, newERC1155DropCampaign, newERC1155DropCampaignArgs };
};

export const integrationCampaignFixture: Fixture<IntegrationCampaignFixtureType> = async (signers: Wallet[]) => {
  const deployer: Wallet = signers[0];

  const airbroCampaignFactoryFactory: ContractFactory = await ethers.getContractFactory(`AirbroCampaignFactory`);

  const airbroCampaignFactory: AirbroCampaignFactory = (await airbroCampaignFactoryFactory
    .connect(deployer)
    .deploy()) as AirbroCampaignFactory;

  await airbroCampaignFactory.deployed();

  return { airbroCampaignFactory };
};

// airbro classic

export const unitExisting1155NFTDropFixture: Fixture<UnitExisting1155NFTDropFixtureType> = async (signers: Wallet[]) => {
  const deployer: Wallet = signers[0];

  const mockAirBroFactory = await deployMockAirBroFactory(deployer);
  await mockAirBroFactory.deployed();

  const mockBaycNft = await deployMockBaycNft(deployer);
  await mockBaycNft.deployed();

  const mock1155Nft = await deployMock1155Nft(deployer);
  await mock1155Nft.deployed();

  const existing1155NftDropFactory: ContractFactory = await ethers.getContractFactory(`Existing1155NftDrop`);

  const existing1155NFTDropConstructorArgs = await unitExisting1155NFTDropArguments(mockBaycNft.address, mock1155Nft.address);

  const existing1155NftDrop: Existing1155NftDrop = (await existing1155NftDropFactory
    .connect(deployer)
    .deploy(...Object.values(existing1155NFTDropConstructorArgs))) as Existing1155NftDrop;

  await existing1155NftDrop.deployed();

  return { existing1155NftDrop, mockAirBroFactory, mock1155Nft, mockBaycNft, existing1155NFTDropConstructorArgs };
};

export const unitExistingTokenDropFixture: Fixture<UnitExistingTokenDropFixtureType> = async (signers: Wallet[]) => {
  const deployer: Wallet = signers[0];

  const mockDAItoken = await deployMockDAItoken(deployer);
  const mockBaycNft = await deployMockBaycNft(deployer);

  await mockDAItoken.deployed();
  await mockBaycNft.deployed();

  const existingTokenDropFactory: ContractFactory = await ethers.getContractFactory(`ExistingTokenDrop`);

  const existingTokenDropConstructorArgs = await unitExistingTokenDropFixtureArguments(mockDAItoken.address, mockBaycNft.address);
  const existingTokenDrop: ExistingTokenDrop = (await existingTokenDropFactory
    .connect(deployer)
    .deploy(...Object.values(existingTokenDropConstructorArgs))) as ExistingTokenDrop;

  await existingTokenDrop.deployed();

  return { existingTokenDrop, existingTokenDropConstructorArgs, mockDAItoken, mockBaycNft };
};

export const unitTokenDropFixture: Fixture<UnitTokenDropFixtureType> = async (signers: Wallet[]) => {
  const deployer: Wallet = signers[0];

  const mockAirBroFactory = await deployMockAirBroFactory(deployer);
  const mockBaycNft = await deployMockBaycNft(deployer);

  await mockAirBroFactory.deployed();
  await mockBaycNft.deployed();

  const tokenDropFactory: ContractFactory = await ethers.getContractFactory(`TokenDrop`);

  const tokenDropConstructorArgs = await unitTokenDropFixtureArguments(mockBaycNft.address);
  const tokenDrop: TokenDrop = (await tokenDropFactory.connect(deployer).deploy(...Object.values(tokenDropConstructorArgs))) as TokenDrop;

  await tokenDrop.deployed();

  return { tokenDrop, mockAirBroFactory, tokenDropConstructorArgs, mockBaycNft };
};

export const integrationsFixture: Fixture<IntegrationFixtureType> = async (signers: Wallet[]) => {
  const deployer: Wallet = signers[0];

  const airbroFactoryFactory: ContractFactory = await ethers.getContractFactory(`AirbroFactory`);

  const airbroFactory: AirbroFactory = (await airbroFactoryFactory.connect(deployer).deploy()) as AirbroFactory;

  await airbroFactory.deployed();

  const testNftCollectionFactory: ContractFactory = await ethers.getContractFactory(`TestNftCollection`);

  const testNftCollection: TestNftCollection = (await testNftCollectionFactory.connect(deployer).deploy()) as TestNftCollection;

  await testNftCollection.deployed();

  const testTokenFactory: ContractFactory = await ethers.getContractFactory(`TestToken`);

  const testToken: TestToken = (await testTokenFactory.connect(deployer).deploy()) as TestToken;

  await testToken.deployed();

  const airBro1155NftMintFactory: ContractFactory = await ethers.getContractFactory(`AirBro1155NftMint`);

  const airBro1155NftMint: AirBro1155NftMint = (await airBro1155NftMintFactory.connect(deployer).deploy()) as AirBro1155NftMint;

  await airBro1155NftMint.deployed();

  return { airbroFactory, testNftCollection, testToken, airBro1155NftMint };
};
