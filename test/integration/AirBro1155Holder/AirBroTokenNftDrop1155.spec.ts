import { expect } from "chai";
import { ethers, network } from "hardhat";
import { MerkleTree } from "merkletreejs"
import { randomAddress } from "../../shared/constants";
const { keccak256 } = ethers.utils

export function AirbroFactory1155HolderShouldAirDropNewToken(){
    const tokenName = 'NewToken';
    const tokenSymbol = "NTK";
    const tokensPerClaim = 2;
    const airdropDuration = 30; // days

    it('should create new token and airdrop it to users with valid merkleProof', async function(){
        
         const newAirdrop = await this.airbroFactory1155Holder.connect(this.signers.deployer).dropNewTokensToNftHolders(
            randomAddress,
            tokenName,
            tokenSymbol,
            tokensPerClaim,
            airdropDuration
         );
        await expect(newAirdrop).to.emit(this.airbroFactory1155Holder,"NewAirdrop");

        const TokenDrop1155Factory = await ethers.getContractFactory("TokenDrop1155");
        const tokenDropContract = TokenDrop1155Factory.attach(await this.airbroFactory1155Holder.airdrops(0)); // Address of newly created airdrop. How will this be sent to the frontend ?

        // whitelisting Alice and other account to have this new token minted to them
        const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
        const leaves = whitelisted.map(addr => keccak256(addr))
        const merkleTree = new MerkleTree(leaves, keccak256, { sort: true })
        const roothash = merkleTree.getHexRoot();

        // updating root hash on tokenDrop1155 with alice whitelisted
        await expect(tokenDropContract.connect(this.signers.backendWallet).setMerkleRoot(roothash))
        .to.emit(tokenDropContract, "MerkleRootChanged").withArgs(roothash);

        // generating proof for Alice and claiming
        const aliceHexProof = merkleTree.getHexProof(leaves[0]);
        await expect(tokenDropContract.connect(this.signers.alice).claim(aliceHexProof)).to.emit(tokenDropContract,"Claimed").withArgs(this.signers.alice.address);
        await expect(tokenDropContract.connect(this.signers.alice).claim(aliceHexProof)).to.be.revertedWith("AlreadyRedeemed");
        
        await expect(tokenDropContract.connect(this.signers.bob).claim(aliceHexProof)).to.be.revertedWith("NotEligible"); // reverting bob's attempt at redeeming with invalid proof
        
        // Bob trying to redeem after airdrop duration has passed
        await network.provider.send("evm_increaseTime", [86400 * (airdropDuration +1)]) // setting timestamp to pass the airdrop duration by 1 day
        const bobHexProof = merkleTree.getHexProof(leaves[1]);
        await expect(tokenDropContract.connect(this.signers.bob).claim(bobHexProof)).to.be.revertedWith("AirdropExpired");


    })

}