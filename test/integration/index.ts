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
describe("Tests", function () {
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
  
  
  // describe('/airdrops unit tests',()=>{
  //   beforeEach(async function(){
  //     const Existing1155NftDropArtifact: Artifact = await artifacts.readArtifact("Existing1155NftDrop");
  //     const ExistingTokenDropArtifact: Artifact = await artifacts.readArtifact("ExistingTokenDrop");
  //     const ItemNFTDropArtifact: Artifact = await artifacts.readArtifact("ItemNFTDrop");
  //     const NFTDropArtifact: Artifact = await artifacts.readArtifact("NFTDrop");
  //     const TokenDropArtifact: Artifact = await artifacts.readArtifact("TokenDrop");
  //     this.Existing1155NftDrop =<Existing1155NftDrop> await waffle.deployContract(this.signers.deployer,Existing1155NftDropArtifact,[randomAddress,randomAddress,2,2,2,2])
  //     this.ExistingTokenDrop =<ExistingTokenDrop> await waffle.deployContract(this.signers.deployer,ExistingTokenDropArtifact,[randomAddress,2,randomAddress,2,2])
  //     this.ItemNFTDrop =<ItemNFTDrop> await waffle.deployContract(this.signers.deployer,ItemNFTDropArtifact,[randomAddress,2,'eee','0x00',1])
  //     this.NFTDrop =<NFTDrop> await waffle.deployContract(this.signers.deployer,NFTDropArtifact,[randomAddress,2,'e','e','e',2])
  //     this.TokenDrop =<TokenDrop> await waffle.deployContract(this.signers.deployer,TokenDropArtifact,[randomAddress,2,'eee','ee',2])
  //   })
    
  //   airdropTests()
  // })
});
