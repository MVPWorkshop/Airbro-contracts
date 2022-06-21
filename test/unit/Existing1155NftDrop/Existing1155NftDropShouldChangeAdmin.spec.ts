import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

export const Existing1155NftDropShouldChangeAdmin = (): void => {

    describe('should change admin',async function(){
        it('should allow admin to change admin address',async function(){
            await expect(this.existing1155NFTDrop.connect(this.signers.backendWallet).changeAdmin(this.signers.bob.address))
            .to.emit(this.existing1155NFTDrop,"AdminChanged").withArgs(this.signers.bob.address);
    
            expect(await this.existing1155NFTDrop.admin()).to.equal(this.signers.bob.address)
        }) 
        it('should revert admin change from non admin account',async function(){
            const nonOwnerAccount = this.signers.alice;
            await expect(this.existing1155NFTDrop.connect(nonOwnerAccount).changeAdmin(this.signers.bob.address)).to.be.revertedWith('NotAdmin')
        })
    })
};
