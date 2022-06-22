import { Fixture } from "ethereum-waffle";
import { ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { AirbroFactory } from "../../src/types/contracts/AirbroFactory";
import { TestNftCollection } from "../../src/types/contracts/mocks/TestNftCollection";
import { TestToken } from "../../src/types/contracts/mocks/TestToken";
import { Wallet } from "@ethersproject/wallet";
import { Existing1155NftDrop, ExistingTokenDrop, ItemNFTDrop, NFTDrop, TokenDrop } from "../../src/types/contracts/airdrops";
import { AirBro1155NftMint } from "../../src/types/contracts/Airbro1155NftMint.sol/AirBro1155NftMint";

import {contractAdminAddress, randomAddress, unitExistingTokenDropFixtureArguments, unitTokenDropFixtureArguments } from "../shared/constants";


type UnitExisting1155NFTDropFixtureType = {
    existing1155NftDrop: Existing1155NftDrop;
}

type UnitExistingTokenDropFixtureType = {
    existingTokenDrop: ExistingTokenDrop;
}

type UnitItemNFTDropFixtureType = {
    itemNFTDrop: ItemNFTDrop;
}

type UnitNFTDropFixtureType = {
    nftDrop: NFTDrop;
}

type UnitTokenDropFixtureType = {
    tokenDrop: TokenDrop;
}

type IntegrationFixtureType = {
    airbroFactory: AirbroFactory;
    testNftCollection: TestNftCollection;
    testToken: TestToken;
    airBro1155NftMint: AirBro1155NftMint;
};


export const unitExisting1155NFTDropFixture: Fixture<UnitExisting1155NFTDropFixtureType> = async (signers: Wallet[]) => {
    const deployer: Wallet = signers[0];

    const existing1155NftDropFactory: ContractFactory = await ethers.getContractFactory(`Existing1155NftDrop`);

    const existing1155NftDrop: Existing1155NftDrop = (await existing1155NftDropFactory.connect(deployer).deploy(randomAddress,randomAddress,2,2,2,2, contractAdminAddress)) as Existing1155NftDrop;

    await existing1155NftDrop.deployed();

    return { existing1155NftDrop };
};

export const unitExistingTokenDropFixture: Fixture<UnitExistingTokenDropFixtureType> = async (signers: Wallet[]) => {
    const deployer: Wallet = signers[0];

    const existingTokenDropFactory: ContractFactory = await ethers.getContractFactory(`ExistingTokenDrop`);

    const args = Object.values(unitExistingTokenDropFixtureArguments)

    const existingTokenDrop: ExistingTokenDrop = (await existingTokenDropFactory.connect(deployer).deploy(...args)) as ExistingTokenDrop;

    await existingTokenDrop.deployed();

    return { existingTokenDrop };
};

export const unitItemNFTDropFixture: Fixture<UnitItemNFTDropFixtureType> = async (signers: Wallet[]) => {
    const deployer: Wallet = signers[0];

    const itemNFTDropFactory: ContractFactory = await ethers.getContractFactory(`ItemNFTDrop`);

    const itemNFTDrop: ItemNFTDrop = (await itemNFTDropFactory.connect(deployer).deploy(randomAddress,2,'eee','0x00',1,contractAdminAddress)) as ItemNFTDrop;

    await itemNFTDrop.deployed();

    return { itemNFTDrop };
};

export const unitNFTDropFixture: Fixture<UnitNFTDropFixtureType> = async (signers: Wallet[]) => {
    const deployer: Wallet = signers[0];

    const nftDropFactory: ContractFactory = await ethers.getContractFactory(`NFTDrop`);

    const nftDrop: NFTDrop = (await nftDropFactory.connect(deployer).deploy(randomAddress,2,'e','e','e',2,contractAdminAddress)) as NFTDrop;

    await nftDrop.deployed();

    return { nftDrop };
};

export const unitTokenDropFixture: Fixture<UnitTokenDropFixtureType> = async (signers: Wallet[]) => {
    const deployer: Wallet = signers[0];

    const tokenDropFactory: ContractFactory = await ethers.getContractFactory(`TokenDrop`);

    const deploymentArgs = Object.values(unitTokenDropFixtureArguments)

    const tokenDrop: TokenDrop = (await tokenDropFactory.connect(deployer).deploy(...deploymentArgs)) as TokenDrop;

    await tokenDrop.deployed();

    return { tokenDrop };
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
    // console.log(await airBro1155NftMint.address);

    

    
    return { airbroFactory, testNftCollection, testToken, airBro1155NftMint  };
};