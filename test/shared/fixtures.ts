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
import { ItemNFTDrop } from "../../src/types/contracts/airdrops/ItemNFTDrop";
import { NFTDrop } from "../../src/types/contracts/airdrops/NFTDrop";
import { AirBro1155NftMint } from "../../src/types/contracts/mocks/Airbro1155NftMint.sol/AirBro1155NftMint";

import { AirbroFactorySMCampaign } from "../../src/types/contracts/AirbroFactorySMCampaign";
import { Existing1155NftDropSMCampaign } from "../../src/types/contracts/airdropsSMCampaign/Existing1155NftDropSMCampaign";
import { ExistingTokenDropSMCampaign } from "../../src/types/contracts/airdropsSMCampaign/ExistingTokenDropSMCampaign";
import { TokenDropSMCampaign } from "../../src/types/contracts/airdropsSMCampaign/TokenDropSMCampaign";

import {
  randomAddress,
  unitExistingTokenDropSMCampaignFixtureArguments,
  unitExistingTokenDropFixtureArguments,
  unitTokenDropSMCampaignFixtureArguments,
  unitTokenDropFixtureArguments,
} from "../shared/constants";
import {
  deployMockAirBroFactory,
  deployMockAirBroFactorySMCampaign,
  deployMockBaycNft,
  deployMockDAItoken,
} from "./mocks";

type UnitExisting1155NFTDropFixtureType = {
  existing1155NftDrop: Existing1155NftDrop;
  mockAirBroFactory: MockContract;
};

type UnitExisting1155NFTDropSMCampaignFixtureType = {
  existing1155NftDropSMCampaign: Existing1155NftDropSMCampaign;
  mockAirBroFactorySMCampaign: MockContract;
  // airBro1155NftMint: AirBro1155NftMint;
};

type UnitExistingTokenDropFixtureType = {
  existingTokenDrop: ExistingTokenDrop;
  // mockAirBroFactory: MockContract;
  existingTokenDropConstructorArgs: any;
  mockDAItoken: MockContract;
  testNftCollection: TestNftCollection;
};

type UnitItemNFTDropFixtureType = {
  itemNFTDrop: ItemNFTDrop;
  mockAirBroFactory: MockContract;
};

type UnitNFTDropFixtureType = {
  nftDrop: NFTDrop;
  mockAirBroFactory: MockContract;
};

type UnitTokenDropFixtureType = {
  tokenDrop: TokenDrop;
  mockAirBroFactory: MockContract;
  tokenDropConstructorArgs: any;
  mockBaycNft: MockContract;
};

type UnitExistingTokenDropSMCampaignFixtureType = {
  existingTokenDropSMCampaign: ExistingTokenDropSMCampaign;
  mockAirBroFactorySMCampaign: MockContract;
  existingTokenDropSMCampaignConstructorArgs: any;
  mockDAItoken: MockContract;
};

type UnitTokenDropSMCampaignFixtureType = {
  tokenDropSMCampaign: TokenDropSMCampaign;
  mockAirBroFactorySMCampaign: MockContract;
  tokenDropSMCampaignConstructorArgs: any;
};

type IntegrationFixtureType = {
  airbroFactory: AirbroFactory;
  testNftCollection: TestNftCollection;
  testToken: TestToken;
  airBro1155NftMint: AirBro1155NftMint;
};

type IntegrationSMCampaignFixtureType = {
  airbroFactorySMCampaign: AirbroFactorySMCampaign;
  testNftCollection: TestNftCollection;
  testToken: TestToken;
  airBro1155NftMint: AirBro1155NftMint;
};

export const unitExisting1155NFTDropFixture: Fixture<UnitExisting1155NFTDropFixtureType> = async (
  signers: Wallet[],
) => {
  const deployer: Wallet = signers[0];

  const mockAirBroFactory = await deployMockAirBroFactory(deployer);

  const existing1155NftDropFactory: ContractFactory = await ethers.getContractFactory(`Existing1155NftDrop`);

  const existing1155NftDrop: Existing1155NftDrop = (await existing1155NftDropFactory
    .connect(deployer)
    .deploy(randomAddress, randomAddress, 2, 2, 2, 2)) as Existing1155NftDrop;

  await existing1155NftDrop.deployed();

  return { existing1155NftDrop, mockAirBroFactory };
};

