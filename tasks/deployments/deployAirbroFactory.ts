import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { AirbroCampaignFactory } from "../../src/types/contracts/AirbroCampaignFactory";
import { AirbroCampaignFactory__factory } from "../../src/types/factories/contracts/AirbroCampaignFactory__factory";

/**
 * This method will deploy a new version fo the airbro campaign factory contract with whichever
 * constructor parameter manually supplied to it.
 */
task("deploy:airbroCampaignFactory")
  .addPositionalParam("backendwallet", "Address of the backend wallet address")
  .addPositionalParam("airdropregistry", "Address of the airdrop registry contract")
  .addPositionalParam("betawallet", "Address of the airdrop registry contract")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const backendWallet = taskArguments.backendwallet;
    const airdropRegistry = taskArguments.airdropregistry;
    const betaWallet = taskArguments.betawallet;

    console.log(
      `Deploying airbroCampaignFactory with the following parameters: \n\n1.backendWallet ${backendWallet} \n2.airdropRegistry ${airdropRegistry} \n3.betaWallet ${betaWallet}`,
    );

    // TODO a prompt would on this line to check that the params are correct, not sure how to implement

    console.log("getting AirbroCampaignFactory factory...");
    const AirbroCampaignFactoryFactory: AirbroCampaignFactory__factory = <AirbroCampaignFactory__factory>(
      await ethers.getContractFactory("AirbroCampaignFactory")
    );

    console.log("Deploying AirbroCampaignFactory...");
    const airbroCampaignFactory: AirbroCampaignFactory = <AirbroCampaignFactory>(
      await AirbroCampaignFactoryFactory.deploy(backendWallet, airdropRegistry, betaWallet)
    );

    console.log("Awaiting deployment confirmation...");
    await airbroCampaignFactory.deployed();

    console.log("AirbroCampaignFactory contract deployed to: ", airbroCampaignFactory.address);
  });
