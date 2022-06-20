import { expect } from "chai";
import { contractAdminAddress } from "../../shared/constants";

export function shouldBeCorrectAdmin(): void{
    it('should be correct admin address',async function(){
        expect(await this.airbroFactory.admin()).to.equal(contractAdminAddress)
    })
}