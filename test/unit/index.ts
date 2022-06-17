import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import {contractAdminAddress } from "../shared/constants";

import type { Existing1155NftDrop, ExistingTokenDrop, ItemNFTDrop, NFTDrop, TokenDrop } from "../../src/types/contracts/airdrops/index"
import { Signers } from "../shared/types";

import { airdropTests } from "./airdropTests.spec";

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

const randomAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';


describe("Unit tests", function () {
    before(async function () {
      this.signers = {} as Signers;
      
      const signers: SignerWithAddress[] = await ethers.getSigners();
      this.signers.deployer = signers[0];
      this.signers.alice = signers[1];
      this.signers.bob = signers[2];
      this.signers.backendWallet = await ethers.getSigner(contractAdminAddress);

    });
    
describe('Existing1155NftDrop',()=>{
    beforeEach(async function(){
      const Existing1155NftDropArtifact: Artifact = await artifacts.readArtifact("Existing1155NftDrop");
      this.Existing1155NftDrop =<Existing1155NftDrop> await waffle.deployContract(this.signers.deployer,Existing1155NftDropArtifact,[randomAddress,randomAddress,2,2,2,2])
      })

      Existing1155NftDropShouldDeploy();
      Existing1155NftDropShouldChangeAdmin();
      Existing1155NftDropShouldSetMerkleRoot();
  
    })

describe('ExistingTokenDrop',()=>{
        beforeEach(async function(){
          const ExistingTokenDropArtifact: Artifact = await artifacts.readArtifact("ExistingTokenDrop");
          this.ExistingTokenDrop =<ExistingTokenDrop> await waffle.deployContract(this.signers.deployer,ExistingTokenDropArtifact,[randomAddress,2,randomAddress,2,2])
        })

      ExistingTokenDropShouldDeploy();
      ExistingTokenDropShouldChangeAdmin();
      ExistingTokenDropShouldSetMerkleRoot();

    })

describe('ItemNFTDrop',()=>{
          beforeEach(async function(){
            const ItemNFTDropArtifact: Artifact = await artifacts.readArtifact("ItemNFTDrop");
            this.ItemNFTDrop =<ItemNFTDrop> await waffle.deployContract(this.signers.deployer,ItemNFTDropArtifact,[randomAddress,2,'eee','0x00',1])
          })

      ItemNFTDropShouldDeploy();
      ItemNFTDropShouldChangeAdmin();
      ItemNFTDropShouldSetMerkleRoot();

    })

describe('NFTDrop',()=>{
            beforeEach(async function(){
              const NFTDropArtifact: Artifact = await artifacts.readArtifact("NFTDrop");
              this.NFTDrop =<NFTDrop> await waffle.deployContract(this.signers.deployer,NFTDropArtifact,[randomAddress,2,'e','e','e',2])
            })

      NFTDropShouldDeploy();
      NFTDropShouldChangeAdmin();
      NFTDropShouldSetMerkleRoot();

    })

describe('TokenDrop',()=>{
              beforeEach(async function(){
                const TokenDropArtifact: Artifact = await artifacts.readArtifact("TokenDrop");
                this.TokenDrop =<TokenDrop> await waffle.deployContract(this.signers.deployer,TokenDropArtifact,[randomAddress,2,'eee','ee',2])
              })
      
      
              TokenDropShouldDeploy();
              TokenDropShouldChangeAdmin();
              TokenDropShouldSetMerkleRoot();
      
            })


  });
