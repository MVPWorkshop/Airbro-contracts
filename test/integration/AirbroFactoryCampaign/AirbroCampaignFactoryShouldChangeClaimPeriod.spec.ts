import { expect } from "chai";
import { ethers } from "hardhat";
import { constants } from "ethers";

export function AirbroCampaignFactoryShouldChangeClaimPeriod(): void {
  const newClaimPeriod = 15;

  it("admin should be able to change claim period", async function () {
    // checking if admin address is able to change claim period
    void expect(await this.airbroCampaignFactory.connect(this.signers.backendWallet).changeClaimPeriod(newClaimPeriod))
      .to.emit(this.airbroCampaignFactory, "ClaimPeriodChanged")
      .withArgs(newClaimPeriod);

    expect(await this.airbroCampaignFactory.claimPeriodInDays()).to.be.equal(newClaimPeriod);
  });

  it("new admin should be able to change claim period", async function () {
    // changing admin address in the airbroCampaignFactory Contract
    await expect(this.airbroCampaignFactory.connect(this.signers.backendWallet).changeAdmin(this.signers.lisa.address))
      .to.emit(this.airbroCampaignFactory, `AdminChanged`)
      .withArgs(this.signers.lisa.address);

    expect(await this.airbroCampaignFactory.admin()).to.be.equal(this.signers.lisa.address);

    // checking if old admin can change claim period
    await expect(this.airbroCampaignFactory.connect(this.signers.backendWallet).changeClaimPeriod(newClaimPeriod)).to.be.revertedWith(
      `NotAdmin`,
    );

    // checking if new admin address is able to change claim period
    void expect(await this.airbroCampaignFactory.connect(this.signers.lisa).changeClaimPeriod(newClaimPeriod))
      .to.emit(this.airbroCampaignFactory, "ClaimPeriodChanged")
      .withArgs(newClaimPeriod);

    expect(await this.airbroCampaignFactory.claimPeriodInDays()).to.be.equal(newClaimPeriod);
  });

  it("new claim period should be different on all dropContracts made after it has been changed", async function () {
    const oldClaimPeriodInDays = await this.airbroCampaignFactory.claimPeriodInDays();

    await expect(this.airbroCampaignFactory.connect(this.signers.backendWallet).closeBeta()).to.emit(
      this.airbroCampaignFactory,
      "BetaClosed",
    );

    // changing claim period
    void expect(await this.airbroCampaignFactory.connect(this.signers.backendWallet).changeClaimPeriod(newClaimPeriod))
      .to.emit(this.airbroCampaignFactory, "ClaimPeriodChanged")
      .withArgs(newClaimPeriod);

    // checking if claim period has been changed on factory contract
    expect(await this.airbroCampaignFactory.claimPeriodInDays()).to.be.equal(newClaimPeriod);

    // checking if claim period has changed on a campaign contract that has been deployed prior - it should not
    expect(await this.existingERC20DropCampaign.claimPeriodInDays()).to.be.equal(oldClaimPeriodInDays);

    await expect(this.airdropRegistry.connect(this.signers.registryAdmin).addFactory(this.airbroCampaignFactory.address))
      .to.emit(this.airdropRegistry, "FactoryWhitelisted")
      .withArgs(this.airbroCampaignFactory.address);

    const tokenSupply: number = this.existingERC20DropCampaignArgs.tokenSupply; // 100

    // creating the ExistingERC20DropCampaign from the factory contract
    await expect(
      this.airbroCampaignFactory.connect(this.signers.deployer).createExistingERC20DropCampaign(this.testToken.address, tokenSupply),
    ).to.emit(this.airdropRegistry, "NewAirdrop");
    const existingERC20DropCampaignFactory = await ethers.getContractFactory("ExistingERC20DropCampaign");
    const ExistingERC20DropCampaignContract = existingERC20DropCampaignFactory.attach(await this.airdropRegistry.airdrops(constants.Zero));

    // checking if claim period has changed on a newly made campaign contract after the claim period change
    expect(await ExistingERC20DropCampaignContract.claimPeriodInDays()).to.be.equal(newClaimPeriod);
  });
}