export const unitExisting1155NFTDropSMCampaignFixture: Fixture<UnitExisting1155NFTDropSMCampaignFixtureType> = async (
  signers: Wallet[],
) => {
  const deployer: Wallet = signers[0];

  const airBro1155NftMintFactory: ContractFactory = await ethers.getContractFactory(`AirBro1155NftMint`);

  const airBro1155NftMint: AirBro1155NftMint = (await airBro1155NftMintFactory
    .connect(deployer)
    .deploy()) as AirBro1155NftMint;

  await airBro1155NftMint.deployed();

  const mockAirBroFactorySMCampaign = await deployMockAirBroFactorySMCampaign(deployer);

  const existing1155NftDropSMCampaignFactory: ContractFactory = await ethers.getContractFactory(
    `Existing1155NftDropSMCampaign`,
  );

  const existing1155NftDropSMCampaign: Existing1155NftDropSMCampaign = (await existing1155NftDropSMCampaignFactory
    .connect(deployer)
    .deploy(
      randomAddress,
      airBro1155NftMint.address,
      2,
      1,
      1000,
      2,
      mockAirBroFactorySMCampaign.address,
    )) as Existing1155NftDropSMCampaign;

  await existing1155NftDropSMCampaign.deployed();

  const idOf1155: string = "nftAirdrop";
  const amounOft1155: number = 1000;

  await airBro1155NftMint.connect(deployer).mint(idOf1155, amounOft1155);

  await airBro1155NftMint.connect(deployer).setApprovalForAll(existing1155NftDropSMCampaign.address, true);
  await existing1155NftDropSMCampaign.connect(deployer).fundAirdrop();

  return { existing1155NftDropSMCampaign, mockAirBroFactorySMCampaign };
};

export const unitExistingTokenDropFixture: Fixture<UnitExistingTokenDropFixtureType> = async (signers: Wallet[]) => {
  const deployer: Wallet = signers[0];

  const mockDAItoken = await deployMockDAItoken(deployer);

  await mockDAItoken.deployed();

  const testNftCollectionFactory: ContractFactory = await ethers.getContractFactory(`TestNftCollection`);

  const testNftCollection: TestNftCollection = (await testNftCollectionFactory
    .connect(deployer)
    .deploy()) as TestNftCollection;

  await testNftCollection.deployed();

  const existingTokenDropFactory: ContractFactory = await ethers.getContractFactory(`ExistingTokenDrop`);

  const existingTokenDropConstructorArgs = await unitExistingTokenDropFixtureArguments(
    mockDAItoken.address,
    testNftCollection.address,
  );
  const existingTokenDrop: ExistingTokenDrop = (await existingTokenDropFactory
    .connect(deployer)
    .deploy(...Object.values(existingTokenDropConstructorArgs))) as ExistingTokenDrop;

  await existingTokenDrop.deployed();

  return { existingTokenDrop, existingTokenDropConstructorArgs, mockDAItoken, testNftCollection };
};

export const unitItemNFTDropFixture: Fixture<UnitItemNFTDropFixtureType> = async (signers: Wallet[]) => {
  const deployer: Wallet = signers[0];

  const mockAirBroFactory = await deployMockAirBroFactory(deployer);

  const itemNFTDropFactory: ContractFactory = await ethers.getContractFactory(`ItemNFTDrop`);

  const itemNFTDrop: ItemNFTDrop = (await itemNFTDropFactory
    .connect(deployer)
    .deploy(randomAddress, 2, "eee", "0x00", 1, mockAirBroFactory.address)) as ItemNFTDrop;

  await itemNFTDrop.deployed();

  return { itemNFTDrop, mockAirBroFactory };
};

export const unitNFTDropFixture: Fixture<UnitNFTDropFixtureType> = async (signers: Wallet[]) => {
  const deployer: Wallet = signers[0];

  const mockAirBroFactory = await deployMockAirBroFactory(deployer);

  const nftDropFactory: ContractFactory = await ethers.getContractFactory(`NFTDrop`);

  const nftDrop: NFTDrop = (await nftDropFactory
    .connect(deployer)
    .deploy(randomAddress, 2, "e", "e", "e", 2, mockAirBroFactory.address)) as NFTDrop;

  await nftDrop.deployed();

  return { nftDrop, mockAirBroFactory };
};

export const unitTokenDropFixture: Fixture<UnitTokenDropFixtureType> = async (signers: Wallet[]) => {
  const deployer: Wallet = signers[0];

  const mockAirBroFactory = await deployMockAirBroFactory(deployer);
  const mockBaycNft = await deployMockBaycNft(deployer);

  const tokenDropFactory: ContractFactory = await ethers.getContractFactory(`TokenDrop`);

  const tokenDropConstructorArgs = await unitTokenDropFixtureArguments(mockBaycNft.address);
  const tokenDrop: TokenDrop = (await tokenDropFactory
    .connect(deployer)
    .deploy(...Object.values(tokenDropConstructorArgs))) as TokenDrop;

  await tokenDrop.deployed();

  return { tokenDrop, mockAirBroFactory, tokenDropConstructorArgs, mockBaycNft };
};

