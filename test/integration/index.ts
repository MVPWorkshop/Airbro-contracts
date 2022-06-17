import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { contractAdminAddress } from "../shared/constants";

import type { AirbroFactory } from "../../src/types/contracts/AirbroFactory";
import type { TestNftCollection } from "../../src/types/contracts/mocks/TestNftCollection";
import type { TestToken } from "../../src/types/contracts/mocks/TestToken";

import { Signers } from "../shared/types";

import { shouldBehaveLikeFactory } from "./Factory.behavior.spec";

const randomAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
describe("Integration tests", function () {
  before(async function () {
    this.signers = {} as Signers;
    
    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.deployer = signers[0];
    this.signers.alice = signers[1];
    this.signers.bob = signers[2]
    this.signers.backendWallet = await ethers.getSigner(contractAdminAddress);
  });
  
  describe("AirbroFactory",  ()=> {
    beforeEach(async function () {
      const factoryArtifact: Artifact = await artifacts.readArtifact("AirbroFactory");
      const testNftArtifact: Artifact = await artifacts.readArtifact("TestNftCollection");
      const testTokenArtifact: Artifact = await artifacts.readArtifact("TestToken");
      this.airbroFactory = <AirbroFactory>await waffle.deployContract(this.signers.deployer, factoryArtifact, []);
      this.testNftCollection = <TestNftCollection>await waffle.deployContract(this.signers.deployer, testNftArtifact, []);
      this.testToken = <TestToken>await waffle.deployContract(this.signers.deployer, testTokenArtifact, []);
    });
    
    shouldBehaveLikeFactory()
  });
  
});
