/* Types imported into fixtures.ts */
import { MockContract } from "ethereum-waffle";
import { TestToken } from "../../../src/types/contracts/mocks/TestToken";
import { AirdropRegistry } from "../../../src/types/contracts/AirdropRegistry";
import { AirbroCampaignFactory } from "../../../src/types/contracts/AirbroCampaignFactory";
import { NewSB1155DropCampaign } from "../../../src/types/contracts/campaignAirdrops/NewSB1155DropCampaign";
import { NewERC1155DropCampaign } from "../../../src/types/contracts/campaignAirdrops/NewERC1155DropCampaign";
import { ExistingERC20DropCampaign } from "../../../src/types/contracts/campaignAirdrops/ExistingERC20DropCampaign";

import {
  existing1155NFTDropConstructorArgsType,
  existingERC20DropCampaignArgsType,
  existingTokenDropConstructorArgsType,
  newERC1155DropCampaignArgsType,
  newSB1155DropCampaignArgsType,
} from "./constructorArgTypes";

import { Existing1155NftDrop } from "../../../src/types/contracts/airdrops/Existing1155NftDrop";
import { ExistingTokenDrop } from "../../../src/types/contracts/airdrops/ExistingTokenDrop";
import { TokenDrop } from "../../../src/types/contracts/airdrops/TokenDrop";
import { AirbroFactory } from "../../../src/types/contracts/AirbroFactory";
import { TestNftCollection } from "../../../src/types/contracts/mocks/TestNftCollection";
import { AirBro1155NftMint } from "../../../src/types/contracts/mocks/Airbro1155NftMint.sol/AirBro1155NftMint";
import { AirdropCampaignData } from "../../../src/types/contracts/AirdropCampaignData";

export type UnitNewERC1155DropCampaignFixtureType = {
  newERC1155DropCampaign: NewERC1155DropCampaign;
  mockAirbroCampaignFactory: MockContract;
  newERC1155DropCampaignArgs: newERC1155DropCampaignArgsType;
};

export type UnitNewSB1155DropCampaignFixtureType = {
  newSB1155DropCampaign: NewSB1155DropCampaign;
  mockAirbroCampaignFactory: MockContract;
  newSB1155DropCampaignArgs: newSB1155DropCampaignArgsType;
};

export type UnitExistingTokenDropFixtureType = {
  existingTokenDrop: ExistingTokenDrop;
  existingTokenDropConstructorArgs: existingTokenDropConstructorArgsType;
  mockDAItoken: MockContract;
  mockBaycNft: MockContract;
};

export type UnitTokenDropFixtureType = {
  tokenDrop: TokenDrop;
  mockAirBroFactory: MockContract;
  tokenDropConstructorArgs: any;
  mockBaycNft: MockContract;
};

export type UnitExistingERC20DropCampaignFixtureType = {
  mockAirbroCampaignFactory: MockContract;
  mockDAItoken: MockContract;
  ExistingERC20DropCampaign: ExistingERC20DropCampaign;
  existingERC20DropCampaignArgs: existingERC20DropCampaignArgsType;
};

// airbro classic fixture types
export type UnitExisting1155NFTDropFixtureType = {
  existing1155NftDrop: Existing1155NftDrop;
  mockAirBroFactory: MockContract;
  mock1155Nft: MockContract;
  mockBaycNft: MockContract;
  existing1155NFTDropConstructorArgs: existing1155NFTDropConstructorArgsType;
};

export type AirdropCampaignDataFixtureType = {
  airdropCampaignData: AirdropCampaignData;
};

export type IntegrationFixtureType = {
  airbroFactory: AirbroFactory;
  testNftCollection: TestNftCollection;
  testToken: TestToken;
  airBro1155NftMint: AirBro1155NftMint;
};

export type IntegrationCampaignFixtureType = {
  airdropRegistry: AirdropRegistry;
  airbroCampaignFactory: AirbroCampaignFactory;
  newERC1155DropCampaign: NewERC1155DropCampaign;
  newERC1155DropCampaignArgs: newERC1155DropCampaignArgsType;
  newSB1155DropCampaign: NewERC1155DropCampaign;
  newSB1155DropCampaignArgs: newSB1155DropCampaignArgsType;
  existingERC20DropCampaign: ExistingERC20DropCampaign;
  existingERC20DropCampaignArgs: existingERC20DropCampaignArgsType;
  testToken: TestToken;
};
