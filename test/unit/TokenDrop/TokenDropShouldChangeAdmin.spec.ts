import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

export const TokenDropShouldChangeAdmin = (): void => {

    describe('should change admin',async function(){
        it('should allow admin to change admin address',async function(){
            await expect(this.tokenDrop.connect(this.signers.backendWallet).changeAdmin(this.signers.bob.address))
            .to.emit(this.tokenDrop,"AdminChanged").withArgs(this.signers.bob.address);
    
            expect(await this.tokenDrop.admin()).to.equal(this.signers.bob.address)
        }) 
        it('should revert admin change from non admin account',async function(){
            const nonOwnerAccount = this.signers.alice;
            await expect(this.tokenDrop.connect(nonOwnerAccount).changeAdmin(this.signers.bob.address)).to.be.revertedWith('NotAdmin')
        })
    })
};
