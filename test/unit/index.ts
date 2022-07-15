import { ethers, network, waffle } from "hardhat";
import { Mocks, Signers } from "../shared/types";

import { contractAdminAddress } from "../shared/constants";
import {
  integrationsFixture,
  unitTokenDropFixture,
  unitExisting1155NFTDropFixture,
  unitExistingTokenDropFixture,
  integrationsSMCampaignFixture,
} from "../shared/fixtures";

import { shouldDeploy } from "./AirbroFactory/AirbroFactoryShouldDeploy.spec";

import { TokenDropShouldDeploy } from "./airdrops/TokenDrop/TokenDropShouldBeDeployed.spec";
import { ExistingTokenDropShouldDeploy } from "./airdrops/ExistingTokenDrop/ExistingTokenDropShouldBeDeployed.spec";
import { Existing1155NftDropShouldDeploy } from "./airdrops/Existing1155NftDrop/Existing1155NftDropShouldBeDeployed.spec";

import { AirbroFactorySMCampaignShouldBeCorrectAdmin } from "./AirbroFactorySMCampaign/AirbroFactorySMCampaignShouldBeCorrectAdmin.spec";
import { AirbroFactorySMCampaignShouldChangeAdminAddress } from "./AirbroFactorySMCampaign/AirbroFactorySMCampaignShouldChangeAdmin.spec";
import { AirbroFactorySMCampaignShouldDelpoyAirbro1155Contract } from "./AirbroFactorySMCampaign/AirbroFactorySMCampaignShouldDeployAirbro1155Contract.spec";

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
        const { existing1155NftDrop, mockAirBroFactory, mock1155Nft, mockBaycNft, existing1155NFTDropConstructorArgs } =
          await this.loadFixture(unitExisting1155NFTDropFixture);
        this.existing1155NFTDrop = existing1155NftDrop;

        this.mocks = {} as Mocks;
        this.mocks.mockAirBroFactory = mockAirBroFactory;
        this.mocks.mock1155Nft = mock1155Nft;
        this.mocks.mockBaycNft = mockBaycNft;

        this.constructorArgs = existing1155NFTDropConstructorArgs;
      });

      Existing1155NftDropShouldDeploy();
    });

    describe("ExistingTokenDrop", () => {
      beforeEach(async function () {
        const { existingTokenDrop, existingTokenDropConstructorArgs, mockDAItoken, mockBaycNft } = await this.loadFixture(
          unitExistingTokenDropFixture,
        );
        this.existingTokenDrop = existingTokenDrop;

        this.mocks = {} as Mocks;
        // this.mocks.mockAirBroFactory = mockAirBroFactory;
        this.mocks.mockDAItoken = mockDAItoken;
        this.mocks.mockBaycNft = mockBaycNft;

        // Here are the arguments used to deploy the existingTokenDropSMCampaign contract.
        // They are dependant on two mock contracts deployed in fixutres,
        // so this is why they are exported from the fixture as the 2nd module.
        this.constructorArgs = existingTokenDropConstructorArgs;
      });

      ExistingTokenDropShouldDeploy();
    });

    describe("TokenDrop", () => {
      beforeEach(async function () {
        const { tokenDrop, mockAirBroFactory, tokenDropConstructorArgs, mockBaycNft } = await this.loadFixture(unitTokenDropFixture);
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
  });
});
