import { expect } from "chai";
import { ethers } from "hardhat";


export function shouldAirdropExisting1155NftDrop(){
    const bytes32MerkleRootHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

    it('should mint and drop existing IERC1155 NFT token',async function(){
        // minting an NFT's to alice and bob. Both addresses should receive a reward for holding this NFT collection
        await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.alice.address);
        await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.bob.address);
        await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);
        
        const aliceBalance = await this.testNftCollection.balanceOf(this.signers.alice.address)
        // console.log(`Test NFT balance of Alice: ${parseInt(aliceBalance)}`);
        expect(aliceBalance).to.be.equal(1)
        
        const bobBalance = await this.testNftCollection.balanceOf(this.signers.bob.address)
        // console.log(`Test NFT balance of Bob: ${parseInt(bobBalance)}`);
        expect(bobBalance).to.be.equal(1)



        // minting the admin an amount of 2000 1155 nft's
        const idOf1155:string = 'nftAirdrop';
        const fullAmountof1155:number = 2000;
        const amounOft1155:number = 1000;
        const tokenId:number = 1; // token id set to 1

        await this.test1155NftCollection.connect(this.signers.deployer).mint(idOf1155,fullAmountof1155); // deployer minting 2000 nfts
        const adminBalance1155 = await this.test1155NftCollection.balanceOf(this.signers.deployer.address,tokenId)
        // console.log(`Admin's 1155Nft balance: ${parseInt(adminBalance1155)}`);
        expect(adminBalance1155).to.be.equal(2000)

        const tokensPerClaim:number = 1;
        const durationInDays:number = 1;

        // dropping the existing 1155 tokens to holders
        await expect(await this.airbroFactory.connect(this.signers.deployer).dropExisting1155NftsToNftHolders(
            this.testNftCollection.address,
            this.test1155NftCollection.address,
            tokensPerClaim,
            tokenId,
            amounOft1155,
            durationInDays
        )).to.emit(this.airbroFactory,'NewAirdrop')


        // getting the deployed airdrop contract found at the 0th index in the airdrops array of AirbroFactory.sol
        const existingDropFactory = await ethers.getContractFactory("Existing1155NftDrop");
        const dropContract = existingDropFactory.attach(await this.airbroFactory.airdrops(0));


        //funding our airdrop contract with existing 1155 nfts
        await expect(this.test1155NftCollection.connect(this.signers.deployer).setApprovalForAll(dropContract.address,true)).to.emit(this.test1155NftCollection,'ApprovalForAll')
        await expect(dropContract.fundAirdrop()).to.emit(dropContract,'AirdropFunded')

        const blockNumBefore = await ethers.provider.getBlockNumber();
        const blockBefore = await ethers.provider.getBlock(blockNumBefore);
        expect(await dropContract.airdropFundBlockTimestamp()).to.be.equal(blockBefore.timestamp);

        await expect(dropContract.fundAirdrop()).to.be.revertedWith('AlreadyFunded')
        await expect(dropContract.connect(this.signers.bob).fundAirdrop()).to.be.revertedWith('InsufficientAmount')

        expect(await this.test1155NftCollection.balanceOf(dropContract.address,tokenId)).to.be.equal(1000) //our airdrop contract now has 1000 x nft1155 of id 1
        expect(await this.test1155NftCollection.balanceOf(this.signers.deployer.address, tokenId)).to.be.equal(1000)


        // alice withdrawing 1155 on basis of owning nft with id of 1
        const _alice_nft_id = 0; 
        const _bob_nft_id = 1;
        const _admin_nft_id = 2;

        var leftoverNftAmount:number = amounOft1155;

        await expect(dropContract.connect(this.signers.alice).claim(_bob_nft_id,[])).to.be.revertedWith("NotOwner") // Alice trying to claim based on Bob's NFT id which she does not own

        await expect(dropContract.connect(this.signers.alice).claim(_alice_nft_id,[])).to.emit(dropContract,"Claimed")
        leftoverNftAmount = leftoverNftAmount - tokensPerClaim;
        expect(await this.test1155NftCollection.balanceOf(this.signers.alice.address,1)).to.be.equal(1)
        await expect(dropContract.connect(this.signers.alice).claim(_alice_nft_id,[])).to.be.revertedWith("AlreadyRedeemed") // error - 'ERC721: owner query for nonexistent token' 

        
        // alice withdrawing 1155 on basis of owning nft with id of 1
        await expect(dropContract.connect(this.signers.bob).claim(_admin_nft_id,[])).to.be.revertedWith("NotOwner") // Bob trying to claim based on Admins's NFT id he does not own

        await expect(dropContract.connect(this.signers.bob).claim(_bob_nft_id,[])).to.emit(dropContract,"Claimed")
        leftoverNftAmount = leftoverNftAmount - tokensPerClaim;
        expect(await this.test1155NftCollection.balanceOf(this.signers.bob.address,1)).to.be.equal(1)
        await expect(dropContract.connect(this.signers.bob).claim(_bob_nft_id,[])).to.be.revertedWith("AlreadyRedeemed") // error - 'ERC721: owner query for nonexistent token' 


        // airdropFunds provider withdrawing their leftover funds after the airdrop has finished
        await expect(dropContract.connect(this.signers.deployer).withdrawAirdropFunds()).to.be.revertedWith('AirdropStillInProgress');

        const oneWeek = 604800;
        
        await ethers.provider.send("evm_increaseTime", [oneWeek]); // add one week worth of seconds
        
        await expect(dropContract.connect(this.signers.bob).withdrawAirdropFunds()).to.be.revertedWith('NotOwner');

        const balanceBeforeWithdraw =  await this.test1155NftCollection.balanceOf(this.signers.deployer.address, tokenId);
        await dropContract.connect(this.signers.deployer).withdrawAirdropFunds();
        const balanceAfterWithdraw =  await this.test1155NftCollection.balanceOf(this.signers.deployer.address, tokenId);

        expect(balanceAfterWithdraw.toNumber()).to.be.equal(balanceBeforeWithdraw.toNumber() + leftoverNftAmount);


    })
}