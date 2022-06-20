import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import { contractAdminAddress } from "../shared/constants";

import type { TestNftCollection } from "../../src/types/contracts/mocks/TestNftCollection";
import type { TestToken } from "../../src/types/contracts/mocks/TestToken";

import { Signers } from "../shared/types";

import { shouldBehaveLikeFactory } from "./Factory.behavior.spec";
import { shouldAirdropExisting1155token } from "./AirBro1155NftMint.spec";
import { integrationsFixture } from "../shared/fixtures";

const randomAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
describe("Integration tests", function () {
  before(async function () {
    this.signers = {} as Signers;
    
    const signers = waffle.provider.getWallets()
    
    this.signers.deployer = signers[0];
    this.signers.alice = signers[1];
    this.signers.bob = signers[2]
    this.signers.backendWallet = await ethers.getSigner(contractAdminAddress);

    this.loadFixture = waffle.createFixtureLoader(signers)
  });
  
  describe("AirbroFactory",  ()=> {
    beforeEach(async function () {
      const { airbroFactory, testNftCollection, testToken } = await this.loadFixture(integrationsFixture)
      this.airbroFactory = airbroFactory;
      this.testNftCollection = testNftCollection;
      this.testToken = testToken;

    });
    
    shouldBehaveLikeFactory()
    shouldAirdropExisting1155token()
  });
  
});
