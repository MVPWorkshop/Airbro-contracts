import { ethers, network, waffle } from "hardhat";
import { Mocks, Signers } from "../shared/types";

import { contractAdminAddress } from "../shared/constants";
import {
  integrationsFixture,
  unitTokenDropFixture,
  unitExisting1155NFTDropFixture,
  unitExistingTokenDropFixture,
  unitItemNFTDropFixture,
  unitNFTDropFixture,
  unitExistingTokenDropSMCampaignFixture,
  integrationsSMCampaignFixture,
  unitExisting1155NFTDropSMCampaignFixture,
  unitTokenDropSMCampaignFixture,
} from "../shared/fixtures";

import { shouldDeploy } from "./AirbroFactory/AirbroFactoryShouldDeploy.spec";

import { TokenDropShouldDeploy } from "./airdrops/TokenDrop/TokenDropShouldBeDeployed.spec";
import { ExistingTokenDropShouldDeploy } from "./airdrops/ExistingTokenDrop/ExistingTokenDropShouldBeDeployed.spec";
import { ExistingTokenDropShouldShowRewardAmount } from "./airdrops/ExistingTokenDrop/ExistingTokenDropShouldShowRewardAmount.spec";
import { Existing1155NftDropShouldDeploy } from "./airdrops/Existing1155NftDrop/Existing1155NftDropShouldBeDeployed.spec";

import { AirbroFactorySMCampaignShouldBeCorrectAdmin } from "./AirbroFactorySMCampaign/AirbroFactorySMCampaignShouldBeCorrectAdmin.spec";
import { AirbroFactorySMCampaignShouldChangeAdminAddress } from "./AirbroFactorySMCampaign/AirbroFactorySMCampaignShouldChangeAdmin.spec";
import { AirbroFactorySMCampaignShouldDelpoyAirbro1155Contract } from "./AirbroFactorySMCampaign/AirbroFactorySMCampaignShouldDeployAirbro1155Contract.spec";