export const unitExistingTokenDropSMCampaignFixture: Fixture<UnitExistingTokenDropSMCampaignFixtureType> = async (
  signers: Wallet[],
) => {
  const deployer: Wallet = signers[0];

  const mockAirBroFactorySMCampaign = await deployMockAirBroFactorySMCampaign(deployer);
  const mockDAItoken = await deployMockDAItoken(deployer); // mock DAI token

  const ExistingTokenDropSMCampaignFactory = await ethers.getContractFactory("ExistingTokenDropSMCampaign");

  const existingTokenDropSMCampaignConstructorArgs = await unitExistingTokenDropSMCampaignFixtureArguments(
    mockDAItoken.address,
    mockAirBroFactorySMCampaign.address,
  );
  const existingTokenDropSMCampaign: ExistingTokenDropSMCampaign = (await ExistingTokenDropSMCampaignFactory.connect(
    deployer,
  ).deploy(...Object.values(existingTokenDropSMCampaignConstructorArgs))) as ExistingTokenDropSMCampaign;

  await existingTokenDropSMCampaign.deployed();

  return {
    existingTokenDropSMCampaign,
    existingTokenDropSMCampaignConstructorArgs,
    mockAirBroFactorySMCampaign,
    mockDAItoken,
  };
};

export const unitTokenDropSMCampaignFixture: Fixture<UnitTokenDropSMCampaignFixtureType> = async (
  signers: Wallet[],
) => {
  const deployer: Wallet = signers[0];

  const mockAirBroFactorySMCampaign = await deployMockAirBroFactorySMCampaign(deployer);

  const tokenDropSMCampaignFactory = await ethers.getContractFactory("TokenDropSMCampaign");

  const tokenDropSMCampaignConstructorArgs = await unitTokenDropSMCampaignFixtureArguments(
    mockAirBroFactorySMCampaign.address,
  );
  const tokenDropSMCampaign: TokenDropSMCampaign = (await tokenDropSMCampaignFactory
    .connect(deployer)
    .deploy(...Object.values(tokenDropSMCampaignConstructorArgs))) as TokenDropSMCampaign;

  await tokenDropSMCampaign.deployed();

  return { tokenDropSMCampaign, mockAirBroFactorySMCampaign, tokenDropSMCampaignConstructorArgs };
};

export const integrationsFixture: Fixture<IntegrationFixtureType> = async (signers: Wallet[]) => {
  const deployer: Wallet = signers[0];

  const airbroFactoryFactory: ContractFactory = await ethers.getContractFactory(`AirbroFactory`);

  const airbroFactory: AirbroFactory = (await airbroFactoryFactory.connect(deployer).deploy()) as AirbroFactory;

  await airbroFactory.deployed();

  const testNftCollectionFactory: ContractFactory = await ethers.getContractFactory(`TestNftCollection`);

  const testNftCollection: TestNftCollection = (await testNftCollectionFactory
    .connect(deployer)
    .deploy()) as TestNftCollection;

  await testNftCollection.deployed();

  const testTokenFactory: ContractFactory = await ethers.getContractFactory(`TestToken`);

  const testToken: TestToken = (await testTokenFactory.connect(deployer).deploy()) as TestToken;

  await testToken.deployed();

  const airBro1155NftMintFactory: ContractFactory = await ethers.getContractFactory(`AirBro1155NftMint`);

  const airBro1155NftMint: AirBro1155NftMint = (await airBro1155NftMintFactory
    .connect(deployer)
    .deploy()) as AirBro1155NftMint;

  await airBro1155NftMint.deployed();

  return { airbroFactory, testNftCollection, testToken, airBro1155NftMint };
};

export const integrationsSMCampaignFixture: Fixture<IntegrationSMCampaignFixtureType> = async (signers: Wallet[]) => {
  const deployer: Wallet = signers[0];

  const airbroFactorySMCampaignFactory: ContractFactory = await ethers.getContractFactory(`AirbroFactorySMCampaign`);

  const airbroFactorySMCampaign: AirbroFactorySMCampaign = (await airbroFactorySMCampaignFactory
    .connect(deployer)
    .deploy()) as AirbroFactorySMCampaign;

  await airbroFactorySMCampaign.deployed();

  const testNftCollectionFactory: ContractFactory = await ethers.getContractFactory(`TestNftCollection`);

  const testNftCollection: TestNftCollection = (await testNftCollectionFactory
    .connect(deployer)
    .deploy()) as TestNftCollection;

  await testNftCollection.deployed();

  const testTokenFactory: ContractFactory = await ethers.getContractFactory(`TestToken`);

  const testToken: TestToken = (await testTokenFactory.connect(deployer).deploy()) as TestToken;

  await testToken.deployed();

  const airBro1155NftMintFactory: ContractFactory = await ethers.getContractFactory(`AirBro1155NftMint`);

  const airBro1155NftMint: AirBro1155NftMint = (await airBro1155NftMintFactory
    .connect(deployer)
    .deploy()) as AirBro1155NftMint;

  await airBro1155NftMint.deployed();

  return { airbroFactorySMCampaign, testNftCollection, testToken, airBro1155NftMint };
};
