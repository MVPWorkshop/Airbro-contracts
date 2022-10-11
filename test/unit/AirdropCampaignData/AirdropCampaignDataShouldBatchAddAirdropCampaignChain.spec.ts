import { expect } from "chai";
import { chains } from "../../shared/constants";

const batchArrayLimit: number = 1200; // an amount for the length of array submitted in the batchAdd methods that will fail

export function AirdropCampaignDataShouldBatchAddAirdropCampaignChain(): void {
  describe("should batch add airdrop campaign chain", async function () {
    it("should allow admin to batch add airdrop campaign chain", async function () {
      const randomAddressesArray = [this.signers.alice.address, this.signers.bob.address];

      await expect(
        this.airdropCampaignData
          .connect(this.signers.backendWallet)
          .batchAddAirdropCampaignChain(randomAddressesArray, [chains.Eth, chains.Pols]),
      )
        .to.emit(this.airdropCampaignData, "ChainAdded")
        .withArgs(randomAddressesArray[0], chains.Eth)
        .and.to.emit(this.airdropCampaignData, "ChainAdded")
        .withArgs(randomAddressesArray[1], chains.Pols);

      const chainData = await this.airdropCampaignData.airdrops(this.signers.alice.address);
      expect(chainData.chain).to.be.equal(chains.Eth);
    });

    it("should revert non admin wallet", async function () {
      const randomAddressesArray = [this.signers.alice.address, this.signers.bob.address];

      await expect(
        this.airdropCampaignData.connect(this.signers.alice).batchAddAirdropCampaignChain(randomAddressesArray, [chains.Eth, chains.Pols]),
      ).to.be.revertedWith("NotAirbroManager");
    });

    it("should revert if length of array arguments do not match", async function () {
      /* 1. Two addresses, one chain */
      const twoRandomAddressesArray = [this.signers.alice.address, this.signers.bob.address]; // 2 addresses
      const oneCampaignChainArray = [chains.Pols]; // 1 chain

      await expect(
        this.airdropCampaignData
          .connect(this.signers.backendWallet)
          .batchAddAirdropCampaignChain(twoRandomAddressesArray, oneCampaignChainArray),
      ).to.be.revertedWith("UnequalArrays");

      /* 2. One address, two chains */
      const oneRandomAddressArray = [this.signers.alice.address]; // 1 address
      const twoCampaignChainsArray = [chains.Eth, chains.Pols]; // 2 chains

      await expect(
        this.airdropCampaignData
          .connect(this.signers.backendWallet)
          .batchAddAirdropCampaignChain(oneRandomAddressArray, twoCampaignChainsArray),
      ).to.be.revertedWith("UnequalArrays");
    });

    /* Not necessary, revert will happen on its own */
    /* it("should revert if length of array exceeds batchArrayLimit", async function () {
      await expect(
        this.airdropCampaignData
          .connect(this.signers.backendWallet)
          .batchAddAirdropCampaignChain(this.randomAddressesArray, this.randomChainsArray),
      ).to.be.reverted;
    }); */

    it("should revert if sent chain data is 0 (status.zero)", async function () {
      const randomAddressesArray = [this.signers.alice.address, this.signers.bob.address];
      const randomChainsArray = [chains.Eth, chains.Zero];
      await expect(
        this.airdropCampaignData.connect(this.signers.backendWallet).batchAddAirdropCampaignChain(randomAddressesArray, randomChainsArray),
      )
        .to.emit(this.airdropCampaignData, "ChainAdded")
        .withArgs(randomAddressesArray[0], chains.Eth)
        .and.to.be.revertedWith(`ChainDataNotSet`);

      // to check if all was reverted, even valid chain data
      const chainData = await this.airdropCampaignData.airdrops(this.signers.alice.address);
      expect(chainData.chain).to.be.equal(chains.Zero);
    });

    it("should revert if chain data is already set for one of those campaigns", async function () {
      const randomAddressesArray = [this.signers.alice.address, this.signers.bob.address];
      const randomChainsArray = [chains.Eth, chains.Pols];

      // setting chain data
      await expect(
        this.airdropCampaignData.connect(this.signers.backendWallet).batchAddAirdropCampaignChain(randomAddressesArray, randomChainsArray),
      )
        .to.emit(this.airdropCampaignData, "ChainAdded")
        .withArgs(randomAddressesArray[0], randomChainsArray[0])
        .and.to.emit(this.airdropCampaignData, "ChainAdded")
        .withArgs(randomAddressesArray[1], randomChainsArray[1]);

      // trying to reset a previously set chain for a campaign
      await expect(
        this.airdropCampaignData.connect(this.signers.backendWallet).batchAddAirdropCampaignChain(randomAddressesArray, randomChainsArray),
      ).to.be.revertedWith(`ChainAlreadySet`);
    });
  });
}
