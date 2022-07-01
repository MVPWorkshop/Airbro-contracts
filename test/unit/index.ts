import { ethers, network, waffle } from "hardhat";
import { Mocks, Signers } from "../shared/types";

import {contractAdminAddress } from "../shared/constants";
import { integrationsFixture, unitTokenDropFixture, unitExisting1155NFTDropFixture, unitExistingTokenDropFixture, unitItemNFTDropFixture, unitNFTDropFixture, unitExistingTokenDrop1155Fixture, integrations1155HolderFixture, unitExisting1155NFTDrop1155Fixture, unitTokenDrop1155Fixture } from "../shared/fixtures";

import { shouldBeCorrectAdmin } from "./AirbroFactory/AirbroFactoryShouldBeCorrectAdmin.spec";
import { shouldChangeAdminAddress } from "./AirbroFactory/AirbroFactoryShouldChangeAdmin.spec";
import { TokenDropShouldDeploy } from "./airdrops/TokenDrop/TokenDropShouldBeDeployed.spec";
import { TokenDropShouldSetMerkleRoot } from "./airdrops/TokenDrop/TokenDropShouldSetMerkleRoot.spec";
import { NFTDropShouldDeploy } from "./airdrops/NFTDrop/NFTDropShouldBeDeployed.spec";
import { NFTDropShouldSetMerkleRoot } from "./airdrops/NFTDrop/NFTDropShouldSetMerkleRoot.spec";
import { ItemNFTDropShouldDeploy } from "./airdrops/ItemNFTDrop/ItemNFTDropShouldBeDeployed.spec";
import { ItemNFTDropShouldSetMerkleRoot } from "./airdrops/ItemNFTDrop/ItemNFTDropShouldSetMerkleRoot.spec";
import { ExistingTokenDropShouldDeploy } from "./airdrops/ExistingTokenDrop/ExistingTokenDropShouldBeDeployed.spec";
import { Existing1155NftDropShouldSetMerkleRoot } from "./airdrops/Existing1155NftDrop/Existing1155NftDropShouldSetMerkleRoot.spec";
import { Existing1155NftDropShouldDeploy } from "./airdrops/Existing1155NftDrop/Existing1155NftDropShouldBeDeployed.spec";
import { ExistingTokenDropShouldSetMerkleRoot } from "./airdrops/ExistingTokenDrop/ExistingTokenDropShouldSetMerkleRoot.spec";

import { AirbroFactory1155HolderShouldBeCorrectAdmin } from "./AirbroFactory1155Holder/AirbroFactoryShouldBeCorrectAdmin.spec";
import { AirbroFactory1155HolderShouldChangeAdminAddress } from "./AirbroFactory1155Holder/AirbroFactoryShouldChangeAdmin.spec";
import { Existing1155NftDrop1155ShouldSetMerkleRoot } from "./airdrops1155Holder/Existing1155NftDrop1155/Existing1155NftDrop1155ShouldSetMerkleRoot.spec";
import { Existing1155NftDrop1155ShouldDeploy } from "./airdrops1155Holder/Existing1155NftDrop1155/Existing1155NftDrop1155ShouldBeDeployed.spec";
import { Existing1155NftDrop1155ShouldClaimReward } from "./airdrops1155Holder/Existing1155NftDrop1155/Existing1155NftDrop1155ShouldClaimReward.spec";
import { ExistingTokenDrop1155ShouldDeploy } from "./airdrops1155Holder/ExistingTokenDrop1155/ExistingTokenDrop1155ShouldBeDeployed.spec";
import { ExistingTokenDrop1155ShouldSetMerkleRoot } from "./airdrops1155Holder/ExistingTokenDrop1155/ExistingTokenDrop1155ShouldSetMerkleRoot.spec";
import { TokenDrop1155ShouldDeploy } from "./airdrops1155Holder/TokenDrop1155/TokenDrop1155ShouldBeDeployed.spec";
import { TokenDrop1155ShouldSetMerkleRoot } from "./airdrops1155Holder/TokenDrop1155/TokenDrop1155ShouldSetMerkleRoot.spec";


describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;
    
    const signers= waffle.provider.getWallets();
    this.signers.deployer = signers[0];
    this.signers.alice = signers[1];
    this.signers.bob = signers[2];
    this.signers.jerry = signers[3];
    this.signers.lisa = signers[4];
    this.signers.peter = signers[5];

    // console.log("alice: " + this.signers.alice.address);
    // console.log("bob: " + this.signers.bob.address);
    // console.log("jerry: " + this.signers.jerry.address);
    // console.log("lisa: " + this.signers.lisa.address);
    // console.log("peter: " + this.signers.peter.address);

    // sending eth to the backend wallet address from the hardhat account of index 3
    await signers[6].sendTransaction({
      to: contractAdminAddress,
      value: ethers.utils.parseEther("5000")
    })
    
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [contractAdminAddress],
    });
    
    this.signers.backendWallet = await ethers.getSigner(contractAdminAddress);

    this.loadFixture = waffle.createFixtureLoader(signers);
  });


