import { ethers, waffle, network } from "hardhat";
import { contractAdminAddress } from "../shared/constants";

import { Signers } from "../shared/types";

import { shouldBehaveLikeFactory } from "./AirBroDropCreationShouldEmitEvent.spec";
import { shouldChangeAdminInAllAirDrops } from "./AirBroFactoryShouldChangeAdmin.spec";
import { shouldAirDropExistingToken } from "./AirBroExistingTokenDrop.spec";
import { shouldAirDropNewToken } from "./AirBroTokenDrop.spec";
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
    // this.signers.backendWallet = await ethers.getSigner(contractAdminAddress);

    // sending eth to the backend wallet address from the hardhat account of index 3
    await signers[4].sendTransaction({
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
  
  describe("AirbroFactory",  ()=> {
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
    shouldAirdropExisting1155token()
  });
  
});
