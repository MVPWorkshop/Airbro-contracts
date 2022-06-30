import { expect } from "chai";
import { ethers } from "hardhat";
import { unitExistingTokenDropFixtureArguments as constructorArgs } from "../../../shared/constants";

const dayInSeconds:number = 86400;

export const ExistingTokenDrop1155ShouldDeploy = (): void => {
    describe('should deploy',async function(){
        it('should have contract owner to address of deployer upon deployment',async function(){
            expect(await this.existingTokenDrop1155.owner()).to.be.equal(this.signers.deployer.address)
        })
        
        it('should have rewardedNft set to correct hardcoded address',async function(){
            expect(await this.existingTokenDrop1155.rewardedNft()).to.be.equal(constructorArgs.rewardedNft)
        })
        
        it('should have tokensPerClaim set to correct amount',async function(){
            expect(await this.existingTokenDrop1155.tokensPerClaim()).to.be.equal(constructorArgs.tokensPerClaim)
        })
        
        it('should have rewardToken set to correct hardcoded address',async function(){
            expect(await this.existingTokenDrop1155.rewardToken()).to.be.equal(constructorArgs.rewardToken)
        })
        
        it('should have totalAirdropAmount set to correct value',async function(){
            expect(await this.existingTokenDrop1155.totalAirdropAmount()).to.be.equal(constructorArgs.totalAirdropAmount)
        })
        
        it('should have airdropDuration set to 1 day (specifically, 86400 seconds)',async function(){
            expect(await this.existingTokenDrop1155.airdropDuration()).to.be.equal(constructorArgs.airdropDuration * dayInSeconds)
        })
        
        it('expect airdropStartTime to be the block timestamp',async function(){
            const blockNumBefore = await ethers.provider.getBlockNumber();
            const blockBefore = await ethers.provider.getBlock(blockNumBefore);
            
            expect(await this.existingTokenDrop1155.airdropStartTime()).to.be.equal(blockBefore.timestamp)
        })
        
        it('expect airdropFinishTime to be correctly set',async function(){
            const blockNumBefore = await ethers.provider.getBlockNumber();
            const blockBefore = await ethers.provider.getBlock(blockNumBefore);
            
            expect(await this.existingTokenDrop1155.airdropFinishTime()).to.be.equal(blockBefore.timestamp + constructorArgs.airdropDuration * dayInSeconds)
        })
        
        it('should return correct airdrop type',async function(){
            expect(await this.existingTokenDrop1155.getAirdropType()).to.be.equal("ERC20")
        })
        
        it('should have merkleRoot set to 0x00',async function(){
            expect(await this.existingTokenDrop1155.merkleRoot()).to.be.equal('0x0000000000000000000000000000000000000000000000000000000000000000')
        })
        
        it('should set airBroFactory1155HolderAddress to a the airbroFactory1155Holder address',async function(){
            expect(await this.existingTokenDrop1155.airBroFactory1155HolderAddress()).to.be.equal(this.mocks.mockAirBroFactory1155Holder.address)
        })
        
        
    })
};