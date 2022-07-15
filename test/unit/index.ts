import { ethers, network, waffle } from "hardhat";
import { Mocks, Signers } from "../shared/types";

import { contractAdminAddress } from "../shared/constants";
import {
  integrationsFixture,
  unitTokenDropFixture,
  unitExisting1155NFTDropFixture,
  unitExistingTokenDropFixture,
  unitNewERC1155DropCampaignFixture,
  integrationCampaignFixture,
} from "../shared/fixtures";

import { shouldDeploy } from "./AirbroFactory/AirbroFactoryShouldDeploy.spec";

import { TokenDropShouldDeploy } from "./airdrops/TokenDrop/TokenDropShouldBeDeployed.spec";
import { ExistingTokenDropShouldDeploy } from "./airdrops/ExistingTokenDrop/ExistingTokenDropShouldBeDeployed.spec";
import { Existing1155NftDropShouldDeploy } from "./airdrops/Existing1155NftDrop/Existing1155NftDropShouldBeDeployed.spec";

import { AirbroFactorySMCampaignShouldBeCorrectAdmin } from "./AirbroFactorySMCampaign-old/AirbroFactorySMCampaignShouldBeCorrectAdmin.spec";
import { AirbroFactorySMCampaignShouldChangeAdminAddress } from "./AirbroFactorySMCampaign-old/AirbroFactorySMCampaignShouldChangeAdmin.spec";

import { TokenDropSMCampaignShouldDeploy } from "./airdropsSMCampaign-old/TokenDropSMCampaign/TokenDropSMCampaignShouldBeDeployed.spec";
import { TokenDropSMCampaignShouldSetMerkleRoot } from "./airdropsSMCampaign-old/TokenDropSMCampaign/TokenDropSMCampaignShouldSetMerkleRoot.spec";
import { TokenDropSMCampaignShouldClaimReward } from "./airdropsSMCampaign-old/TokenDropSMCampaign/TokenDropSMCampaignShouldClaimReward.spec";

import { NewERC1155DropCampaignShouldDeploy } from "./campaignAirdrops/NewERC1155DropCampaign/NewERC1155DropCampaignShouldDeploy.spec";
import { NewERC1155DropCampaignShouldSetMerkleRoot } from "./campaignAirdrops/NewERC1155DropCampaign/NewERC1155DropCampaignShouldSetMerkleRoot.spec";
import { NewERC1155DropCampaignShouldClaimReward } from "./campaignAirdrops/NewERC1155DropCampaign/NewERC1155DropCampaignShouldClaimReward.spec";

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

  describe("Airbro - Classic", function () {
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

  describe("Airbro Campaigns", function () {
    describe("AirbroCampaignFactory", () => {
      beforeEach(async function () {
        const { airbroCampaignFactory } = await this.loadFixture(integrationCampaignFixture);

        this.airbroCampaignFactory = airbroCampaignFactory;
      });

      // AirbroFactorySMCampaignShouldBeCorrectAdmin(); // refactor
      // AirbroFactorySMCampaignShouldChangeAdminAddress(); // refactor
    });

    describe("NewERC1155DropCampaign", () => {
      beforeEach(async function () {
        const { mockAirbroCampaignFactory, newERC1155DropCampaign, newERC1155DropCampaignArgs } = await this.loadFixture(
          unitNewERC1155DropCampaignFixture,
        );

        this.newERC1155DropCampaign = newERC1155DropCampaign;

        this.mocks = {} as Mocks;
        this.mocks.mockAirbroCampaignFactory = mockAirbroCampaignFactory;

        this.constructorArgs = newERC1155DropCampaignArgs;
      });

      NewERC1155DropCampaignShouldDeploy();
      NewERC1155DropCampaignShouldSetMerkleRoot();
      NewERC1155DropCampaignShouldClaimReward();
    });

    describe("ExistingTokenDropSMCampaign", () => {
      beforeEach(async function () {
        // const { existingTokenDropSMCampaign, existingTokenDropSMCampaignConstructorArgs, mockAirBroFactorySMCampaign, mockDAItoken } =
        //   await this.loadFixture(unitExistingTokenDropSMCampaignFixture);
        // this.existingTokenDropSMCampaign = existingTokenDropSMCampaign;
        // this.mocks = {} as Mocks;
        // this.mocks.mockAirBroFactorySMCampaign = mockAirBroFactorySMCampaign;
        // this.mocks.mockDAItoken = mockDAItoken;
        // Here are the arguments used to deploy the existingTokenDropSMCampaign contract.
        // They are dependant on two mock contracts deployed in fixutres,
        // so this is why they are exported from the fixture as the 2nd module.
        // this.constructorArgs = existingTokenDropSMCampaignConstructorArgs;
      });

      // ExistingTokenDropSMCampaignShouldDeploy();
      // ExistingTokenDropSMCampaignShouldSetMerkleRoot();
      // ExistingTokenDropSMCampaignShouldClaimReward();
    });
  });
});