describe("Airbro - ERC721 Holder", function () {

  describe('AirbroFactory',() => {
    beforeEach(async function() {
      const { airbroFactory } = await this.loadFixture(integrationsFixture)
      this.airbroFactory = airbroFactory;

    })

    shouldBeCorrectAdmin()
    shouldChangeAdminAddress()
  })
  
  describe('Existing1155NftDrop',()=>{
    beforeEach(async function(){
      const { existing1155NftDrop, mockAirBroFactory } = await this.loadFixture(unitExisting1155NFTDropFixture);
      this.existing1155NFTDrop = existing1155NftDrop;

      this.mocks = {} as Mocks;
      this.mocks.mockAirBroFactory = mockAirBroFactory;

    })
    
    Existing1155NftDropShouldDeploy();
    Existing1155NftDropShouldSetMerkleRoot();
    
  })
  
  describe('ExistingTokenDrop',()=>{
    beforeEach(async function(){
      const { existingTokenDrop, mockAirBroFactory } = await this.loadFixture(unitExistingTokenDropFixture);
      this.existingTokenDrop = existingTokenDrop;

      this.mocks = {} as Mocks;
      this.mocks.mockAirBroFactory = mockAirBroFactory;

    })
    
    ExistingTokenDropShouldDeploy();
    ExistingTokenDropShouldSetMerkleRoot();
    
  })
  
  describe('ItemNFTDrop',()=>{
    beforeEach(async function(){
      const { itemNFTDrop, mockAirBroFactory } = await this.loadFixture(unitItemNFTDropFixture);
      this.itemNFTDrop = itemNFTDrop;

      this.mocks = {} as Mocks;
      this.mocks.mockAirBroFactory = mockAirBroFactory;

    })
    
    ItemNFTDropShouldDeploy();
    ItemNFTDropShouldSetMerkleRoot();
    
  })
  
  describe('NFTDrop',()=>{
    beforeEach(async function(){
      const { nftDrop, mockAirBroFactory } = await this.loadFixture(unitNFTDropFixture);
      this.nftDrop = nftDrop;

      this.mocks = {} as Mocks;
      this.mocks.mockAirBroFactory = mockAirBroFactory;

    })
    
    NFTDropShouldDeploy();
    NFTDropShouldSetMerkleRoot();
    
  })
  
  describe('TokenDrop',()=>{
    beforeEach(async function(){
      const { tokenDrop, mockAirBroFactory } = await this.loadFixture(unitTokenDropFixture);
      this.tokenDrop = tokenDrop;

      this.mocks = {} as Mocks;
      this.mocks.mockAirBroFactory = mockAirBroFactory;
    })
    
    
    TokenDropShouldDeploy();
    TokenDropShouldSetMerkleRoot();

  })

})

describe("Airbro - ERC1155 Holder", function () {

  describe('AirbroFactory1155holder', ()=>{
    beforeEach(async function(){
      const { airbroFactory1155Holder } = await this.loadFixture(integrations1155HolderFixture)

      this.airbroFactory1155Holder = airbroFactory1155Holder;

    })

    // AirbroFactory1155HolderShouldBeCorrectAdmin();
    // AirbroFactory1155HolderShouldChangeAdminAddress();
  })

  describe('ExistingNft1155Drop1155',()=>{
    beforeEach(async function(){
      const { existing1155NftDrop1155, mockAirBroFactory1155Holder } = await this.loadFixture(unitExisting1155NFTDrop1155Fixture)

      this.existing1155NFTDrop1155 = existing1155NftDrop1155;

      this.mocks = {} as Mocks;
      this.mocks.mockAirBroFactory1155Holder = mockAirBroFactory1155Holder;
    })


    Existing1155NftDrop1155ShouldDeploy();
    Existing1155NftDrop1155ShouldSetMerkleRoot();
    Existing1155NftDrop1155ShouldClaimReward();

  })

  describe('ExistingTokenDrop1155',()=>{
    beforeEach(async function(){
      const { existingTokenDrop1155, mockAirBroFactory1155Holder } = await this.loadFixture(unitExistingTokenDrop1155Fixture)

      this.existingTokenDrop1155 = existingTokenDrop1155;
      this.mocks = {} as Mocks;
      this.mocks.mockAirBroFactory1155Holder = mockAirBroFactory1155Holder;
    })


    ExistingTokenDrop1155ShouldDeploy();
    ExistingTokenDrop1155ShouldSetMerkleRoot();

  })

  describe('TokenDrop1155',()=>{
    beforeEach(async function(){
      const { tokenDrop1155, mockAirBroFactory1155Holder } = await this.loadFixture(unitTokenDrop1155Fixture)

      this.tokenDrop1155 = tokenDrop1155;

      this.mocks = {} as Mocks;
      this.mocks.mockAirBroFactory1155Holder = mockAirBroFactory1155Holder;
    })


    TokenDrop1155ShouldDeploy();
    TokenDrop1155ShouldSetMerkleRoot();
  })
  
}) 

});
