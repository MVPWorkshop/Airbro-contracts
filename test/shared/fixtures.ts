import { Fixture } from "ethereum-waffle";
import { ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { AirbroFactory } from "../../src/types/contracts/AirbroFactory";
import { TestNftCollection } from "../../src/types/contracts/mocks/TestNftCollection";
import { TestToken } from "../../src/types/contracts/mocks/TestToken";
import { Wallet } from "@ethersproject/wallet";

type IntegrationFixtureType = {
    airbroFactory: AirbroFactory,
    testNftCollection: TestNftCollection,
    testToken: TestToken
};

export const integrationsFixture: Fixture<IntegrationFixtureType> = async (signers: Wallet[]) => {
    const deployer: Wallet = signers[0];
    
    const airbroFactoryFactory: ContractFactory = await ethers.getContractFactory(`AirbroFactory`);
    
    const airbroFactory: AirbroFactory = (await airbroFactoryFactory.connect(deployer).deploy()) as AirbroFactory;
    
    await airbroFactory.deployed();

    const testNftCollectionFactory: ContractFactory = await ethers.getContractFactory(`TestNftCollection`);

    const testNftCollection: TestNftCollection = (await testNftCollectionFactory.connect(deployer).deploy()) as TestNftCollection;

    await testNftCollection.deployed();

    const testTokenFactory: ContractFactory = await ethers.getContractFactory(`TestToken`);

    const testToken: TestToken = (await testTokenFactory.connect(deployer).deploy()) as TestToken;

    await testToken.deployed();

    
    return { airbroFactory, testNftCollection, testToken };
};