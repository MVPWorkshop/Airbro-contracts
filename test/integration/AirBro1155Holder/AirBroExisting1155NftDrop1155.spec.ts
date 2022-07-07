import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs"
const { keccak256 } = ethers.utils
import { constants } from "ethers";


export function AirbroFactory1155HolderShouldAirdropExisting1155NftDrop1155(){

    it('should create new 1155 Collection and create drop for existing IERC1155 NFT token',async function(){
        // write test for totalNft1155ContractsCount
        // write test for NewNft1155Contract(address(nft1155Contract), msg.sender); event params

    
        // create new 1155 nft collection
        expect(await this.airbroFactory1155Holder.createNewNft1155Contract("ipfs://bafybeict2kq6gt4ikgulypt7h7nwj4hmfi2kevrqvnx2osibfulyy5x3hu/no-time-to-explain.jpeg"))
        .to.emit(this.airbroFactory1155Holder, "NewNft1155Contract");

        // getting the deployed Airbro1155 contract found at the 0th index in the nft1155Contracts array of AirbroFactory1155Holder.sol
        const new1155NftCollectionFactory = await ethers.getContractFactory("Airbro1155Contract");
        const collection1155 = new1155NftCollectionFactory.attach(await this.airbroFactory1155Holder.nft1155Contracts(constants.Zero));

        // creating campaign (airdrop) for Nft holders of collection1155, with reward being Nfts from other 1155 collection

        // minting the admin an amount of 2000 1155 nft's
        const idOf1155:string = 'nftAirdrop';
        const fullAmountof1155:number = 2000;
        const amounOft1155:number = 1000;
        const tokenId:number = 1; // token id set to 1

        var leftoverNftAmount:number = amounOft1155;

        await this.test1155NftCollection.connect(this.signers.deployer).mint(idOf1155,fullAmountof1155); // deployer minting 2000 nfts
        const adminBalance1155 = await this.test1155NftCollection.balanceOf(this.signers.deployer.address,tokenId)
        expect(adminBalance1155).to.be.equal(2000)

        const tokensPerClaim:number = 1;
        const durationInDays:number = 1;

        // dropping the existing 1155 tokens to holders
        await expect(await this.airbroFactory1155Holder.connect(this.signers.deployer).dropExisting1155NftsToNftHolders(
            collection1155.address,
            this.test1155NftCollection.address,
            tokensPerClaim,
            tokenId,
            amounOft1155,
            durationInDays
        )).to.emit(this.airbroFactory1155Holder,'NewAirdrop')


        // getting the deployed airdrop contract found at the 0th index in the airdrops array of AirbroFactory1155Holder.sol
        const existingDropFactory = await ethers.getContractFactory("Existing1155NftDrop1155");
        const dropContract = existingDropFactory.attach(await this.airbroFactory1155Holder.airdrops(constants.Zero));


        // alice and bob minting 1155 NFTs in order to be eligible for reward later

        // Both addresses should receive a reward later for holding these NFTs as profile pics, 
        // thus their addresses will be included in merkleRootHash
        await collection1155.connect(this.signers.alice).mint();
        await collection1155.connect(this.signers.bob).mint();
        await collection1155.connect(this.signers.jerry).mint();
        
        const aliceBalance = await collection1155.balanceOf(this.signers.alice.address, constants.Zero)
        expect(aliceBalance).to.be.equal(1)
        
        const bobBalance = await collection1155.balanceOf(this.signers.bob.address, constants.Zero)
        expect(bobBalance).to.be.equal(1)

        const jerryBalance = await collection1155.balanceOf(this.signers.jerry.address, constants.Zero)
        expect(jerryBalance).to.be.equal(1)

        
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


        //create merkleRootHash
        const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address];
        const leaves = whitelisted.map(addr => keccak256(addr))
        const merkleTree = new MerkleTree(leaves, keccak256, { sort: true })
        const roothash = merkleTree.getHexRoot();

        //backendWallet sets new merkleRootHash upon completion of the campaign (deadline has passed)
        expect(await dropContract.connect(this.signers.backendWallet).setMerkleRoot(roothash))
        .to.emit(dropContract, "MerkleRootChanged").withArgs(roothash);

        //create Merkle Proof for alice
        const hexProof = merkleTree.getHexProof(leaves[0]);

        // alice withdrawing 1155 on basis of her address being included in the merkleRoot
        expect(await dropContract.connect(this.signers.alice).claim(hexProof))
        .to.emit(dropContract, "Claimed").withArgs(this.signers.alice.address);
        leftoverNftAmount = leftoverNftAmount - tokensPerClaim;

        // alice trying to withdraw twice
        await expect(dropContract.connect(this.signers.alice).claim(hexProof))
        .to.be.revertedWith('AlreadyRedeemed');

        // address that is not in merkleRootHash trying to withdraw
        await expect(dropContract.connect(this.signers.lisa).claim(hexProof))
        .to.be.revertedWith('NotEligible');

        // airdropFunds provider withdrawing their leftover funds after the airdrop has finished
        await expect(dropContract.connect(this.signers.deployer).withdrawAirdropFunds()).to.be.revertedWith('AirdropStillInProgress');

        const oneWeek = 604800;
        
        await ethers.provider.send("evm_increaseTime", [oneWeek]); // add one week worth of seconds

        const balanceBeforeWithdraw =  await this.test1155NftCollection.balanceOf(this.signers.deployer.address, tokenId);
        await dropContract.connect(this.signers.deployer).withdrawAirdropFunds();
        const balanceAfterWithdraw =  await this.test1155NftCollection.balanceOf(this.signers.deployer.address, tokenId);

        expect(balanceAfterWithdraw.toNumber()).to.be.equal(balanceBeforeWithdraw.toNumber() + leftoverNftAmount);

        // // alice trying to claim reward after aidrop has expired
        // await expect(dropContract.connect(this.signers.alice).claim(hexProof))
        // .to.be.revertedWith('AirdropExpired');

    })

}