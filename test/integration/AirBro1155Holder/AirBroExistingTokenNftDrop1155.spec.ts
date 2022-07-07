import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs"
const { keccak256 } = ethers.utils


export function AirbroFactory1155HolderShouldAirDropExistingToken(){
    it('should fund and drop tokens to newly minted nft1155 holders',async function(){
        const totalAirdropAmount = ethers.utils.parseEther("1000");
        const tokensPerClaim = 100;
        const airdropDurationInDays = 30 //days
        
        // minging the admin 1000 of the existing tokens
        await this.testToken.connect(this.signers.deployer).mint(this.signers.deployer.address, totalAirdropAmount);
        
        // creating new airdrop
        const newAirdrop = await this.airbroFactory1155Holder.connect(this.signers.deployer).dropExistingTokensToNftHolders(
            this.test1155NftCollection.address, // rewardedNftCollection,
            tokensPerClaim,
            this.testToken.address, //existing token address
            totalAirdropAmount, // total tokens to be rewarded
            airdropDurationInDays,
            )
            
            expect(newAirdrop).to.emit(this.airbroFactory1155Holder, "NewAirdrop");
            
            
            const existingDropFactory = await ethers.getContractFactory("ExistingTokenDrop1155");
            const tokenDropContract = existingDropFactory.attach(await this.airbroFactory1155Holder.airdrops(0)); // Address of newly created airdrop. How will this be sent to the frontend ?
            
            expect(await tokenDropContract.totalAirdropAmount()).to.be.equal(totalAirdropAmount)
            
            // funding the airdrop with tokens
            expect(await tokenDropContract.airdropFunded()).to.be.equal(false)
            
            await this.testToken.connect(this.signers.deployer).approve(tokenDropContract.address, totalAirdropAmount); //deployer approving tokens
            await expect(tokenDropContract.fundAirdrop()).to.emit(tokenDropContract,"AirdropFunded"); // funding airdrop contract
            expect(await tokenDropContract.airdropFunded()).to.be.equal(true) // should be funded
            
            /**
            * The user will receive the test1155NftCollection.
            * A twitter bot will update the backend with a merkle tree of users who satisfied a condition using this nft. 
            * The backendWallet will update the merkleRoot on the airdrop smart contract.
            *  */
            
            const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
            const leaves = whitelisted.map(addr => keccak256(addr))
            const merkleTree = new MerkleTree(leaves, keccak256, { sort: true })
            const roothash = merkleTree.getHexRoot();
            
            await expect(tokenDropContract.connect(this.signers.backendWallet).setMerkleRoot(roothash)).to.emit(tokenDropContract,"MerkleRootChanged").withArgs(roothash); //backend setting the merkleRoot
            
            // Alice claiming new token
            const hexProof = merkleTree.getHexProof(leaves[0]);
            expect(await this.testToken.balanceOf(this.signers.alice.address)).to.be.equal(0) // alice has not claimed any tokens yet and should have balance of 0

            await expect(tokenDropContract.connect(this.signers.alice).claim(hexProof)).to.emit(tokenDropContract,"Claimed").withArgs(this.signers.alice.address)
            expect(await this.testToken.balanceOf(this.signers.alice.address)).to.be.equal(tokensPerClaim) //alice should have additional tokens matching the tokensPerClaim amount
            
            await expect(tokenDropContract.connect(this.signers.alice).claim(hexProof)).to.be.revertedWith("AlreadyRedeemed") // should be reverted since Alice already redeemed
            
        })
    }