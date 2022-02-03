import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { AirbroFactory } from "../../src/types/AirbroFactory";
import { AirbroFactory__factory } from "../../src/types/factories/AirbroFactory__factory";
import { Signer } from "@ethersproject/abstract-signer";

task("deploy:AirbroFactory")
  .setAction(async function(taskArguments: TaskArguments, { ethers }) {
    const accounts: Signer[] = await ethers.getSigners();
    console.log("Deployer address: " + await accounts[0].getAddress());

    const AirbroFactory: AirbroFactory__factory = <AirbroFactory__factory>await ethers.getContractFactory("AirbroFactory");
    const Airbro: AirbroFactory = <AirbroFactory>await AirbroFactory.deploy();
    await Airbro.deployed();

    console.log("Airbro Factory deployed to: ", Airbro.address);
  });
