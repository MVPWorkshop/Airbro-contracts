import { artifacts, ethers, network, waffle } from "hardhat";
import { Signers } from "../shared/types";

import {contractAdminAddress } from "../shared/constants";
import { integrationsFixture, unitTokenDropFixture, unitExisting1155NFTDropFixture, unitExistingTokenDropFixture, unitItemNFTDropFixture, unitNFTDropFixture } from "../shared/fixtures";

import { shouldBeCorrectAdmin } from "./AirbroFactory/AirbroFactoryShouldBeCorrectAdmin.spec";
import { shouldChangeAdminAddress } from "./AirbroFactory/AirbroFactoryShouldChangeAdmin.spec";
import { TokenDropShouldDeploy } from "./TokenDrop/TokenDropShouldBeDeployed.spec";
import { TokenDropShouldChangeAdmin } from "./TokenDrop/TokenDropShouldChangeAdmin.spec";
import { TokenDropShouldSetMerkleRoot } from "./TokenDrop/TokenDropShouldSetMerkleRoot.spec";
import { NFTDropShouldDeploy } from "./NFTDrop/NFTDropShouldBeDeployed.spec";
import { NFTDropShouldChangeAdmin } from "./NFTDrop/NFTDropShouldChangeAdmin.spec";
import { NFTDropShouldSetMerkleRoot } from "./NFTDrop/NFTDropShouldSetMerkleRoot.spec";
import { ItemNFTDropShouldDeploy } from "./ItemNFTDrop/ItemNFTDropShouldBeDeployed.spec";
import { ItemNFTDropShouldChangeAdmin } from "./ItemNFTDrop/ItemNFTDropShouldChangeAdmin.spec";
import { ItemNFTDropShouldSetMerkleRoot } from "./ItemNFTDrop/ItemNFTDropShouldSetMerkleRoot.spec";
import { ExistingTokenDropShouldDeploy } from "./ExistingTokenDrop/ExistingTokenDropShouldBeDeployed.spec";
import { ExistingTokenDropShouldChangeAdmin } from "./ExistingTokenDrop/ExistingTokenDropShouldChangeAdmin.spec";
import { Existing1155NftDropShouldSetMerkleRoot } from "./Existing1155NftDrop/Existing1155NftDropShouldSetMerkleRoot.spec";
import { Existing1155NftDropShouldDeploy } from "./Existing1155NftDrop/Existing1155NftDropShouldBeDeployed.spec";
import { ExistingTokenDropShouldSetMerkleRoot } from "./ExistingTokenDrop/ExistingTokenDropShouldSetMerkleRoot.spec";
import { Existing1155NftDropShouldChangeAdmin } from "./Existing1155NftDrop/Existing1155NftDropShouldChangeAdmin.spec";




const randomAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';


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
      const { existing1155NftDrop } = await this.loadFixture(unitExisting1155NFTDropFixture);
      this.existing1155NFTDrop = existing1155NftDrop;

    })
    
    Existing1155NftDropShouldDeploy();
    Existing1155NftDropShouldChangeAdmin();
    Existing1155NftDropShouldSetMerkleRoot();
    
  })
  
  describe('ExistingTokenDrop',()=>{
    beforeEach(async function(){
      const { existingTokenDrop } = await this.loadFixture(unitExistingTokenDropFixture);
      this.existingTokenDrop = existingTokenDrop;

    })
    
    ExistingTokenDropShouldDeploy();
    ExistingTokenDropShouldChangeAdmin();
    ExistingTokenDropShouldSetMerkleRoot();
    
  })
  
  describe('ItemNFTDrop',()=>{
    beforeEach(async function(){
      const { itemNFTDrop } = await this.loadFixture(unitItemNFTDropFixture);
      this.itemNFTDrop = itemNFTDrop;

    })
    
    ItemNFTDropShouldDeploy();
    ItemNFTDropShouldChangeAdmin();
    ItemNFTDropShouldSetMerkleRoot();
    
  })
  
  describe('NFTDrop',()=>{
    beforeEach(async function(){
      const { nftDrop } = await this.loadFixture(unitNFTDropFixture);
      this.nftDrop = nftDrop;

    })
    
    NFTDropShouldDeploy();
    NFTDropShouldChangeAdmin();
    NFTDropShouldSetMerkleRoot();
    
  })
  
  describe('TokenDrop',()=>{
    beforeEach(async function(){
      const { tokenDrop } = await this.loadFixture(unitTokenDropFixture);
      this.tokenDrop = tokenDrop;
    })
    
    
    TokenDropShouldDeploy();
    TokenDropShouldChangeAdmin();
    TokenDropShouldSetMerkleRoot();

  })
  

});
