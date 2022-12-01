import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Wallet, constants } from "ethers";
import { randomAddress } from "../../shared/constants";

export function AirbroCampaignFactoryShouldChangeAdmin(): void {
  describe("airdrop campaign factory admin changing functionality", async function () {
    it("should be able to change admin", async function () {
      const newAdmin: Wallet = this.signers.jerry;
      // changing admin address in the airdropRegistry Contract
      await expect(
        this.airbroCampaignFactory.connect(this.signers.backendWallet).initiateAdminTransfer(newAdmin.address),
      )
        .to.emit(this.airbroCampaignFactory, `AdminTransferInitiated`)
        .withArgs(newAdmin.address);

      await expect(this.airbroCampaignFactory.connect(newAdmin).acceptAdminTransfer())
        .to.emit(this.airbroCampaignFactory, `AdminChanged`)
        .withArgs(this.signers.jerry.address);

      expect(await this.airbroCampaignFactory.admin()).to.be.equal(this.signers.jerry.address);
    });

    it("should return true if transfer is initiated", async function () {
      const admin: SignerWithAddress = this.signers.backendWallet;
      expect(await this.airbroCampaignFactory.connect(admin).isTransferInitiated()).to.be.equal(false);

      await this.airbroCampaignFactory.connect(this.signers.backendWallet).initiateAdminTransfer(randomAddress);
      expect(await this.airbroCampaignFactory.connect(admin).isTransferInitiated()).to.be.equal(true);
    });

    it("should revert when non admin address tries to initialize admin transfer", async function () {
      const nonAdmin: Wallet = this.signers.jerry;
      await expect(
        this.airbroCampaignFactory.connect(nonAdmin).initiateAdminTransfer(this.signers.jerry.address),
      ).to.be.revertedWith(`NotAdmin`);
    });

    it("should revert if admin tries to set address(0) as the new admin", async function () {
      await expect(
        this.airbroCampaignFactory.connect(this.signers.backendWallet).initiateAdminTransfer(constants.AddressZero),
      ).to.be.revertedWith("InvalidNewAdminAddress");
    });

    it("should revert if admin tries to initiate transfer to the same address twice", async function () {
      const newAdmin: Wallet = this.signers.jerry;

      await this.airbroCampaignFactory.connect(this.signers.backendWallet).initiateAdminTransfer(newAdmin.address);

      await expect(
        this.airbroCampaignFactory.connect(this.signers.backendWallet).initiateAdminTransfer(newAdmin.address),
      ).to.be.revertedWith("TransferToAddressAlreadyInitiated");
    });

    it("should emit AdminTransferCanceled and AdminTransferInitiated when transfer has already been initiated and we try to re-initiate to another address", async function () {
      const newAdmin1: Wallet = this.signers.jerry;
      const newAdmin2: Wallet = this.signers.lisa;

      // initiating to newAdmin1
      await this.airbroCampaignFactory.connect(this.signers.backendWallet).initiateAdminTransfer(newAdmin1.address);

      // initiating to newAdmin2
      await expect(
        this.airbroCampaignFactory.connect(this.signers.backendWallet).initiateAdminTransfer(newAdmin2.address),
      )
        .to.emit(this.airbroCampaignFactory, "AdminTransferCanceled")
        .withArgs(newAdmin1.address)
        .and.to.emit(this.airbroCampaignFactory, "AdminTransferInitiated")
        .withArgs(newAdmin2.address);
    });

    it("should allow admin to cancel initiated admin transfer", async function () {
      await this.airbroCampaignFactory.connect(this.signers.backendWallet).initiateAdminTransfer(randomAddress);
      await expect(this.airbroCampaignFactory.connect(this.signers.backendWallet).cancelAdminTransfer())
        .to.emit(this.airbroCampaignFactory, "AdminTransferCanceled")
        .withArgs(randomAddress);
    });

    it("should revert when non eligible account tries to accept admin transfer", async function () {
      const notNewAdminSigner: Wallet = this.signers.lisa;
      await expect(this.airbroCampaignFactory.connect(notNewAdminSigner).acceptAdminTransfer()).to.be.revertedWith(
        "NotEligibleForAdminTransfer",
      ); // Nikola - can I get the address argument here?
    });
  });
}
