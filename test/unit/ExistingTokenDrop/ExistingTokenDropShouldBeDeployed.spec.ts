import { expect } from "chai";
import { ethers } from "hardhat";
import { unitExistingTokenDropFixtureArguments } from "../../shared/constants";

const dayInSeconds:number = 86400;

export const ExistingTokenDropShouldDeploy = (): void => {
    
    describe('should deploy',async function(){

        //potentially remove later
        it('should have contract owner to address of deployer upon deployment',async function(){
            expect(await this.existingTokenDrop.owner()).to.be.equal(this.signers.deployer.address)
        })
        
        it('should have rewardedNft set to correct hardcoded address',async function(){
            expect(await this.existingTokenDrop.rewardedNft()).to.be.equal(unitExistingTokenDropFixtureArguments.rewardedNft)
        })
        
        it('should have tokensPerClaim set to correct amount',async function(){
            expect(await this.existingTokenDrop.tokensPerClaim()).to.be.equal(unitExistingTokenDropFixtureArguments.tokensPerClaim)
        })
        
        it('should have rewardToken set to correct hardcoded address',async function(){
            expect(await this.existingTokenDrop.rewardToken()).to.be.equal(unitExistingTokenDropFixtureArguments.rewardToken)
        })
        
        it('should have totalAirdropAmount set to correct value',async function(){
            expect(await this.existingTokenDrop.totalAirdropAmount()).to.be.equal(unitExistingTokenDropFixtureArguments.totalAirdropAmount)
        })

        it('should have airdropDuration set to 1 day (specifically, 86400 seconds)',async function(){
            expect(await this.existingTokenDrop.airdropDuration()).to.be.equal(unitExistingTokenDropFixtureArguments.airdropDuration * 86400)
        })

        it('expect airdropStartTime to be the block timestamp',async function(){
            const blockNumBefore = await ethers.provider.getBlockNumber();
            const blockBefore = await ethers.provider.getBlock(blockNumBefore);
            
            expect(await this.existingTokenDrop.airdropStartTime()).to.be.equal(blockBefore.timestamp)
        })

        it('expect airdropFinishTime to be correctly set',async function(){
            const blockNumBefore = await ethers.provider.getBlockNumber();
            const blockBefore = await ethers.provider.getBlock(blockNumBefore);
            
            expect(await this.existingTokenDrop.airdropFinishTime()).to.be.equal(blockBefore.timestamp + unitExistingTokenDropFixtureArguments.airdropDuration * dayInSeconds)
        })

        it('should return correct airdrp type',async function(){
            expect(await this.existingTokenDrop.getAirdropType()).to.be.equal("ERC20")
        })

        it('should have merkleRoot set to 0x00',async function(){
            expect(await this.existingTokenDrop.merkleRoot()).to.be.equal('0x0000000000000000000000000000000000000000000000000000000000000000')
        })
        
        // potentially remove later
        it('should set contract admin to a hardcoded address',async function(){
            expect(await this.existingTokenDrop.admin()).to.be.equal(unitExistingTokenDropFixtureArguments.admin)
        })
        
        
    })
};
