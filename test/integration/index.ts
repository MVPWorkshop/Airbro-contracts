import { ethers, waffle, network } from "hardhat";
import { contractAdminAddress } from "../shared/constants";

import { Signers } from "../shared/types";

import { shouldBehaveLikeFactory } from "./AirBro/AirBroDropCreationShouldBehaveLikeFactory.spec";
import { shouldChangeAdminInAllAirDrops } from "./AirBro/AirBroFactoryShouldChangeAdmin.spec";
import { shouldAirDropExistingToken } from "./AirBro/AirBroExistingTokenDrop.spec";
import { shouldAirDropNewToken } from "./AirBro/AirBroTokenDrop.spec";
import { shouldAirdropExisting1155NftDrop } from "./AirBro/AirBroExisting1155NftDrop.spec";
import { integrationsFixture } from "../shared/fixtures";

import { AirbroFactory1155ShouldBehaveLikeFactory } from "./AirBro1155Holder/AirBroDropCreation1155ShouldBehaveLikeFactory.spec";
import { AirbroFactory1155HolderShouldChangeAdminInAllAirDrops } from "./AirBro1155Holder/AirBroFactory1155HolderShouldChangeAdmin.spec";
import { AirbroFactory1155HolderShouldAirdropExisting1155NftDrop1155 } from "./AirBro1155Holder/AirBroExisting1155NftDrop1155.spec";
import { integrations1155HolderFixture } from "../shared/fixtures";
import { AirbroFactory1155HolderShouldAirDropExistingToken } from "./AirBro1155Holder/AirBroExistingTokenNftDrop1155.spec";
import { AirbroFactory1155HolderShouldAirDropNewToken } from "./AirBro1155Holder/AirBroTokenNftDrop1155.spec";


const randomAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
describe("Integration tests", function () {
  before(async function () {
    this.signers = {} as Signers;
    
    const signers = waffle.provider.getWallets()
    
    this.signers.deployer = signers[0];
    this.signers.alice = signers[1];
    this.signers.bob = signers[2]
    this.signers.jerry = signers[3]
    this.signers.lisa = signers[4]
    this.signers.backendWallet = await ethers.getSigner(contractAdminAddress);

    // sending eth to the backend wallet address from the hardhat account of index 4
    await signers[5].sendTransaction({
      to: contractAdminAddress,
      value: ethers.utils.parseEther("5000")
    })
    
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [contractAdminAddress],
    });
    
    this.signers.backendWallet = await ethers.getSigner(contractAdminAddress);


    this.loadFixture = waffle.createFixtureLoader(signers)
  });
  
  describe("AirbroFactory", ()=> {
    beforeEach(async function () {
      const { airbroFactory, testNftCollection, testToken, airBro1155NftMint } = await this.loadFixture(integrationsFixture)
      this.airbroFactory = airbroFactory;
      this.testNftCollection = testNftCollection;
      this.testToken = testToken;
      this.test1155NftCollection = airBro1155NftMint;

    });
    
    shouldBehaveLikeFactory();
    shouldChangeAdminInAllAirDrops();
    shouldAirDropExistingToken();
    shouldAirDropNewToken();
    shouldAirdropExisting1155NftDrop()
  });

  describe("AirbroFactory1155Holder", ()=> {
    beforeEach(async function () {
      const { airbroFactory1155Holder, testNftCollection, testToken, airBro1155NftMint } = await this.loadFixture(integrations1155HolderFixture)
      this.airbroFactory1155Holder = airbroFactory1155Holder;
      this.testNftCollection = testNftCollection;
      this.testToken = testToken;
      this.test1155NftCollection = airBro1155NftMint;

    });
    
    AirbroFactory1155ShouldBehaveLikeFactory();
    AirbroFactory1155HolderShouldChangeAdminInAllAirDrops();
    AirbroFactory1155HolderShouldAirDropExistingToken();
    AirbroFactory1155HolderShouldAirDropNewToken();
    AirbroFactory1155HolderShouldAirdropExisting1155NftDrop1155()
  });
  
});
