import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs"
const { keccak256 } = ethers.utils

export const Existing1155NftDrop1155ShouldClaimReward = (): void => {

    describe('user should be able to claim reward', async function() {
        
        it("should be able to claim if part of merkleRoot", async function(){

        })

        it("should return true if eligible for reward", async function(){

            const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
            const leaves = whitelisted.map(addr => keccak256(addr))
            const merkleTree = new MerkleTree(leaves, keccak256, { sort: true })
            const roothash = merkleTree.getHexRoot();

            expect(await this.existing1155NFTDrop1155.connect(this.signers.backendWallet).setMerkleRoot(roothash))
            .to.emit(this.existing1155NFTDrop1155, "MerkleRootChanged").withArgs(roothash);

            const hexProof = merkleTree.getHexProof(leaves[0]);

            const isEligibleForReward = await this.existing1155NFTDrop1155.connect(this.signers.alice).isEligibleForReward(hexProof);
            
            expect((isEligibleForReward)).to.equal(true);

        })
    })
}