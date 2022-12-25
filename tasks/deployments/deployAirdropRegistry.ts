import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { AirdropRegistry } from "../../src/types/contracts/AirdropRegistry";
import { AirdropRegistry__factory } from "../../src/types/factories/contracts/AirdropRegistry__factory";

/**
 * This method will deploy a new version fo the airbro campaign factory contract with whichever
 * constructor parameter manually supplied to it.
 */
task("deploy:AirdropRegistry")
  .addPositionalParam("registryadmin", "Address of the backend wallet address")
  .addPositionalParam("treasurywallet", "Address of the treasury contract")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const registryAdmin = taskArguments.registryadmin;
    const treasuryWallet = taskArguments.treasurywallet;

    console.log(
      `Deploying airbroCampaignFactory with the following parameters: \n\n1.registryAdmin ${registryAdmin} \n2.treasuryWallet ${treasuryWallet}`,
    );

    // TODO a prompt would on this line to check that the params are correct, not sure how to implement

    console.log("getting AirdropRegistry factory...");
    const AirdropRegistryFactory: AirdropRegistry__factory = <AirdropRegistry__factory>(
      await ethers.getContractFactory("AirdropRegistry")
    );

    console.log("Deploying AirdropRegistry...");
    const airdropRegistry: AirdropRegistry = <AirdropRegistry>(
      await AirdropRegistryFactory.deploy(registryAdmin, treasuryWallet)
    );

    console.log("Awaiting deployment confirmation...");
    await airdropRegistry.deployed();

    console.log("AirdropRegistry contract deployed to: ", airdropRegistry.address);
  });
