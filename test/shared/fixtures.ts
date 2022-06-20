import { Fixture } from "ethereum-waffle";
import { ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { AirbroFactory } from "../../src/types/contracts/AirbroFactory";
import { Wallet } from "@ethersproject/wallet";

type IntegrationFixtureType = {
    airbroFactory: AirbroFactory
};

export const integrationsFixture: Fixture<IntegrationFixtureType> = async (signers: Wallet[]) => {
    const deployer: Wallet = signers[0];
    
    const airbroFactoryFactory: ContractFactory = await ethers.getContractFactory(`AirbroFactory`);
    
    const airbroFactory: AirbroFactory = (await airbroFactoryFactory.connect(deployer).deploy()) as AirbroFactory;
    
    await airbroFactory.deployed();
    
    
    return { airbroFactory };
};