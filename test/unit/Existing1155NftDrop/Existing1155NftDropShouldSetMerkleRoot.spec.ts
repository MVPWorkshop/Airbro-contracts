import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

export const Existing1155NftDropShouldSetMerkleRoot = (): void => {

    const bytes32MerkleRootHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

    describe('should set merkleRoot',async function(){
        it('should allow admin to set merkleRoot',async function(){            
            await expect(this.existing1155NFTDrop.connect(this.signers.backendWallet).setMerkleRoot(bytes32MerkleRootHash))
            .to.emit(this.existing1155NFTDrop, "MerkleRootChanged").withArgs(bytes32MerkleRootHash);
    
        }) 
        it('should revert merkleRoot change from non admin account',async function(){
            const nonOwnerAccount = this.signers.alice;
            await expect(this.existing1155NFTDrop.connect(nonOwnerAccount).setMerkleRoot(bytes32MerkleRootHash)).to.be.revertedWith('NotAdmin')
        })
    })
};
