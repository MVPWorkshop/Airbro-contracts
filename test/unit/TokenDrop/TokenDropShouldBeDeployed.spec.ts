import { expect } from "chai";

export const TokenDropShouldDeploy = (): void => {

    describe('should deploy',async function(){
        it('should have contract owner to address of deployer upon deployment',async function(){
            expect(await this.tokenDrop.owner()).to.be.equal(this.signers.deployer.address)
        })
    })
};
