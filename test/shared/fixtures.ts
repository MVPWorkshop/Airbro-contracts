import { Fixture, MockContract } from "ethereum-waffle";
import { ContractFactory } from "ethers";
import { ethers } from "hardhat";

import { AirbroFactory } from "../../src/types/contracts/AirbroFactory";
import { TestNftCollection } from "../../src/types/contracts/mocks/TestNftCollection";
import { TestToken } from "../../src/types/contracts/mocks/TestToken";
import { Wallet } from "@ethersproject/wallet";
import { Existing1155NftDrop } from "../../src/types/contracts/airdrops/Existing1155NftDrop"
import { ExistingTokenDrop } from "../../src/types/contracts/airdrops/ExistingTokenDrop"
import { TokenDrop } from "../../src/types/contracts/airdrops/TokenDrop"
import { ItemNFTDrop } from "../../src/types/contracts/airdrops/ItemNFTDrop"
import { NFTDrop } from "../../src/types/contracts/airdrops/NFTDrop"
import { AirBro1155NftMint } from "../../src/types/contracts/Airbro1155NftMint.sol/AirBro1155NftMint";


import { AirbroFactory1155Holder } from "../../src/types/contracts/AirbroFactory1155Holder";
import { Existing1155NftDrop1155 } from "../../src/types/contracts/airdrops1155Holder/Existing1155NftDrop1155"
import { ExistingTokenDrop1155 } from "../../src/types/contracts/airdrops1155Holder/ExistingTokenDrop1155"
import { TokenDrop1155 } from "../../src/types/contracts/airdrops1155Holder/TokenDrop1155"




import { randomAddress, unitExistingTokenDropFixtureArguments, unitTokenDropFixtureArguments } from "../shared/constants";
import { deployMockAirBroFactory, deployMockAirBroFactory1155Holder } from "./mocks";


type UnitExisting1155NFTDropFixtureType = {
    existing1155NftDrop: Existing1155NftDrop;
    mockAirBroFactory: MockContract;
}

