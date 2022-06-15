import { expect } from "chai";

import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { AirBro1155NftMint } from "../../src/types/contracts/Airbro1155NftMint.sol/AirBro1155NftMint";

export function shouldAirdropExisting1155token(){
    const bytes32MerkleRootHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

    beforeEach(async function(){
        // deploying test1155Nft contract (reward token) - folder structure should be updated later
        const AirBro1155NftMintArtifact:Artifact = await artifacts.readArtifact("AirBro1155NftMint");
        this.test1155NftCollection = <AirBro1155NftMint>await waffle.deployContract(this.signers.admin, AirBro1155NftMintArtifact, []);
    })

    it('should mint and drop existing IERC1155 NFT token',async function(){
        // minting three NFT's to alice. Alice should receive a reward for holding this NFT collection
        await this.testNftCollection.connect(this.signers.admin).safeMint(this.signers.alice.address);
        
        const aliceBalance = await this.testNftCollection.balanceOf(this.signers.alice.address)
        console.log(`Test NFT balance of Alice: ${parseInt(aliceBalance)}`);
        expect(aliceBalance).to.be.equal(1)

        // minting the admin a amount of 1000 1155 nft's
        const idOf1155:string = 'nftAirdrop';
        const amounOft1155:number = 1000;
        const tokenId:number = 1; // token id set to 1

        await this.test1155NftCollection.connect(this.signers.admin).mint(idOf1155,amounOft1155);
        const adminBalance1155 = await this.test1155NftCollection.balanceOf(this.signers.admin.address,tokenId)
        console.log(`Admin's 1155Nft balance: ${parseInt(adminBalance1155)}`);
        expect(adminBalance1155).to.be.equal(1000)

        const tokensPerClaim:number = 1;
        const durationInDays:number = 1;

        // dropping the existing 1155 tokens to holders
        await expect(await this.airbroFactory.connect(this.signers.admin).dropExisting1155NftsToNftHolders(
            this.testNftCollection.address,
            this.test1155NftCollection.address,
            tokensPerClaim,
            tokenId, //is this right?
            amounOft1155,
            durationInDays,
            bytes32MerkleRootHash
        )).to.emit(this.airbroFactory,'NewAirdrop')


        // getting the deployed airdrop contract found at the 0th index in the airdrops array of AirbroFactory.sol
        const existingDropFactory = await ethers.getContractFactory("Existing1155NftDrop");
        const dropContract = existingDropFactory.attach(await this.airbroFactory.airdrops(0));

        //funding our airdrop contract with existing 1155 nfts
        await expect(this.test1155NftCollection.connect(this.signers.admin).setApprovalForAll(dropContract.address,true)).to.emit(this.test1155NftCollection,'ApprovalForAll')
        await expect(dropContract.fundAirdrop()).to.emit(dropContract,'AirdropFunded')
        expect(await this.test1155NftCollection.balanceOf(dropContract.address,tokenId)).to.be.equal(1000) //our airdrop contract now has 1000 x nft1155 of id 1
        expect(await this.test1155NftCollection.balanceOf(this.signers.admin.address, tokenId)).to.be.equal(0)




        const _tokenId_arg = 1; // How would I know this is zero, why is it not 1 ? Not sure what is going on here.
        //changing this arg to 1 will throw the following error: 'ERC721: owner query for nonexistent token'

        await expect(dropContract.connect(this.signers.alice).claim(_tokenId_arg,[])).to.emit(dropContract,"Claimed") // error - 'ERC721: owner query for nonexistent token'
        expect(await this.test1155NftCollection.balanceOf(this.signers.alice.address,1)).to.be.equal(1)

        await expect(dropContract.connect(this.signers.alice).claim(_tokenId_arg,[])).to.be.revertedWith("AlreadyRedeemed") // error - 'ERC721: owner query for nonexistent token' 
    })
}