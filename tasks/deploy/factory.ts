import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { AirbroFactory } from "../../src/types/AirbroFactory";
import { AirBro1155NftMint } from "../../src/types/AirBro1155NftMint";
import { AirbroFactory__factory } from "../../src/types/factories/AirbroFactory__factory";
import { AirBro1155NftMint__factory } from "../../src/types/factories/AirBro1155NftMint__factory";
import { Signer } from "@ethersproject/abstract-signer";

task("deploy:AirbroFactory")
  .setAction(async function(taskArguments: TaskArguments, { ethers }) {
    const accounts: Signer[] = await ethers.getSigners();
    console.log("Deployer address: " + await accounts[0].getAddress());

    const AirbroFactory: AirbroFactory__factory = <AirbroFactory__factory>await ethers.getContractFactory("AirbroFactory");
    const Airbro: AirbroFactory = <AirbroFactory>await AirbroFactory.deploy();
    await Airbro.deployed();

    console.log("Airbro Factory deployed to: ", Airbro.address);

    // const AirBro1155NftMintFactory: AirBro1155NftMint__factory = <AirBro1155NftMint__factory>await ethers.getContractFactory("AirBro1155NftMint");
    // const AirBro1155NftMint: AirBro1155NftMint = <AirBro1155NftMint>await AirBro1155NftMintFactory.deploy();
    // await AirBro1155NftMint.deployed();
    //
    // console.log("AirBro 1155 Nft Mint deployed to: ", AirBro1155NftMint.address);

  });