import { Existing1155NftDropSMCampaignShouldSetMerkleRoot } from "./airdropsSMCampaign/Existing1155NftDropSMCampaign/Existing1155NftDropSMCampaignShouldSetMerkleRoot.spec";
import { Existing1155NftDropSMCampaignShouldDeploy } from "./airdropsSMCampaign/Existing1155NftDropSMCampaign/Existing1155NftDropSMCampaignShouldBeDeployed.spec";
import { Existing1155NftDropSMCampaignShouldClaimReward } from "./airdropsSMCampaign/Existing1155NftDropSMCampaign/Existing1155NftDropSMCampaignShouldClaimReward.spec";
import { ExistingTokenDropSMCampaignShouldDeploy } from "./airdropsSMCampaign/ExistingTokenDropSMCampaign/ExistingTokenDropSMCampaignShouldBeDeployed.spec";
import { ExistingTokenDropSMCampaignShouldSetMerkleRoot } from "./airdropsSMCampaign/ExistingTokenDropSMCampaign/ExistingTokenDropSMCampaignShouldSetMerkleRoot.spec";
import { TokenDropSMCampaignShouldDeploy } from "./airdropsSMCampaign/TokenDropSMCampaign/TokenDropSMCampaignShouldBeDeployed.spec";
import { TokenDropSMCampaignShouldSetMerkleRoot } from "./airdropsSMCampaign/TokenDropSMCampaign/TokenDropSMCampaignShouldSetMerkleRoot.spec";
import { TokenDropSMCampaignShouldClaimReward } from "./airdropsSMCampaign/TokenDropSMCampaign/TokenDropSMCampaignShouldClaimReward.spec";
import { ExistingTokenDropSMCampaignShouldClaimReward } from "./airdropsSMCampaign/ExistingTokenDropSMCampaign/ExistingTokenDropSMCampaignShouldClaimReward.spec";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers = waffle.provider.getWallets();
    this.signers.deployer = signers[0];
    this.signers.alice = signers[1];
    this.signers.bob = signers[2];
    this.signers.jerry = signers[3];
    this.signers.lisa = signers[4];
    this.signers.peter = signers[5];

    // sending eth to the backend wallet address from the hardhat account of index 6
    await signers[6].sendTransaction({
      to: contractAdminAddress,
      value: ethers.utils.parseEther("5000"),
    });

    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [contractAdminAddress],
    });

    this.signers.backendWallet = await ethers.getSigner(contractAdminAddress);

    this.loadFixture = waffle.createFixtureLoader(signers);
  });

  describe("Airbro - ERC721 Holder", function () {
    describe("AirbroFactory", () => {
      beforeEach(async function () {
        const { airbroFactory } = await this.loadFixture(integrationsFixture);
        this.airbroFactory = airbroFactory;
      });

      shouldDeploy();
    });

    describe("Existing1155NftDrop", () => {
      beforeEach(async function () {
        const { existing1155NftDrop, mockAirBroFactory } = await this.loadFixture(unitExisting1155NFTDropFixture);
        this.existing1155NFTDrop = existing1155NftDrop;

        this.mocks = {} as Mocks;
        this.mocks.mockAirBroFactory = mockAirBroFactory;
      });

      Existing1155NftDropShouldDeploy();
    });

    describe("ExistingTokenDrop", () => {
      beforeEach(async function () {
        const { existingTokenDrop, existingTokenDropConstructorArgs, mockDAItoken, testNftCollection } = await this.loadFixture(
          unitExistingTokenDropFixture,
        );
        this.existingTokenDrop = existingTokenDrop;

        this.testNftCollection = testNftCollection;

        this.mocks = {} as Mocks;
        // this.mocks.mockAirBroFactory = mockAirBroFactory;
        this.mocks.mockDAItoken = mockDAItoken;

        // Here are the arguments used to deploy the existingTokenDropSMCampaign contract.
        // They are dependant on two mock contracts deployed in fixutres,
        // so this is why they are exported from the fixture as the 2nd module.
        this.constructorArgs = existingTokenDropConstructorArgs;
      });

      ExistingTokenDropShouldDeploy();
      ExistingTokenDropShouldShowRewardAmount();
    });

    describe("ItemNFTDrop", () => {
      beforeEach(async function () {
        const { itemNFTDrop, mockAirBroFactory } = await this.loadFixture(unitItemNFTDropFixture);
        this.itemNFTDrop = itemNFTDrop;

        this.mocks = {} as Mocks;
        this.mocks.mockAirBroFactory = mockAirBroFactory;
      });

      //
    });

    describe("NFTDrop", () => {
      beforeEach(async function () {
        const { nftDrop, mockAirBroFactory } = await this.loadFixture(unitNFTDropFixture);
        this.nftDrop = nftDrop;

        this.mocks = {} as Mocks;
        this.mocks.mockAirBroFactory = mockAirBroFactory;
      });

      //
    });

    describe("TokenDrop", () => {
      beforeEach(async function () {
        const { tokenDrop, mockAirBroFactory, tokenDropConstructorArgs, mockBaycNft } = await this.loadFixture(
          unitTokenDropFixture,
        );
        this.tokenDrop = tokenDrop;

        this.mocks = {} as Mocks;
        this.mocks.mockAirBroFactory = mockAirBroFactory;
        this.mocks.mockBaycNft = mockBaycNft;

        this.constructorArgs = tokenDropConstructorArgs;
      });

      TokenDropShouldDeploy();
    });
  });

  describe("Airbro - ERC1155 Holder", function () {
    describe("AirbroFactorySMCampaign", () => {
      beforeEach(async function () {
        const { airbroFactorySMCampaign } = await this.loadFixture(integrationsSMCampaignFixture);

        this.airbroFactorySMCampaign = airbroFactorySMCampaign;
      });

      AirbroFactorySMCampaignShouldBeCorrectAdmin();
      AirbroFactorySMCampaignShouldChangeAdminAddress();
      AirbroFactorySMCampaignShouldDelpoyAirbro1155Contract();
    });

    describe("ExistingNft1155DropSMCampaign", () => {
      beforeEach(async function () {
        const { existing1155NftDropSMCampaign, mockAirBroFactorySMCampaign } = await this.loadFixture(
          unitExisting1155NFTDropSMCampaignFixture,
        );

        this.existing1155NFTDropSMCampaign = existing1155NftDropSMCampaign;

        this.mocks = {} as Mocks;
        this.mocks.mockAirBroFactorySMCampaign = mockAirBroFactorySMCampaign;
      });

      Existing1155NftDropSMCampaignShouldDeploy();
      Existing1155NftDropSMCampaignShouldSetMerkleRoot();
      Existing1155NftDropSMCampaignShouldClaimReward();
    });

    describe("ExistingTokenDropSMCampaign", () => {
      beforeEach(async function () {
        const { existingTokenDropSMCampaign, existingTokenDropSMCampaignConstructorArgs, mockAirBroFactorySMCampaign, mockDAItoken } =
          await this.loadFixture(unitExistingTokenDropSMCampaignFixture);

        this.existingTokenDropSMCampaign = existingTokenDropSMCampaign;
        this.mocks = {} as Mocks;
        this.mocks.mockAirBroFactorySMCampaign = mockAirBroFactorySMCampaign;
        this.mocks.mockDAItoken = mockDAItoken;

        // Here are the arguments used to deploy the existingTokenDropSMCampaign contract.
        // They are dependant on two mock contracts deployed in fixutres,
        // so this is why they are exported from the fixture as the 2nd module.
        this.constructorArgs = existingTokenDropSMCampaignConstructorArgs;
      });

      ExistingTokenDropSMCampaignShouldDeploy();
      ExistingTokenDropSMCampaignShouldSetMerkleRoot();
      ExistingTokenDropSMCampaignShouldClaimReward();
    });

    describe("TokenDropSMCampaign", () => {
      beforeEach(async function () {
        const { tokenDropSMCampaign, mockAirBroFactorySMCampaign, tokenDropSMCampaignConstructorArgs } = await this.loadFixture(
          unitTokenDropSMCampaignFixture,
        );

        this.tokenDropSMCampaign = tokenDropSMCampaign;

        this.mocks = {} as Mocks;
        this.mocks.mockAirBroFactorySMCampaign = mockAirBroFactorySMCampaign;

        this.constructorArgs = tokenDropSMCampaignConstructorArgs;
      });

      TokenDropSMCampaignShouldDeploy();
      TokenDropSMCampaignShouldSetMerkleRoot();
      TokenDropSMCampaignShouldClaimReward();
    });
  });
});
