import { expect } from "chai";
import { airdropCampaignDataFixture } from "../../shared/fixtures";

// struct used in contract
const chains = {
  Zero: 0,
  Eth: 1,
  Pol: 2,
};

const noxExistantChains = {
  positiveInt: 3,
  negativeInt: -1,
};

export function AirdropCampaignDataShouldBatchAddAirdropCampaignChain(): void {
  describe("should batch add airdrop campaign chain", async function () {
    it("should allow admin to batch add airdrop campaign chain", async function () {
      const randomAddressesArray = [this.signers.alice.address, this.signers.bob.address];

      await expect(
        this.airdropCampaignData
          .connect(this.signers.backendWallet)
          .batchAddAirdropCampaignChain(randomAddressesArray, [chains.Eth, chains.Pol]),
      )
        .to.emit(this.airdropCampaignData, "ChainAdded")
        .withArgs(randomAddressesArray[0], chains.Eth)
        .and.to.emit(this.airdropCampaignData, "ChainAdded")
        .withArgs(randomAddressesArray[1], chains.Pol);

      const chainData = await this.airdropCampaignData.airdrops(this.signers.alice.address);
      await expect(chainData.chain).to.be.equal(chains.Eth);
    });

    it("should revert non admin wallet", async function () {
      const randomAddressesArray = [this.signers.alice.address, this.signers.bob.address];

      await expect(
        this.airdropCampaignData.connect(this.signers.alice).batchAddAirdropCampaignChain(randomAddressesArray, [chains.Eth, chains.Pol]),
      ).to.be.revertedWith("NotAdmin");
    });

    it("should revert if length of array arguments do not match", async function () {
      /* 1. Two addresses, one chain */
      const twoRandomAddressesArray = [this.signers.alice.address, this.signers.bob.address]; // 2 addresses
      const oneCampaignChainArray = [chains.Pol]; // 1 chain

      await expect(
        this.airdropCampaignData
          .connect(this.signers.backendWallet)
          .batchAddAirdropCampaignChain(twoRandomAddressesArray, oneCampaignChainArray),
      ).to.be.revertedWith("UnequalArrays");

      /* 2. One address, two chains */
      const oneRandomAddressArray = [this.signers.alice.address]; // 1 address
      const twoCampaignChainsArray = [chains.Eth, chains.Pol]; // 2 chains

      await expect(
        this.airdropCampaignData
          .connect(this.signers.backendWallet)
          .batchAddAirdropCampaignChain(oneRandomAddressArray, twoCampaignChainsArray),
      ).to.be.revertedWith("UnequalArrays");
    });

    it("should revert if length of array exceeds batchChainArrayLimit", async function () {
      let startIndex = 0;
      const endIndex = (await this.airdropCampaignData.batchChainArrayLimit()) + 1;
      const randomAddressesArray = [];
      const randomChainsArray = [];
      for (startIndex; startIndex < endIndex; startIndex++) {
        randomAddressesArray.push(this.signers.bob.address);
        randomChainsArray.push(chains.Eth);
      }
      // console.log("Max Gas Limit -> addressArrayLength: " + randomAddressesArray.length + " chainArrayLength: " + randomChainsArray.length); // 601
      await expect(
        this.airdropCampaignData.connect(this.signers.backendWallet).batchAddAirdropCampaignChain(randomAddressesArray, randomChainsArray),
      ).to.be.revertedWith("ArrayTooLong");
    });

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
      await expect(chainData.chain).to.be.equal(chains.Zero);
    });

    it("should revert if sent chain data is already set for one of those campaigns", async function () {
      const randomAddressesArray = [this.signers.alice.address, this.signers.bob.address];
      const randomChainsArray = [chains.Eth, chains.Pol];
      await expect(
        this.airdropCampaignData.connect(this.signers.backendWallet).batchAddAirdropCampaignChain(randomAddressesArray, randomChainsArray),
      )
        .to.emit(this.airdropCampaignData, "ChainAdded")
        .withArgs(randomAddressesArray[0], randomChainsArray[0])
        .and.to.emit(this.airdropCampaignData, "ChainAdded")
        .withArgs(randomAddressesArray[1], randomChainsArray[1]);

      await expect(
        this.airdropCampaignData.connect(this.signers.backendWallet).batchAddAirdropCampaignChain(randomAddressesArray, randomChainsArray),
      ).to.be.revertedWith(`ChainAlreadySet`);
    });
  });
}
