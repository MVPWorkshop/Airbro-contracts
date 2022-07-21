import { expect } from "chai";

const bytes32MerkleRootHashes = [
  "0x0000000000000000000000000000000000000000000000000000000000000000",
  "0x0000000000000000000000000000000000000000000000000000000000000001",
];

// struct used in contract
const chains = {
  Zero: 0,
  Eth: 1,
  Pols: 2,
};

export function AirdropCampaignDataShouldBatchAddDailyMerkleRootHash(): void {
  describe("should batch set daily merkle root hash", async function () {
    it("should allow admin to set daily merkle root hash", async function () {
      const randomAddressesArray = [this.signers.alice.address, this.signers.bob.address]; // two random addresses

      // adding chain (mandatory before editing anything for a campaign on this contract)
      await this.airdropCampaignData
        .connect(this.signers.backendWallet)
        .batchAddAirdropCampaignChain(randomAddressesArray, [chains.Eth, chains.Pols]);

      await expect(
        this.airdropCampaignData
          .connect(this.signers.backendWallet)
          .batchAddDailyMerkleRootHash(randomAddressesArray, bytes32MerkleRootHashes),
      )
        .to.emit(this.airdropCampaignData, "MerkleRootHashAdded")
        .withArgs(randomAddressesArray[0], bytes32MerkleRootHashes[0])
        .and.to.emit(this.airdropCampaignData, "MerkleRootHashAdded")
        .withArgs(randomAddressesArray[1], bytes32MerkleRootHashes[1]);
    });

    it("should revert non admin wallet", async function () {
      const randomAddressesArray = [this.signers.alice.address, this.signers.bob.address]; // two random addresses

      await expect(
        this.airdropCampaignData.connect(this.signers.alice).batchAddDailyMerkleRootHash(randomAddressesArray, bytes32MerkleRootHashes),
      ).to.be.revertedWith("NotAdmin");
    });

    it("should revert if length of array arguments do not match", async function () {
      /* 1. Two addresses, one hash */
      const twoRandomAddressesArray = [this.signers.alice.address, this.signers.bob.address]; // 2 addresses
      const oneHashArray = ["0x0000000000000000000000000000000000000000000000000000000000000000"]; // 1 hash

      await expect(
        this.airdropCampaignData.connect(this.signers.backendWallet).batchAddDailyMerkleRootHash(twoRandomAddressesArray, oneHashArray),
      ).to.be.revertedWith("UnequalArrays");

      /* 2. One address, two hashes */
      const oneRandomAddressArray = [this.signers.alice.address]; // 1 address
      const twoHashesArray = [
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      ]; // 2 hashes

      await expect(
        this.airdropCampaignData.connect(this.signers.backendWallet).batchAddDailyMerkleRootHash(oneRandomAddressArray, twoHashesArray),
      ).to.be.revertedWith("UnequalArrays");
    });

    it("should revert if length of array exceeds batchHashArrayLimit", async function () {
      // over 630 exceeds the max gas limit
      let startIndex = 0;
      const endIndex = (await this.airdropCampaignData.batchHashArrayLimit()) + 1;
      const randomAddressesArray = [];
      const bytes32MerkleRootHashArray = [];
      for (startIndex; startIndex < endIndex; startIndex++) {
        randomAddressesArray.push(this.signers.bob.address);
        bytes32MerkleRootHashArray.push("0x0000000000000000000000000000000000000000000000000000000000000000");
      }
      // console.log(
      //   "Max Gas Limit -> addressArrayLength: " + randomAddressesArray.length + " chainArrayLength: " + bytes32MerkleRootHashArray.length,
      // ); // 601

      await expect(
        this.airdropCampaignData
          .connect(this.signers.backendWallet)
          .batchAddDailyMerkleRootHash(randomAddressesArray, bytes32MerkleRootHashArray),
      ).to.be.revertedWith("ArrayTooLong");
    });

    it("should revert if one of the campaigns does not have the chain data set", async function () {});
  });
}
