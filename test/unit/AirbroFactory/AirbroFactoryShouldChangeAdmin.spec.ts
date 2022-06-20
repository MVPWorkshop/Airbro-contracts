import { expect } from "chai";
import { contractAdminAddress } from "../../shared/constants";

const randomAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';

export function shouldChangeAdminAddress(): void{
    it('should allow admin to change admin address',async function(){
        await this.airbroFactory.connect(this.signers.backendWallet).changeAdmin(randomAddress)
        expect(await this.airbroFactory.admin()).to.be.equal(randomAddress)
        .and.to.emit(this.airbroFactory,"AdminChanged").withArgs(randomAddress);
    })
    
    it('should revert admin change from not admin address',async function(){
        await expect(this.airbroFactory.connect(this.signers.alice).changeAdmin(randomAddress)).to.be.revertedWith('NotAdmin')

    })
}