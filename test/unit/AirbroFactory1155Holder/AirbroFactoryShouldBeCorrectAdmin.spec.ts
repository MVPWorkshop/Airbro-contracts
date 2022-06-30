import { expect } from "chai";
import { contractAdminAddress } from "../../shared/constants";

export function AirbroFactory1155HolderShouldBeCorrectAdmin(): void{
    it('should be correct admin address',async function(){
        expect(await this.airbroFactory1155Holder.admin()).to.equal(contractAdminAddress)
    })
}