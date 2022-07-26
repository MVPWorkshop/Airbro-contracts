import { ethers, waffle, network } from "hardhat";
import { contractAdminAddress } from "../shared/constants";

import { Signers } from "../shared/types";

import { shouldBehaveLikeFactory } from "./AirBro/AirBroDropCreationShouldBehaveLikeFactory.spec";
import { shouldAirDropExistingToken } from "./AirBro/AirBroExistingTokenDrop.spec";
import { shouldAirDropNewToken } from "./AirBro/AirBroTokenDrop.spec";
import { shouldAirdropExisting1155NftDrop } from "./AirBro/AirBroExisting1155NftDrop.spec";
import { integrationsFixture } from "../shared/fixtures";

import { AirbroCampaignFactoryShouldBehaveLikeFactory } from "./AirbroFactoryCampaign/AirbroCampaignFactoryShouldBehaveLikeFactory.spec";
import { AirbroCampaignFactoryShouldChangeAdminInAllAirDrops } from "./AirbroFactoryCampaign/AirbroCampaignFactoryShouldChangeAdmin.spec";
import { integrationCampaignFixture } from "../shared/fixtures";

import { NewERC1155DropCampaignShouldGoThroughUserFlow } from "./AirbroFactoryCampaign/NewERC1155DropCampaign/NewERC1155DropCampaignShouldGoThroughUserFlow.spec";

import { ExistingERC20DropCampaignShouldFundCampaign } from "./AirbroFactoryCampaign/ExistingERC20DropCampaign/ExistingERC20DropCampaignShouldFundCampaign.spec";
import { ExistingERC20DropCampaignShouldBeEligible } from "./AirbroFactoryCampaign/ExistingERC20DropCampaign/ExistingERC20DropCampaignShouldBeEligible.spec";
import { ExistingERC20DropCampaignShouldGoThroughUserFlow } from "./AirbroFactoryCampaign/ExistingERC20DropCampaign/ExistingERC20DropCampaignShouldGoThroughUserFlow.spec";

describe("Integration tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers = waffle.provider.getWallets();

    this.signers.deployer = signers[0];
    this.signers.alice = signers[1];
    this.signers.bob = signers[2];
    this.signers.jerry = signers[3];
    this.signers.lisa = signers[4];
    this.signers.backendWallet = await ethers.getSigner(contractAdminAddress);

    // sending eth to the backend wallet address from the hardhat account of index 4
    await signers[5].sendTransaction({
      to: contractAdminAddress,
      value: ethers.utils.parseEther("5000"),
    });

    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [contractAdminAddress],
    });

    this.loadFixture = waffle.createFixtureLoader(signers);
  });

  describe("AirbroFactory", () => {
    beforeEach(async function () {
      const { airbroFactory, testNftCollection, testToken, airBro1155NftMint } = await this.loadFixture(integrationsFixture);
      this.airbroFactory = airbroFactory;
      this.testNftCollection = testNftCollection;
      this.testToken = testToken;
      this.test1155NftCollection = airBro1155NftMint;
    });

    shouldBehaveLikeFactory();
    shouldAirDropExistingToken();
    shouldAirDropNewToken();
    shouldAirdropExisting1155NftDrop();
  });

  describe("Airbro Campaigns", () => {
    beforeEach(async function () {
      const {
        airbroCampaignFactory,
        newERC1155DropCampaign,
        newERC1155DropCampaignArgs,
        existingERC20DropCampaign,
        existingERC20DropCampaignArgs,
        testToken,
      } = await this.loadFixture(integrationCampaignFixture);

      this.airbroCampaignFactory = airbroCampaignFactory;

      this.newERC1155DropCampaign = newERC1155DropCampaign;
      this.newERC1155DropCampaignArgs = newERC1155DropCampaignArgs;

      this.existingERC20DropCampaign = existingERC20DropCampaign;
      this.existingERC20DropCampaignArgs = existingERC20DropCampaignArgs;

      // this.testNftCollection = testNftCollection;
      this.testToken = testToken;
      // this.test1155NftCollection = airBro1155NftMint;
    });

    describe("AirbroCampaignFactory", () => {
      AirbroCampaignFactoryShouldBehaveLikeFactory();
      AirbroCampaignFactoryShouldChangeAdminInAllAirDrops();
    });

    describe("ExistingERC20DropCampaign", () => {
      ExistingERC20DropCampaignShouldFundCampaign();
      ExistingERC20DropCampaignShouldBeEligible();
      ExistingERC20DropCampaignShouldGoThroughUserFlow();
    });

    describe("NewERC1155DropCampaign", () => {
      NewERC1155DropCampaignShouldGoThroughUserFlow();
    });
  });
});
