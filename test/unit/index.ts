import { ethers, network, waffle } from "hardhat";
import { Mocks, Signers } from "../shared/types";

import {contractAdminAddress } from "../shared/constants";
import { integrationsFixture, unitTokenDropFixture, unitExisting1155NFTDropFixture, unitExistingTokenDropFixture, unitItemNFTDropFixture, unitNFTDropFixture, unitExistingTokenDrop1155Fixture } from "../shared/fixtures";

import { shouldBeCorrectAdmin } from "./AirbroFactory/AirbroFactoryShouldBeCorrectAdmin.spec";
import { shouldChangeAdminAddress } from "./AirbroFactory/AirbroFactoryShouldChangeAdmin.spec";
import { TokenDropShouldDeploy } from "./TokenDrop/TokenDropShouldBeDeployed.spec";
import { TokenDropShouldSetMerkleRoot } from "./TokenDrop/TokenDropShouldSetMerkleRoot.spec";
import { NFTDropShouldDeploy } from "./NFTDrop/NFTDropShouldBeDeployed.spec";
import { NFTDropShouldSetMerkleRoot } from "./NFTDrop/NFTDropShouldSetMerkleRoot.spec";
import { ItemNFTDropShouldDeploy } from "./ItemNFTDrop/ItemNFTDropShouldBeDeployed.spec";
import { ItemNFTDropShouldSetMerkleRoot } from "./ItemNFTDrop/ItemNFTDropShouldSetMerkleRoot.spec";
import { ExistingTokenDropShouldDeploy } from "./ExistingTokenDrop/ExistingTokenDropShouldBeDeployed.spec";
import { Existing1155NftDropShouldSetMerkleRoot } from "./Existing1155NftDrop/Existing1155NftDropShouldSetMerkleRoot.spec";
import { Existing1155NftDropShouldDeploy } from "./Existing1155NftDrop/Existing1155NftDropShouldBeDeployed.spec";
import { ExistingTokenDropShouldSetMerkleRoot } from "./ExistingTokenDrop/ExistingTokenDropShouldSetMerkleRoot.spec";
import { ExistingTokenDrop1155ShouldDeploy } from "./ExistingTokenDrop1155/ExistingTokenDrop1155ShouldBeDeployed.spec";
import { ExistingTokenDrop1155ShouldSetMerkleRoot } from "./ExistingTokenDrop1155/ExistingTokenDrop1155ShouldSetMerkleRoot.spec";


describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;
    
    const signers= waffle.provider.getWallets();
    this.signers.deployer = signers[0];
    this.signers.alice = signers[1];
    this.signers.bob = signers[2];
    
    // sending eth to the backend wallet address from the hardhat account of index 3
    await signers[3].sendTransaction({
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

  /* airdrops1155Holder */
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
  

});
