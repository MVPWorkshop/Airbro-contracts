import { expect } from "chai";
import { ethers } from "hardhat";
import { unitTokenDropFixtureArguments as constructorArgs } from "../../../shared/constants";

const dayInSeconds:number = 86400;

export const TokenDropShouldDeploy = (): void => {
    
    describe('should deploy',async function(){
        // potentially remove this later
        it('should have contract owner to address of deployer upon deployment',async function(){
            expect(await this.tokenDrop.owner()).to.be.equal(this.signers.deployer.address)
        })

        it('should have rewardedNft set to correct hardcoded address',async function(){
            expect(await this.tokenDrop.rewardedNft()).to.be.equal(constructorArgs.rewardedNft)
        })
        
        it('should have tokensPerClaim set to correct amount',async function(){
            expect(await this.tokenDrop.tokensPerClaim()).to.be.equal(constructorArgs.tokensPerClaim)
        })
        
        it('should have token name set to correct name',async function(){
            expect(await this.tokenDrop.name()).to.be.equal(constructorArgs.name)
        })
        
        it('should have token symbol set to correct symbol',async function(){
            expect(await this.tokenDrop.symbol()).to.be.equal(constructorArgs.symbol)
        })
        
        it('should have token decimals set to 18',async function(){
            expect(await this.tokenDrop.decimals()).to.be.equal(18)
        })
        
        it('should have airdropDuration set to 1 day (specifically, 86400 seconds)',async function(){
            expect(await this.tokenDrop.airdropDuration()).to.be.equal(constructorArgs.airdropDuration * dayInSeconds)
        })
        
        it('expect airdropStartTime to be the block timestamp',async function(){
            const blockNumBefore = await ethers.provider.getBlockNumber();
            const blockBefore = await ethers.provider.getBlock(blockNumBefore);
            
            expect(await this.tokenDrop.airdropStartTime()).to.be.equal(blockBefore.timestamp)
        })

        it('expect airdropFinishTime to be correctly set',async function(){
            const blockNumBefore = await ethers.provider.getBlockNumber();
            const blockBefore = await ethers.provider.getBlock(blockNumBefore);
            
            expect(await this.tokenDrop.airdropFinishTime()).to.be.equal(blockBefore.timestamp + constructorArgs.airdropDuration * dayInSeconds)
        })
        
        it('should return correct airdrp type',async function(){
            expect(await this.tokenDrop.getAirdropType()).to.be.equal("ERC20")
        })

        it('should have merkleRoot set to 0x00',async function(){
            expect(await this.tokenDrop.merkleRoot()).to.be.equal('0x0000000000000000000000000000000000000000000000000000000000000000')
        })
        
        it('should set airBroFactoryAddress to a the airbroFactory address',async function(){
            expect(await this.tokenDrop.airBroFactoryAddress()).to.be.equal(this.mocks.mockAirBroFactory.address)
        })

    })
};
