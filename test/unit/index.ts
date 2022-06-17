import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";


import type { Existing1155NftDrop, ExistingTokenDrop, ItemNFTDrop, NFTDrop, TokenDrop } from "../../src/types/contracts/airdrops/index"
import { Signers } from "../shared/types";

import { airdropTests } from "./airdropTests.spec";

const randomAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';


describe("Tests", function () {
    before(async function () {
      this.signers = {} as Signers;
      
      const signers: SignerWithAddress[] = await ethers.getSigners();
      this.signers.admin = signers[0];
      this.signers.alice = signers[1];
      this.signers.bob = signers[2];
      this.signers.backendWallet = signers[3];
    });
    
    describe('airdrops unit tests',()=>{
      beforeEach(async function(){
        const Existing1155NftDropArtifact: Artifact = await artifacts.readArtifact("Existing1155NftDrop");
        const ExistingTokenDropArtifact: Artifact = await artifacts.readArtifact("ExistingTokenDrop");
        const ItemNFTDropArtifact: Artifact = await artifacts.readArtifact("ItemNFTDrop");
        const NFTDropArtifact: Artifact = await artifacts.readArtifact("NFTDrop");
        const TokenDropArtifact: Artifact = await artifacts.readArtifact("TokenDrop");
        this.Existing1155NftDrop =<Existing1155NftDrop> await waffle.deployContract(this.signers.admin,Existing1155NftDropArtifact,[randomAddress,randomAddress,2,2,2,2])
        this.ExistingTokenDrop =<ExistingTokenDrop> await waffle.deployContract(this.signers.admin,ExistingTokenDropArtifact,[randomAddress,2,randomAddress,2,2])
        this.ItemNFTDrop =<ItemNFTDrop> await waffle.deployContract(this.signers.admin,ItemNFTDropArtifact,[randomAddress,2,'eee','0x00',1])
        this.NFTDrop =<NFTDrop> await waffle.deployContract(this.signers.admin,NFTDropArtifact,[randomAddress,2,'e','e','e',2])
        this.TokenDrop =<TokenDrop> await waffle.deployContract(this.signers.admin,TokenDropArtifact,[randomAddress,2,'eee','ee',2])
      })
      
      airdropTests();
    })
  });
