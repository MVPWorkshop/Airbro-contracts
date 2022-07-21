import { expect } from "chai";

// struct used in contract
const chains = {
  Zero: 0,
  Eth: 1,
  Pols: 2,
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
          .batchAddAirdropCampaignChain(randomAddressesArray, [chains.Eth, chains.Pols]),
      )
        .to.emit(this.airdropCampaignData, "ChainAdded")
        .withArgs(randomAddressesArray[0], chains.Eth)
        .and.to.emit(this.airdropCampaignData, "ChainAdded")
        .withArgs(randomAddressesArray[1], chains.Pols);
    });

    it("should revert non admin wallet", async function () {
      const randomAddressesArray = [this.signers.alice.address, this.signers.bob.address];

      await expect(
        this.airdropCampaignData.connect(this.signers.alice).batchAddAirdropCampaignChain(randomAddressesArray, [chains.Eth, chains.Pols]),
      ).to.be.revertedWith("NotAdmin");
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

    // it("should revert if chain is not set", async function () {}); //empty test
  });
}
