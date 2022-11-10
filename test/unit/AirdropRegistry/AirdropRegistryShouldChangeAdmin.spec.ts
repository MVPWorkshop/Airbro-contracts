import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Wallet, constants } from "ethers";
import { randomAddress } from "../../shared/constants";

export function AirdropRegistryShouldChangeAdmin(): void {
  describe("airdrop registry admin changing functionality", async function () {
    // Nikola - should this test be here?
    it("should only allow admin to whitelist factories", async function () {
      const admin: SignerWithAddress = this.signers.registryAdmin;
      const nonAdmin: Wallet = this.signers.jerry;

      await expect(this.airdropRegistry.connect(nonAdmin).addFactory(randomAddress)).to.be.revertedWith("NotAdmin");
      await expect(this.airdropRegistry.connect(admin).addFactory(randomAddress)).to.emit(this.airdropRegistry, "FactoryWhitelisted");
    });

    // Nikola - should this test be here?
    it("should only allow admin to blacklist factories", async function () {
      const admin: SignerWithAddress = this.signers.registryAdmin;
      const nonAdmin: Wallet = this.signers.jerry;

      await expect(this.airdropRegistry.connect(nonAdmin).removeFactory(randomAddress)).to.be.revertedWith("NotAdmin");
      await expect(this.airdropRegistry.connect(admin).removeFactory(randomAddress)).to.emit(this.airdropRegistry, "FactoryBlacklisted");
    });

    it("should be able to change admin", async function () {
      const newAdmin: Wallet = this.signers.jerry;
      // changing admin address in the airdropRegistry Contract
      await expect(this.airdropRegistry.connect(this.signers.registryAdmin).initiateAdminTranfer(newAdmin.address))
        .to.emit(this.airdropRegistry, `AdminTransferInitiated`)
        .withArgs(newAdmin.address);

      await expect(this.airdropRegistry.connect(newAdmin).acceptAdminTransfer())
        .to.emit(this.airdropRegistry, `AdminChanged`)
        .withArgs(this.signers.jerry.address);
    });

    it("should return true if transfer is initiated", async function () {
      const admin: SignerWithAddress = this.signers.registryAdmin;
      expect(await this.airdropRegistry.connect(admin).isTransferInitiated()).to.be.equal(false);

      await this.airdropRegistry.connect(this.signers.registryAdmin).initiateAdminTranfer(randomAddress);
      expect(await this.airdropRegistry.connect(admin).isTransferInitiated()).to.be.equal(true);
    });

    it("should revert when non admin address tries to initialize admin transfer", async function () {
      const nonAdmin: Wallet = this.signers.jerry;
      await expect(this.airdropRegistry.connect(nonAdmin).initiateAdminTranfer(this.signers.jerry.address)).to.be.revertedWith(`NotAdmin`);
    });

    it("should revert if admin tries to set address(0) as the new admin", async function () {
      await expect(this.airdropRegistry.connect(this.signers.registryAdmin).initiateAdminTranfer(constants.AddressZero)).to.be.revertedWith(
        "InvalidNewAdminAddress",
      );
    });

    it("should revert if admin tries to initiate transfer to the same address twice", async function () {
      const newAdmin: Wallet = this.signers.jerry;

      await this.airdropRegistry.connect(this.signers.registryAdmin).initiateAdminTranfer(newAdmin.address);

      await expect(this.airdropRegistry.connect(this.signers.registryAdmin).initiateAdminTranfer(newAdmin.address)).to.be.revertedWith(
        "TransferToAddressAlreadyInitiated",
      );
    });

    it("should emit AdminTransferCanceled and AdminTransferInitiated when transfer has already been initiated and we try to re-initiate to another address", async function () {
      const newAdmin1: Wallet = this.signers.jerry;
      const newAdmin2: Wallet = this.signers.lisa;

      // initiating to newAdmin1
      await this.airdropRegistry.connect(this.signers.registryAdmin).initiateAdminTranfer(newAdmin1.address);

      // initiating to newAdmin2
      await expect(this.airdropRegistry.connect(this.signers.registryAdmin).initiateAdminTranfer(newAdmin2.address))
        .to.emit(this.airdropRegistry, "AdminTransferCanceled")
        .withArgs(newAdmin1.address)
        .and.to.emit(this.airdropRegistry, "AdminTransferInitiated")
        .withArgs(newAdmin2.address);
    });

    it("should allow admin to cancel initiated admin transfer", async function () {
      await this.airdropRegistry.connect(this.signers.registryAdmin).initiateAdminTranfer(randomAddress);
      await expect(this.airdropRegistry.connect(this.signers.registryAdmin).cancelAdminTransfer())
        .to.emit(this.airdropRegistry, "AdminTransferCanceled")
        .withArgs(randomAddress);
    });

    it("should revert when non eligible account tries to accept admin transfer", async function () {
      const notNewAdminSigner: Wallet = this.signers.lisa;
      await expect(this.airdropRegistry.connect(notNewAdminSigner).acceptAdminTransfer()).to.be.revertedWith("NotEligibleForAdminTransfer"); // Nikola - can I get the address argument here?
    });
  });
}
