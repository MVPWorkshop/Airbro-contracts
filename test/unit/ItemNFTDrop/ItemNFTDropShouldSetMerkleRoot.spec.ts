import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

export const ItemNFTDropShouldSetMerkleRoot = (): void => {

    const bytes32MerkleRootHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

    describe('should set merkleRoot',async function(){
        it('should allow admin to set merkleRoot',async function(){            
            await expect(this.ItemNFTDrop.connect(this.signers.backendWallet).setMerkleRoot(bytes32MerkleRootHash))
            .to.emit(this.ItemNFTDrop, "MerkleRootChanged").withArgs(bytes32MerkleRootHash);
    
        }) 
        it('should revert merkleRoot change from non admin account',async function(){
            const nonOwnerAccount = this.signers.alice;
            await expect(this.ItemNFTDrop.connect(nonOwnerAccount).setMerkleRoot(bytes32MerkleRootHash)).to.be.revertedWith('NotAdmin')
        })
    })
};
