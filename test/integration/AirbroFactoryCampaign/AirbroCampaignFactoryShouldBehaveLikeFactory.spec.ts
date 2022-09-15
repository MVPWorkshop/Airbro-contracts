import { expect } from "chai";
import { ethers } from "hardhat";
import { randomAddress, treasuryAddress, uri } from "../../shared/constants";
import { constants } from "ethers";

export function AirbroCampaignFactoryShouldBehaveLikeFactory(): void {
  it("should emit NewAirdrop event NewERC1155", async function () {
    await expect(this.airdropRegistry.connect(this.signers.registryAdmin).addFactory(this.airbroCampaignFactory.address))
      .to.emit(this.airdropRegistry, "FactoryWhitelisted")
      .withArgs(this.airbroCampaignFactory.address);

    await expect(this.airbroCampaignFactory.connect(this.signers.backendWallet).closeBeta()).to.emit(
      this.airbroCampaignFactory,
      "BetaClosed",
    );

    await expect(this.airbroCampaignFactory.connect(this.signers.deployer).createNewERC1155DropCampaign(uri)).to.emit(
      this.airdropRegistry,
      "NewAirdrop",
    );
  });

  it("should emit NewAirdrop event NewSB1155", async function () {
    await expect(this.airdropRegistry.connect(this.signers.registryAdmin).addFactory(this.airbroCampaignFactory.address))
      .to.emit(this.airdropRegistry, "FactoryWhitelisted")
      .withArgs(this.airbroCampaignFactory.address);

    await expect(this.airbroCampaignFactory.connect(this.signers.backendWallet).closeBeta()).to.emit(
      this.airbroCampaignFactory,
      "BetaClosed",
    );

    await expect(this.airbroCampaignFactory.connect(this.signers.deployer).createNewSB1155DropCampaign(uri)).to.emit(
      this.airdropRegistry,
      "NewAirdrop",
    );
  });

  it("should emit NewAirdrop event for ExistingERC20", async function () {
    await expect(this.airdropRegistry.connect(this.signers.registryAdmin).addFactory(this.airbroCampaignFactory.address))
      .to.emit(this.airdropRegistry, "FactoryWhitelisted")
      .withArgs(this.airbroCampaignFactory.address);

    await expect(this.airbroCampaignFactory.connect(this.signers.backendWallet).closeBeta()).to.emit(
      this.airbroCampaignFactory,
      "BetaClosed",
    );

    await expect(this.airbroCampaignFactory.connect(this.signers.deployer).createExistingERC20DropCampaign(randomAddress, 1000)).to.emit(
      this.airdropRegistry,
      "NewAirdrop",
    );
  });

  it("should revert NotWhitelisted if factory contract is not whitelisted on airdropRegistry contract", async function () {
    await expect(this.airbroCampaignFactory.connect(this.signers.backendWallet).closeBeta()).to.emit(
      this.airbroCampaignFactory,
      "BetaClosed",
    );

    await expect(this.airbroCampaignFactory.connect(this.signers.deployer).createNewERC1155DropCampaign(uri)).to.be.revertedWith(
      "NotWhitelisted",
    );
  });

  it("should revert NotWhitelisted if factory contract is blacklisted on airdropRegistry contract", async function () {
    await expect(this.airdropRegistry.connect(this.signers.registryAdmin).addFactory(this.airbroCampaignFactory.address))
      .to.emit(this.airdropRegistry, "FactoryWhitelisted")
      .withArgs(this.airbroCampaignFactory.address);

    await expect(this.airbroCampaignFactory.connect(this.signers.backendWallet).closeBeta()).to.emit(
      this.airbroCampaignFactory,
      "BetaClosed",
    );

    await expect(this.airbroCampaignFactory.connect(this.signers.deployer).createNewERC1155DropCampaign(uri)).to.emit(
      this.airdropRegistry,
      "NewAirdrop",
    );

    await expect(this.airdropRegistry.connect(this.signers.registryAdmin).removeFactory(this.airbroCampaignFactory.address))
      .to.emit(this.airdropRegistry, "FactoryBlacklisted")
      .withArgs(this.airbroCampaignFactory.address);

    await expect(this.airbroCampaignFactory.connect(this.signers.deployer).createNewSB1155DropCampaign(uri)).to.be.revertedWith(
      "NotWhitelisted",
    );
  });

  it("should increment totalAirdropsCount", async function () {
    expect(await this.airdropRegistry.totalAirdropsCount()).to.be.equal(constants.Zero);

    await expect(this.airdropRegistry.connect(this.signers.registryAdmin).addFactory(this.airbroCampaignFactory.address))
      .to.emit(this.airdropRegistry, "FactoryWhitelisted")
      .withArgs(this.airbroCampaignFactory.address);

    await expect(this.airbroCampaignFactory.connect(this.signers.backendWallet).closeBeta()).to.emit(
      this.airbroCampaignFactory,
      "BetaClosed",
    );

    await expect(this.airbroCampaignFactory.connect(this.signers.deployer).createNewERC1155DropCampaign(uri)).to.emit(
      this.airdropRegistry,
      "NewAirdrop",
    );

    expect(await this.airdropRegistry.totalAirdropsCount()).to.be.equal(constants.One);
  });
}
