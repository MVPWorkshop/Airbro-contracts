import { expect } from "chai";

export const Existing1155NftDropShouldDeploy = (): void => {

    describe('should deploy',async function(){
        it('should have contract owner to address of deployer upon deployment',async function(){
            expect(await this.existing1155NFTDrop.owner()).to.be.equal(this.signers.deployer.address)
        })
        it('should set contract admin to a hardcoded address',async function(){
            expect(await this.existing1155NFTDrop.admin()).to.be.equal(this.signers.backendWallet.address)
        })
    })
};
