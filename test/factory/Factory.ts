import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { AirbroFactory } from "../../src/types/contracts/AirbroFactory";
import type { TestNftCollection } from "../../src/types/contracts/TestNftCollection";
import type { TestToken } from "../../src/types/contracts/TestToken";
import { Signers } from "../types";
import { shouldBehaveLikeFactory } from "./Factory.behavior";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("AirbroFactory", function () {
    beforeEach(async function () {
      const factoryArtifact: Artifact = await artifacts.readArtifact("AirbroFactory");
      const testNftArtifact: Artifact = await artifacts.readArtifact("TestNftCollection");
      const testTokenArtifact: Artifact = await artifacts.readArtifact("TestToken");
      this.airbroFactory = <AirbroFactory>await waffle.deployContract(this.signers.admin, factoryArtifact, []);
      this.testNftCollection = <TestNftCollection>await waffle.deployContract(this.signers.admin, testNftArtifact, []);
      this.testToken = <TestToken>await waffle.deployContract(this.signers.admin, testTokenArtifact, []);
    });

    shouldBehaveLikeFactory();

  });
});
