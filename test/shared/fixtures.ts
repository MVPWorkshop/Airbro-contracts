import { Fixture, MockContract } from "ethereum-waffle";
import { ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { Wallet } from "@ethersproject/wallet";

import { TestNftCollection } from "../../src/types/contracts/mocks/TestNftCollection";
import { TestToken } from "../../src/types/contracts/mocks/TestToken";
import { AirBro1155NftMint } from "../../src/types/contracts/mocks/Airbro1155NftMint.sol/AirBro1155NftMint";

import { AirdropRegistry } from "../../src/types/contracts/AirdropRegistry";
import { AirbroFactory } from "../../src/types/contracts/AirbroFactory";
import { Existing1155NftDrop } from "../../src/types/contracts/airdrops/Existing1155NftDrop";
import { ExistingTokenDrop } from "../../src/types/contracts/airdrops/ExistingTokenDrop";
import { TokenDrop } from "../../src/types/contracts/airdrops/TokenDrop";

import { NewERC1155DropCampaign } from "../../src/types/contracts/campaignAirdrops/NewERC1155DropCampaign";
import { NewSB1155DropCampaign } from "../../src/types/contracts/campaignAirdrops/NewSB1155DropCampaign";
import { ExistingERC20DropCampaign } from "../../src/types/contracts/campaignAirdrops/ExistingERC20DropCampaign";

import { AirbroCampaignFactory } from "../../src/types/contracts/AirbroCampaignFactory";
import { AirdropCampaignData } from "../../src/types/contracts/AirdropCampaignData";

import { TestNewERC1155DropCampaign } from "../../src/types/contracts/mocks/TestNewERC1155DropCampaign";
import { TestNewSB1155DropCampaign } from "../../src/types/contracts/mocks/TestNewSB1155DropCampaign";
import { TestExistingERC20DropCampaign } from "../../src/types/contracts/mocks/TestExistingERC20DropCampaign";

import {
  unitExistingTokenDropFixtureArguments,
  unitTokenDropFixtureArguments,
  unitExisting1155NFTDropArguments,
  unitNewERC1155DropCampaignArguments,
  unitNewSB1155DropCampaignArguments,
  UnitExistingERC20DropCampaignArgs,
  treasuryAddress,
  uri,
  name,
  symbol,
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
  newERC1155DropCampaign: TestNewERC1155DropCampaign;
  mockAirbroCampaignFactory: MockContract;
  newERC1155DropCampaignArgs: any;
};

type UnitNewSB1155DropCampaignFixtureType = {
  newSB1155DropCampaign: TestNewSB1155DropCampaign;
  mockAirbroCampaignFactory: MockContract;
  newSB1155DropCampaignArgs: any;
};

type UnitExistingERC20DropCampaignFixtureType = {
  mockAirbroCampaignFactory: MockContract;
  mockDAItoken: MockContract;
  ExistingERC20DropCampaign: TestExistingERC20DropCampaign;
  existingERC20DropCampaignArgs: any;
};

type IntegrationCampaignFixtureType = {
  airdropRegistry: AirdropRegistry;
  airbroCampaignFactory: AirbroCampaignFactory;
  newERC1155DropCampaign: TestNewERC1155DropCampaign;
  newERC1155DropCampaignArgs: any;
  newSB1155DropCampaign: TestNewERC1155DropCampaign;
  newSB1155DropCampaignArgs: any;
  existingERC20DropCampaign: TestExistingERC20DropCampaign;
  existingERC20DropCampaignArgs: any;
  testToken: TestToken;
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

type AirdropCampaignDataFixtureType = {
  airdropCampaignData: AirdropCampaignData;
};

// airbroCampaign

export const unitNewERC1155DropCampaignFixture: Fixture<UnitNewERC1155DropCampaignFixtureType> = async (signers: Wallet[]) => {
  const deployer: Wallet = signers[0];

  const mockAirbroCampaignFactory = await deployMockAirbroCampaignFactory(deployer);
  await mockAirbroCampaignFactory.deployed();

  const newERC1155DropCampaignFactory: ContractFactory = await ethers.getContractFactory(`TestNewERC1155DropCampaign`);

  const newERC1155DropCampaignArgs = await unitNewERC1155DropCampaignArguments(mockAirbroCampaignFactory.address);

  const newERC1155DropCampaign: TestNewERC1155DropCampaign = (await newERC1155DropCampaignFactory
    .connect(deployer)
    .deploy()) as TestNewERC1155DropCampaign;
  // ...Object.values(newERC1155DropCampaignArgs)
  await newERC1155DropCampaign.initialize(name, symbol, uri);
  await newERC1155DropCampaign.changeAirbroCampaignAddress(mockAirbroCampaignFactory.address);
  // , mockAirbroCampaignFactory.address

  return { mockAirbroCampaignFactory, newERC1155DropCampaign, newERC1155DropCampaignArgs };
};

export const unitNewSB1155DropCampaignFixture: Fixture<UnitNewSB1155DropCampaignFixtureType> = async (signers: Wallet[]) => {
  const deployer: Wallet = signers[0];

  const mockAirbroCampaignFactory = await deployMockAirbroCampaignFactory(deployer);
  await mockAirbroCampaignFactory.deployed();

  const newSB1155DropCampaignFactory: ContractFactory = await ethers.getContractFactory(`TestNewSB1155DropCampaign`);

  const newSB1155DropCampaignArgs = await unitNewSB1155DropCampaignArguments(mockAirbroCampaignFactory.address);

  const newSB1155DropCampaign: TestNewSB1155DropCampaign = (await newSB1155DropCampaignFactory
    .connect(deployer)
    .deploy()) as TestNewSB1155DropCampaign;
  // ...Object.values(newSB1155DropCampaignArgs)
  await newSB1155DropCampaign.initialize(name, symbol, uri);
  await newSB1155DropCampaign.changeAirbroCampaignAddress(mockAirbroCampaignFactory.address);

  // , mockAirbroCampaignFactory.address

  return { mockAirbroCampaignFactory, newSB1155DropCampaign, newSB1155DropCampaignArgs };
};

export const unitExistingERC20DropCampaignFixture: Fixture<UnitExistingERC20DropCampaignFixtureType> = async (signers: Wallet[]) => {
  const deployer: Wallet = signers[0];

  const mockAirbroCampaignFactory = await deployMockAirbroCampaignFactory(deployer);
  await mockAirbroCampaignFactory.deployed();

  const mockDAItoken = await deployMockDAItoken(deployer);
  await mockDAItoken.deployed();

  const existingERC20DropCampaignArgs = await UnitExistingERC20DropCampaignArgs(mockDAItoken.address, mockAirbroCampaignFactory.address);

  const ExistingERC20DropCampaignFactory: ContractFactory = await ethers.getContractFactory("TestExistingERC20DropCampaign");

  const ExistingERC20DropCampaign: TestExistingERC20DropCampaign = (await ExistingERC20DropCampaignFactory.connect(
    deployer,
  ).deploy()) as TestExistingERC20DropCampaign;

  await ExistingERC20DropCampaign.deployed();
  // ...Object.values(existingERC20DropCampaignArgs)
  await ExistingERC20DropCampaign.initialize(mockDAItoken.address, 100);
  await ExistingERC20DropCampaign.changeAirbroCampaignAddress(mockAirbroCampaignFactory.address);
  // , mockAirbroCampaignFactory.address

  return { mockAirbroCampaignFactory, mockDAItoken, ExistingERC20DropCampaign, existingERC20DropCampaignArgs };
};

export const integrationCampaignFixture: Fixture<IntegrationCampaignFixtureType> = async (signers: Wallet[]) => {
  const deployer: Wallet = signers[0];

  const airdropRegistryFactory: ContractFactory = await ethers.getContractFactory(`AirdropRegistry`);

  const airdropRegistry: AirdropRegistry = (await airdropRegistryFactory
    .connect(deployer)
    .deploy(process.env.REGISTRY_ADMIN_WALLET_ADDRESS, treasuryAddress)) as AirdropRegistry;

  await airdropRegistry.deployed();

  const airbroCampaignFactoryFactory: ContractFactory = await ethers.getContractFactory(`AirbroCampaignFactory`);

  const airbroCampaignFactory: AirbroCampaignFactory = (await airbroCampaignFactoryFactory
    .connect(deployer)
    .deploy(process.env.BACKEND_WALLET_ADDRESS, airdropRegistry.address, process.env.BETA_WALLET_ADDRESS)) as AirbroCampaignFactory;

  await airbroCampaignFactory.deployed();

  const newERC1155DropCampaignFactory: ContractFactory = await ethers.getContractFactory(`TestNewERC1155DropCampaign`);

  const newERC1155DropCampaignArgs = await unitNewERC1155DropCampaignArguments(airbroCampaignFactory.address);

  const newERC1155DropCampaign: TestNewERC1155DropCampaign = (await newERC1155DropCampaignFactory
    .connect(deployer)
    .deploy()) as TestNewERC1155DropCampaign;

  await newERC1155DropCampaign.deployed();
  // ...Object.values(newERC1155DropCampaignArgs)
  await newERC1155DropCampaign.initialize(name, symbol, uri);
  await newERC1155DropCampaign.changeAirbroCampaignAddress(airbroCampaignFactory.address);
  // , airbroCampaignFactory.address

  const newSB1155DropCampaignFactory: ContractFactory = await ethers.getContractFactory(`TestNewSB1155DropCampaign`);

  const newSB1155DropCampaignArgs = await unitNewSB1155DropCampaignArguments(airbroCampaignFactory.address);

  const newSB1155DropCampaign: TestNewSB1155DropCampaign = (await newSB1155DropCampaignFactory
    .connect(deployer)
    .deploy()) as TestNewSB1155DropCampaign;

  await newSB1155DropCampaign.deployed();
  // ...Object.values(newSB1155DropCampaignArgs)
  await newSB1155DropCampaign.initialize(name, symbol, uri);
  await newSB1155DropCampaign.changeAirbroCampaignAddress(airbroCampaignFactory.address);
  // , airbroCampaignFactory.address

  const testTokenFactory: ContractFactory = await ethers.getContractFactory(`TestToken`);

  const testToken: TestToken = (await testTokenFactory.connect(deployer).deploy()) as TestToken;

  await testToken.deployed();

  const existingERC20DropCampaignArgs = await UnitExistingERC20DropCampaignArgs(testToken.address, airbroCampaignFactory.address);

  const existingERC20DropCampaignFactory: ContractFactory = await ethers.getContractFactory("TestExistingERC20DropCampaign");

  const existingERC20DropCampaign: TestExistingERC20DropCampaign = (await existingERC20DropCampaignFactory
    .connect(deployer)
    .deploy()) as TestExistingERC20DropCampaign;

  await existingERC20DropCampaign.deployed();
  // ...Object.values(existingERC20DropCampaignArgs)
  await existingERC20DropCampaign.initialize(testToken.address, 100);
  await existingERC20DropCampaign.changeAirbroCampaignAddress(airbroCampaignFactory.address);

  return {
    airdropRegistry,
    airbroCampaignFactory,
    newERC1155DropCampaign,
    newERC1155DropCampaignArgs,
    newSB1155DropCampaign,
    newSB1155DropCampaignArgs,
    existingERC20DropCampaign,
    existingERC20DropCampaignArgs,
    testToken,
  };
};

// airbro classic ---------------------------------------------------------------------------------------------------------------------

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

export const airdropCampaignDataFixture: Fixture<AirdropCampaignDataFixtureType> = async (signers: Wallet[]) => {
  const deployer: Wallet = signers[0];

  const airdropCampaignDataFactory = await ethers.getContractFactory("AirdropCampaignData");

  const airdropCampaignData = (await airdropCampaignDataFactory
    .connect(deployer)
    .deploy(process.env.BACKEND_WALLET_ADDRESS)) as AirdropCampaignData;

  await airdropCampaignData.deployed();

  return { airdropCampaignData };
};
