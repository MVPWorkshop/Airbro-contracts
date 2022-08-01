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
  unitExistingERC20DropCampaignFixture,
  airdropCampaignDataFixture,
} from "../shared/fixtures";

import { shouldDeploy } from "./AirbroFactory/AirbroFactoryShouldDeploy.spec";

import { TokenDropShouldDeploy } from "./airdrops/TokenDrop/TokenDropShouldBeDeployed.spec";
import { ExistingTokenDropShouldDeploy } from "./airdrops/ExistingTokenDrop/ExistingTokenDropShouldBeDeployed.spec";
import { Existing1155NftDropShouldDeploy } from "./airdrops/Existing1155NftDrop/Existing1155NftDropShouldBeDeployed.spec";

import { NewERC1155DropCampaignShouldDeploy } from "./campaignAirdrops/NewERC1155DropCampaign/NewERC1155DropCampaignShouldDeploy.spec";
import { NewERC1155DropCampaignShouldSetMerkleRoot } from "./campaignAirdrops/NewERC1155DropCampaign/NewERC1155DropCampaignShouldSetMerkleRoot.spec";
import { NewERC1155DropCampaignShouldClaimReward } from "./campaignAirdrops/NewERC1155DropCampaign/NewERC1155DropCampaignShouldClaimReward.spec";

import { ExistingERC20DropCampaignShouldDeploy } from "./campaignAirdrops/ExistingERC20DropCampaign/ExistingERC20DropCampaignShouldDeploy.spec";
import { ExistingERC20DropCampaignShouldSetMerkleRoot } from "./campaignAirdrops/ExistingERC20DropCampaign/ExistingERC20DropCampaignShouldSetMerkleRoot.spec";
import { ExistingERC20DropCampaignShouldClaimReward } from "./campaignAirdrops/ExistingERC20DropCampaign/ExistingERC20DropCampaignShouldClaimReward.spec";

import { AirdropCampaignDataShouldBeDeployed } from "./AirdropCampaignData/AirdropCampaignDataShouldBeDeployed.spec";
import { AirdropCampaignDataShouldChangeAdmin } from "./AirdropCampaignData/AirdropCampaignDataShouldChangeAdmin.spec";
import { AirdropCampaignDataShouldAddDailyMerkleRootHash } from "./AirdropCampaignData/AirdropCampaignDataShouldAddDailyMerkleRootHash.spec";
import { AirdropCampaignDataShouldBatchAddDailyMerkleRootHash } from "./AirdropCampaignData/AirdropCampaignDataShouldBatchAddDailyMerkleRootHash.spec";
import { AirdropCampaignDataShouldAddAirdropCampaignChain } from "./AirdropCampaignData/AirdropCampaignDataShouldAddAirdropCampaignChain.spec";
import { AirdropCampaignDataShouldBatchAddAirdropCampaignChain } from "./AirdropCampaignData/AirdropCampaignDataShouldBatchAddAirdropCampaignChain.spec";
import { AirdropCampaignDataShouldFinalizeAirdrop } from "./AirdropCampaignData/AirdropCampaignDataShouldFinalizeAirdrop.spec";

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

  describe("AirdropsCampaignData", async function () {
    beforeEach(async function () {
      const { airdropCampaignData } = await this.loadFixture(airdropCampaignDataFixture);
      this.airdropCampaignData = airdropCampaignData;
    });

    AirdropCampaignDataShouldBeDeployed();
    AirdropCampaignDataShouldChangeAdmin();
    AirdropCampaignDataShouldAddDailyMerkleRootHash();
    AirdropCampaignDataShouldBatchAddDailyMerkleRootHash();
    AirdropCampaignDataShouldAddAirdropCampaignChain();
    AirdropCampaignDataShouldBatchAddAirdropCampaignChain();
    AirdropCampaignDataShouldFinalizeAirdrop();
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

    describe("ExistingERC20DropCampaign", () => {
      beforeEach(async function () {
        const { mockAirbroCampaignFactory, mockDAItoken, ExistingERC20DropCampaign, existingERC20DropCampaignArgs } =
          await this.loadFixture(unitExistingERC20DropCampaignFixture);

        this.existingERC20DropCampaign = ExistingERC20DropCampaign;

        this.mocks = {} as Mocks;
        this.mocks.mockAirbroCampaignFactory = mockAirbroCampaignFactory;
        this.mocks.mockDAItoken = mockDAItoken;

        // Here are the arguments used to deploy the existingTokenDropSMCampaign contract.
        // They are dependant on two mock contracts deployed in fixutres,
        // so this is why they are exported from the fixture as the 2nd module.
        this.existingERC20DropCampaignArgs = existingERC20DropCampaignArgs;
      });

      ExistingERC20DropCampaignShouldDeploy();
      ExistingERC20DropCampaignShouldSetMerkleRoot();
      ExistingERC20DropCampaignShouldClaimReward();
    });
  });
});
