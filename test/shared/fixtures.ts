import { Fixture, MockContract } from "ethereum-waffle";
import { ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { AirbroFactory } from "../../src/types/contracts/AirbroFactory";
import { TestNftCollection } from "../../src/types/contracts/mocks/TestNftCollection";
import { TestToken } from "../../src/types/contracts/mocks/TestToken";
import { Wallet } from "@ethersproject/wallet";
import { Existing1155NftDrop } from "../../src/types/contracts/airdrops/Existing1155NftDrop.sol/index"
import { ExistingTokenDrop } from "../../src/types/contracts/airdrops/ExistingTokenDrop.sol/index"
import { TokenDrop } from "../../src/types/contracts/airdrops/TokenDrop.sol/index"
import { ItemNFTDrop } from "../../src/types/contracts/airdrops/ItemNFTDrop.sol/index"
import { NFTDrop } from "../../src/types/contracts/airdrops/NFTDrop.sol/index"

import { AirBro1155NftMint } from "../../src/types/contracts/Airbro1155NftMint.sol/AirBro1155NftMint";

import {contractAdminAddress, unitExistingTokenDropFixtureArguments, unitTokenDropFixtureArguments } from "../shared/constants";
import { deployMockAirBroFactory } from "./mocks";
/* import {contractAdminAddress, randomAddress, unitExisting TokenDropFixtureArguments, unitTokenDropFixtureArguments } from "../shared/constants"; */


type UnitExisting1155NFTDropFixtureType = {
    existing1155NftDrop: Existing1155NftDrop;
    mockAirBroFactory: MockContract;
}

type UnitExistingTokenDropFixtureType = {
    existingTokenDrop: ExistingTokenDrop;
    mockAirBroFactory: MockContract;
}

type UnitItemNFTDropFixtureType = {
    itemNFTDrop: ItemNFTDrop;
    mockAirBroFactory: MockContract;
}

type UnitNFTDropFixtureType = {
    nftDrop: NFTDrop;
    mockAirBroFactory: MockContract;
}

type UnitTokenDropFixtureType = {
    tokenDrop: TokenDrop;
    mockAirBroFactory: MockContract;
}

type IntegrationFixtureType = {
    airbroFactory: AirbroFactory;
    testNftCollection: TestNftCollection;
    testToken: TestToken;
    airBro1155NftMint: AirBro1155NftMint;
};

const randomAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';

export const unitExisting1155NFTDropFixture: Fixture<UnitExisting1155NFTDropFixtureType> = async (signers: Wallet[]) => {
    const deployer: Wallet = signers[0];

    const mockAirBroFactory = await deployMockAirBroFactory(deployer);

    const existing1155NftDropFactory: ContractFactory = await ethers.getContractFactory(`Existing1155NftDrop`);

    const existing1155NftDrop: Existing1155NftDrop = (await existing1155NftDropFactory.connect(deployer).deploy(randomAddress,randomAddress,2,2,2,2, mockAirBroFactory.address)) as Existing1155NftDrop;

    await existing1155NftDrop.deployed();

    return { existing1155NftDrop, mockAirBroFactory};
};

export const unitExistingTokenDropFixture: Fixture<UnitExistingTokenDropFixtureType> = async (signers: Wallet[]) => {
    const deployer: Wallet = signers[0];

    const mockAirBroFactory = await deployMockAirBroFactory(deployer);

    const existingTokenDropFactory: ContractFactory = await ethers.getContractFactory(`ExistingTokenDrop`);

    // const existingTokenDrop: ExistingTokenDrop = (await existingTokenDropFactory.connect(deployer).deploy(randomAddress,2,randomAddress,2,2,mockAirBroFactory.address)) as ExistingTokenDrop;

    const args = Object.values(unitExistingTokenDropFixtureArguments)
    const existingTokenDrop: ExistingTokenDrop = (await existingTokenDropFactory.connect(deployer).deploy(...args, mockAirBroFactory.address)) as ExistingTokenDrop;

    await existingTokenDrop.deployed();

    return { existingTokenDrop, mockAirBroFactory };
};

export const unitItemNFTDropFixture: Fixture<UnitItemNFTDropFixtureType> = async (signers: Wallet[]) => {
    const deployer: Wallet = signers[0];

    const mockAirBroFactory = await deployMockAirBroFactory(deployer);

    const itemNFTDropFactory: ContractFactory = await ethers.getContractFactory(`ItemNFTDrop`);

    const itemNFTDrop: ItemNFTDrop = (await itemNFTDropFactory.connect(deployer).deploy(randomAddress,2,'eee','0x00',1,mockAirBroFactory.address)) as ItemNFTDrop;

    await itemNFTDrop.deployed();

    return { itemNFTDrop, mockAirBroFactory };
};

export const unitNFTDropFixture: Fixture<UnitNFTDropFixtureType> = async (signers: Wallet[]) => {
    const deployer: Wallet = signers[0];

    const mockAirBroFactory = await deployMockAirBroFactory(deployer);

    const nftDropFactory: ContractFactory = await ethers.getContractFactory(`NFTDrop`);

    const nftDrop: NFTDrop = (await nftDropFactory.connect(deployer).deploy(randomAddress,2,'e','e','e',2,mockAirBroFactory.address)) as NFTDrop;

    await nftDrop.deployed();

    return { nftDrop, mockAirBroFactory };
};

export const unitTokenDropFixture: Fixture<UnitTokenDropFixtureType> = async (signers: Wallet[]) => {
    const deployer: Wallet = signers[0];

    const mockAirBroFactory = await deployMockAirBroFactory(deployer);

    const tokenDropFactory: ContractFactory = await ethers.getContractFactory(`TokenDrop`);

    // const tokenDrop: TokenDrop = (await tokenDropFactory.connect(deployer).deploy(randomAddress,2,'eee','ee',2,mockAirBroFactory.address)) as TokenDrop;

    const deploymentArgs = Object.values(unitTokenDropFixtureArguments)
    const tokenDrop: TokenDrop = (await tokenDropFactory.connect(deployer).deploy(...deploymentArgs, mockAirBroFactory.address)) as TokenDrop;

    await tokenDrop.deployed();

    return { tokenDrop, mockAirBroFactory };
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

    const airBro1155NftMintFactory: ContractFactory = await ethers.getContractFactory(`AirBro1155NftMint`);

    const airBro1155NftMint: AirBro1155NftMint = (await airBro1155NftMintFactory.connect(deployer).deploy()) as AirBro1155NftMint;

    await airBro1155NftMint.deployed();
    
    return { airbroFactory, testNftCollection, testToken, airBro1155NftMint };
};