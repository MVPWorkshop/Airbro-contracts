import { ethers, waffle, network } from "hardhat";
import { contractAdminAddress } from "../shared/constants";

import { Signers } from "../shared/types";

import { shouldBehaveLikeFactory } from "./AirBro/AirBroDropCreationShouldBehaveLikeFactory.spec";
import { shouldAirDropExistingToken } from "./AirBro/AirBroExistingTokenDrop.spec";
import { shouldAirDropNewToken } from "./AirBro/AirBroTokenDrop.spec";
import { shouldAirdropExisting1155NftDrop } from "./AirBro/AirBroExisting1155NftDrop.spec";
import { integrationsFixture } from "../shared/fixtures";

import { AirbroFactorySMCampaignShouldBehaveLikeFactory } from "./AirBroSMCampaign/AirBroDropCreationSMCampaignShouldBehaveLikeFactory.spec";
import { AirbroFactorySMCampaignShouldChangeAdminInAllAirDrops } from "./AirBroSMCampaign/AirBroFactorySMCampaignShouldChangeAdmin.spec";
import { AirbroFactorySMCampaignShouldAirdropExisting1155NftDropSMCampaign } from "./AirBroSMCampaign/AirBroExisting1155NftDropSMCampaign.spec";
import { integrationsSMCampaignFixture } from "../shared/fixtures";
import { AirbroFactorySMCampaignShouldAirDropExistingToken } from "./AirBroSMCampaign/AirBroExistingTokenNftDropSMCampaign.spec";
import { AirbroFactorySMCampaignShouldAirDropNewToken } from "./AirBroSMCampaign/AirBroTokenNftDropSMCampaign.spec";

const randomAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
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

    this.signers.backendWallet = await ethers.getSigner(contractAdminAddress);

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

  describe("AirbroFactorySMCampaign", () => {
    beforeEach(async function () {
      const { airbroFactorySMCampaign, testNftCollection, testToken, airBro1155NftMint } = await this.loadFixture(
        integrationsSMCampaignFixture,
      );
      this.airbroFactorySMCampaign = airbroFactorySMCampaign;
      this.testNftCollection = testNftCollection;
      this.testToken = testToken;
      this.test1155NftCollection = airBro1155NftMint;
    });

    AirbroFactorySMCampaignShouldBehaveLikeFactory();
    AirbroFactorySMCampaignShouldChangeAdminInAllAirDrops();
    AirbroFactorySMCampaignShouldAirDropExistingToken();
    AirbroFactorySMCampaignShouldAirDropNewToken();
    AirbroFactorySMCampaignShouldAirdropExisting1155NftDropSMCampaign();
  });
});
