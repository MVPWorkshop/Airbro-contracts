import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs"
const { keccak256 } = ethers.utils

export function ExistingTokenDrop1155ShouldClaimReward(){
    describe('user should be able to claim reward',async function(){

        it("checkProof method should return true only if the hexProof is valid", async function(){
            const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
            const leaves = whitelisted.map(addr => keccak256(addr))
            const merkleTree = new MerkleTree(leaves, keccak256, { sort: true })
            const roothash = merkleTree.getHexRoot();

            expect(await this.existingTokenDrop1155.connect(this.signers.backendWallet).setMerkleRoot(roothash))
            .to.emit(this.existingTokenDrop1155, "MerkleRootChanged").withArgs(roothash);

            const hexProof = merkleTree.getHexProof(leaves[0]);
            expect(await this.existingTokenDrop1155.connect(this.signers.alice).checkProof(hexProof, roothash)).to.equal(true); // Alice has correct hexProof
            expect(await this.existingTokenDrop1155.connect(this.signers.bob).checkProof(hexProof, roothash)).to.equal(false); // bob doesn't have correct hexProof
        })

    })
}