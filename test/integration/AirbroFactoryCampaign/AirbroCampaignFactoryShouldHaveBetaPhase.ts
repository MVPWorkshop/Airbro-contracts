import { expect } from "chai";
import { ethers } from "hardhat";
import { randomAddress, treasuryAddress, name, symbol, uri } from "../../shared/constants";
import { constants } from "ethers";

export function AirbroCampaignFactoryShouldHaveBetaPhase(): void {
  it("should not allow anyone but betaAddress to create dropCampaigns while beta bool is active", async function () {
    await expect(this.airdropRegistry.connect(this.signers.registryAdmin).addFactory(this.airbroCampaignFactory.address))
      .to.emit(this.airdropRegistry, "FactoryWhitelisted")
      .withArgs(this.airbroCampaignFactory.address);

    expect(await this.airbroCampaignFactory.beta()).to.be.equal(true);

    await expect(
      this.airbroCampaignFactory.connect(this.signers.deployer).createNewSB1155DropCampaign(name, symbol, uri),
    ).to.be.revertedWith("NotBetaAddress");

    await expect(this.airbroCampaignFactory.connect(this.signers.betaAddress).createNewSB1155DropCampaign(name, symbol, uri)).to.emit(
      this.airdropRegistry,
      "NewAirdrop",
    );

    await expect(this.airbroCampaignFactory.connect(this.signers.backendWallet).closeBeta()).to.emit(
      this.airbroCampaignFactory,
      "BetaClosed",
    );

    expect(await this.airbroCampaignFactory.beta()).to.be.equal(false);

    await expect(this.airbroCampaignFactory.connect(this.signers.deployer).createNewSB1155DropCampaign(name, symbol, uri)).to.emit(
      this.airdropRegistry,
      "NewAirdrop",
    );
  });
}