type UnitExisting1155NFTDrop1155FixtureType = {
    existing1155NftDrop1155: Existing1155NftDrop1155;
    mockAirBroFactory1155Holder: MockContract;
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

type UnitExistingTokenDrop1155FixtureType = {
    existingTokenDrop1155:ExistingTokenDrop1155;
    mockAirBroFactory1155Holder: MockContract;
}

type UnitTokenDrop1155FixtureType = {
    tokenDrop1155:TokenDrop1155;
    mockAirBroFactory1155Holder: MockContract;
}

type IntegrationFixtureType = {
    airbroFactory: AirbroFactory;
    testNftCollection: TestNftCollection;
    testToken: TestToken;
    airBro1155NftMint: AirBro1155NftMint;
};

type Integration1155HolderFixtureType = {
    airbroFactory1155Holder: AirbroFactory; // temporary for testing
    // airbroFactory1155Holder: AirbroFactory1155Holder;
    testNftCollection: TestNftCollection;
    testToken: TestToken;
    airBro1155NftMint: AirBro1155NftMint;
};

export const unitExisting1155NFTDropFixture: Fixture<UnitExisting1155NFTDropFixtureType> = async (signers: Wallet[]) => {
    const deployer: Wallet = signers[0];
    
    const mockAirBroFactory = await deployMockAirBroFactory(deployer);
    
    const existing1155NftDropFactory: ContractFactory = await ethers.getContractFactory(`Existing1155NftDrop`);
    
    const existing1155NftDrop: Existing1155NftDrop = (await existing1155NftDropFactory.connect(deployer).deploy(randomAddress,randomAddress,2,2,2,2, mockAirBroFactory.address)) as Existing1155NftDrop;
    
    await existing1155NftDrop.deployed();
    
    return { existing1155NftDrop, mockAirBroFactory};
};

export const unitExisting1155NFTDrop1155Fixture: Fixture<UnitExisting1155NFTDrop1155FixtureType> = async (signers: Wallet[]) => {
    const deployer: Wallet = signers[0];
    
    const airBro1155NftMintFactory: ContractFactory = await ethers.getContractFactory(`AirBro1155NftMint`);

    const airBro1155NftMint: AirBro1155NftMint = (await airBro1155NftMintFactory.connect(deployer).deploy()) as AirBro1155NftMint;

    await airBro1155NftMint.deployed();

    const mockAirBroFactory1155Holder = await deployMockAirBroFactory1155Holder(deployer);
    
    const existing1155NftDrop1155Factory: ContractFactory = await ethers.getContractFactory(`Existing1155NftDrop1155`);
    
    const existing1155NftDrop1155: Existing1155NftDrop1155 = (await existing1155NftDrop1155Factory.connect(deployer).deploy(randomAddress, airBro1155NftMint.address,2,1,1000,2, mockAirBroFactory1155Holder.address)) as Existing1155NftDrop1155;
    
    await existing1155NftDrop1155.deployed();

    const idOf1155:string = 'nftAirdrop';
    const amounOft1155:number = 1000;

    await airBro1155NftMint.connect(deployer).mint(idOf1155,amounOft1155);

    await airBro1155NftMint.connect(deployer).setApprovalForAll(existing1155NftDrop1155.address,true);
    await existing1155NftDrop1155.connect(deployer).fundAirdrop();
    
    return { existing1155NftDrop1155, mockAirBroFactory1155Holder};
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

export const unitExistingTokenDrop1155Fixture: Fixture<UnitExistingTokenDrop1155FixtureType> = async (signers: Wallet[]) => {
    const deployer: Wallet = signers[0];

    const mockAirBroFactory1155Holder = await deployMockAirBroFactory1155Holder(deployer);
    
    const ExistingTokenDrop1155Factory = await ethers.getContractFactory("ExistingTokenDrop1155")
    
    const args = Object.values(unitExistingTokenDropFixtureArguments)
    const existingTokenDrop1155: ExistingTokenDrop1155 = (await ExistingTokenDrop1155Factory.connect(deployer).deploy(...args, mockAirBroFactory1155Holder.address)) as ExistingTokenDrop1155;

    await existingTokenDrop1155.deployed();
    
    return { existingTokenDrop1155, mockAirBroFactory1155Holder }
}


export const unitTokenDrop1155Fixture: Fixture<UnitTokenDrop1155FixtureType> = async (signers: Wallet[]) => {
    const deployer: Wallet = signers[0];

    const mockAirBroFactory1155Holder = await deployMockAirBroFactory1155Holder(deployer);
    
    const tokenDrop1155Factory = await ethers.getContractFactory("TokenDrop1155")

    const args = Object.values(unitTokenDropFixtureArguments)
    const tokenDrop1155: TokenDrop1155 = (await tokenDrop1155Factory.connect(deployer).deploy(...args, mockAirBroFactory1155Holder.address)) as TokenDrop1155;

    await tokenDrop1155.deployed();
    
    return { tokenDrop1155, mockAirBroFactory1155Holder }
}


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


export const integrations1155HolderFixture: Fixture<Integration1155HolderFixtureType> = async (signers: Wallet[]) => {
    const deployer: Wallet = signers[0];
    
    const airbroFactoryFactory: ContractFactory = await ethers.getContractFactory(`AirbroFactory`);
    
    const airbroFactory1155Holder: AirbroFactory = (await airbroFactoryFactory.connect(deployer).deploy()) as AirbroFactory;
    
    await airbroFactory1155Holder.deployed();

    // const airbroFactory1155HolderFactory: ContractFactory = await ethers.getContractFactory(`AirbroFactory1155Holder`);
    
    // const airbroFactory1155Holder: AirbroFactory1155Holder = (await airbroFactory1155HolderFactory.connect(deployer).deploy()) as AirbroFactory1155Holder;
    
    // await airbroFactory1155Holder.deployed();

    const testNftCollectionFactory: ContractFactory = await ethers.getContractFactory(`TestNftCollection`);

    const testNftCollection: TestNftCollection = (await testNftCollectionFactory.connect(deployer).deploy()) as TestNftCollection;

    await testNftCollection.deployed();

    const testTokenFactory: ContractFactory = await ethers.getContractFactory(`TestToken`);

    const testToken: TestToken = (await testTokenFactory.connect(deployer).deploy()) as TestToken;

    await testToken.deployed();

    const airBro1155NftMintFactory: ContractFactory = await ethers.getContractFactory(`AirBro1155NftMint`);

    const airBro1155NftMint: AirBro1155NftMint = (await airBro1155NftMintFactory.connect(deployer).deploy()) as AirBro1155NftMint;

    await airBro1155NftMint.deployed();
    
    return { airbroFactory1155Holder, testNftCollection, testToken, airBro1155NftMint };
};