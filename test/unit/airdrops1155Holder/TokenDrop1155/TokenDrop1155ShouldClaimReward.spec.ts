import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs"
const { keccak256 } = ethers.utils

export function TokenDrop1155ShouldClaimReward(){
    describe('user should be able to claim reward',async function(){

        it("checkProof method should return true only if the merkleProof is valid", async function(){
            const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
            const leaves = whitelisted.map(addr => keccak256(addr))
            const merkleTree = new MerkleTree(leaves, keccak256, { sort: true })
            const roothash = merkleTree.getHexRoot();

            // updating root hash on tokenDrop1155
            expect(await this.tokenDrop1155.connect(this.signers.backendWallet).setMerkleRoot(roothash))
            .to.emit(this.tokenDrop1155, "MerkleRootChanged").withArgs(roothash);

            const hexProof = merkleTree.getHexProof(leaves[0]);
            expect(await this.tokenDrop1155.connect(this.signers.alice).checkProof(hexProof, roothash)).to.equal(true); // Alice has correct hexProof
            expect(await this.tokenDrop1155.connect(this.signers.bob).checkProof(hexProof, roothash)).to.equal(false); // bob doesn't have correct hexProof
        })
        
        it("isEligibleForReward method should return true only if eligible based on merkleProof", async function(){
            const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
            const leaves = whitelisted.map(addr => keccak256(addr))
            const merkleTree = new MerkleTree(leaves, keccak256, { sort: true })
            const roothash = merkleTree.getHexRoot();

            // updating root hash on tokenDrop1155
            expect(await this.tokenDrop1155.connect(this.signers.backendWallet).setMerkleRoot(roothash))
            .to.emit(this.tokenDrop1155, "MerkleRootChanged").withArgs(roothash);

            const hexProof = merkleTree.getHexProof(leaves[0]);
            const isEligibleForReward = await this.tokenDrop1155.connect(this.signers.alice).isEligibleForReward(hexProof);
            expect((isEligibleForReward)).to.equal(true);

            // bob is not eligible with this proof
            const isNotEligibleForReward = await this.tokenDrop1155.connect(this.signers.bob).isEligibleForReward(hexProof);
            expect((isNotEligibleForReward)).to.equal(false);
        })


        /* might move this to integration tests later */
        it('user should be able to mint reward token amount once if eligible based on merkleProof',async function(){
            const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
            const leaves = whitelisted.map(addr => keccak256(addr))
            const merkleTree = new MerkleTree(leaves, keccak256, { sort: true })
            const roothash = merkleTree.getHexRoot();

            // updating root hash on tokenDrop1155
            expect(await this.tokenDrop1155.connect(this.signers.backendWallet).setMerkleRoot(roothash))
            .to.emit(this.tokenDrop1155, "MerkleRootChanged").withArgs(roothash);

            // generating proof and claiming
            const hexProof = merkleTree.getHexProof(leaves[0]);
            expect((this.tokenDrop1155.connect(this.signers.alice).claim(hexProof))).to.emit(this.tokenDrop1155,"Claimed").withArgs(this.signers.alice.address);
            expect((this.tokenDrop1155.connect(this.signers.alice).claim(hexProof))).to.be.revertedWith("AlreadyRedeemed"); // trying to claim twice, should revert
            
            // test what happens if the date expires... add later

            expect((this.tokenDrop1155.connect(this.signers.bob).claim(hexProof))).to.be.revertedWith("NotEligible"); // reverting bob's attempt
        })
    })
}