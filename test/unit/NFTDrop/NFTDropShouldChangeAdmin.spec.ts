import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

export const NFTDropShouldChangeAdmin = (): void => {

    describe('should change admin',async function(){
        it('should allow admin to change admin address',async function(){
            await expect(this.nftDrop.connect(this.signers.backendWallet).changeAdmin(this.signers.bob.address))
            .to.emit(this.nftDrop,"AdminChanged").withArgs(this.signers.bob.address);
    
            expect(await this.nftDrop.admin()).to.equal(this.signers.bob.address)
        }) 
        it('should revert admin change from non admin account',async function(){
            const nonOwnerAccount = this.signers.alice;
            await expect(this.nftDrop.connect(nonOwnerAccount).changeAdmin(this.signers.bob.address)).to.be.revertedWith('NotAdmin')
        })
    })
};
