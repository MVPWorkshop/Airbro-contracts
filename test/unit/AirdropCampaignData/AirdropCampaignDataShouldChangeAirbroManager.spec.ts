import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Wallet, constants } from "ethers";
import { randomAddress } from "../../shared/constants";

export function AirdropCampaignDataShouldChangeAirbroManager(): void {
  describe("should change airbroManager", async function () {
    it("should be able to change airbroManager", async function () {
      const newAirbroManager: Wallet = this.signers.jerry;
      // changing airbro manager address in the airdropRegistry Contract
      await expect(
        this.airdropCampaignData.connect(this.signers.backendWallet).initiateManagerTranfer(newAirbroManager.address),
      )
        .to.emit(this.airdropCampaignData, `ManagerTransferInitiated`)
        .withArgs(newAirbroManager.address);

      await expect(this.airdropCampaignData.connect(newAirbroManager).acceptManagerTransfer())
        .to.emit(this.airdropCampaignData, `ManagerChanged`)
        .withArgs(this.signers.jerry.address);
    });

    it("should return true if transfer is initiated", async function () {
      const airbroManager: SignerWithAddress = this.signers.backendWallet;
      expect(await this.airdropCampaignData.connect(airbroManager).isTransferInitiated()).to.be.equal(false);

      await this.airdropCampaignData.connect(this.signers.backendWallet).initiateManagerTranfer(randomAddress);
      expect(await this.airdropCampaignData.connect(airbroManager).isTransferInitiated()).to.be.equal(true);
    });

    it("should revert when non manager address tries to initialize manager transfer", async function () {
      const nonAirbroManager: Wallet = this.signers.jerry;
      await expect(
        this.airdropCampaignData.connect(nonAirbroManager).initiateManagerTranfer(this.signers.jerry.address),
      ).to.be.revertedWith(`NotAirbroManager`);
    });

    it("should revert if airbroManager tries to set address(0) as the newAirbroManager", async function () {
      await expect(
        this.airdropCampaignData.connect(this.signers.backendWallet).initiateManagerTranfer(constants.AddressZero),
      ).to.be.revertedWith("InvalidNewManagerAddress");
    });

    it("should revert if airbroManager tries to initiate transfer to the same address twice", async function () {
      const newAirbroManager: Wallet = this.signers.jerry;

      await this.airdropCampaignData
        .connect(this.signers.backendWallet)
        .initiateManagerTranfer(newAirbroManager.address);

      await expect(
        this.airdropCampaignData.connect(this.signers.backendWallet).initiateManagerTranfer(newAirbroManager.address),
      ).to.be.revertedWith("TransferToAddressAlreadyInitiated");
    });

    it("should emit ManagerTransferCanceled and ManagerTransferInitiated when transfer has already been initiated and we try to re-initiate to another address", async function () {
      const newManager1: Wallet = this.signers.jerry;
      const newManager2: Wallet = this.signers.lisa;

      // initiating to newManager1
      await this.airdropCampaignData.connect(this.signers.backendWallet).initiateManagerTranfer(newManager1.address);

      // initiating to newManager2
      await expect(
        this.airdropCampaignData.connect(this.signers.backendWallet).initiateManagerTranfer(newManager2.address),
      )
        .to.emit(this.airdropCampaignData, "ManagerTransferCanceled")
        .withArgs(newManager1.address)
        .and.to.emit(this.airdropCampaignData, "ManagerTransferInitiated")
        .withArgs(newManager2.address);
    });

    it("should allow airbroManager to cancel initiated manager transfer", async function () {
      await this.airdropCampaignData.connect(this.signers.backendWallet).initiateManagerTranfer(randomAddress);
      await expect(this.airdropCampaignData.connect(this.signers.backendWallet).cancelManagerTransfer())
        .to.emit(this.airdropCampaignData, "ManagerTransferCanceled")
        .withArgs(randomAddress);
    });

    it("should revert when non eligible account tries to accept manager transfer", async function () {
      const notNewAirbroManager: Wallet = this.signers.lisa;
      await expect(this.airdropCampaignData.connect(notNewAirbroManager).acceptManagerTransfer()).to.be.revertedWith(
        "NotEligibleForManagerTransfer",
      );
    });
  });
}
