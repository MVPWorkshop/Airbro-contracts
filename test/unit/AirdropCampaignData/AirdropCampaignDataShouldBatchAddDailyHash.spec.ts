import { expect } from "chai";
import { chains } from "../../shared/constants";

const bytes32MerkleRootHashes = [
  "0x0000000000000000000000000000000000000000000000000000000000000000",
  "0x0000000000000000000000000000000000000000000000000000000000000001",
];

export function AirdropCampaignDataShouldbatchAddDailyHash(): void {
  describe("should batch set daily merkle root hash", async function () {
    it("should allow admin to set daily merkle root hash", async function () {
      const randomAddressesArray = [this.signers.alice.address, this.signers.bob.address]; // two random addresses

      // adding chain (mandatory before editing anything for a campaign on this contract)
      await this.airdropCampaignData
        .connect(this.signers.backendWallet)
        .batchAddAirdropCampaignChain(randomAddressesArray, [chains.Eth, chains.Pols]);

      await expect(
        this.airdropCampaignData.connect(this.signers.backendWallet).batchAddDailyHash(randomAddressesArray, bytes32MerkleRootHashes),
      )
        .to.emit(this.airdropCampaignData, "HashAdded")
        .withArgs(randomAddressesArray[0], bytes32MerkleRootHashes[0])
        .and.to.emit(this.airdropCampaignData, "HashAdded")
        .withArgs(randomAddressesArray[1], bytes32MerkleRootHashes[1]);
    });

    it("should revert non admin wallet", async function () {
      const randomAddressesArray = [this.signers.alice.address, this.signers.bob.address]; // two random addresses

      await expect(
        this.airdropCampaignData.connect(this.signers.alice).batchAddDailyHash(randomAddressesArray, bytes32MerkleRootHashes),
      ).to.be.revertedWith("NotAirbroManager");
    });

    it("should revert if length of array arguments do not match", async function () {
      /* 1. Two addresses, one hash */
      const twoRandomAddressesArray = [this.signers.alice.address, this.signers.bob.address]; // 2 addresses
      const oneHashArray = ["0x0000000000000000000000000000000000000000000000000000000000000000"]; // 1 hash

      await expect(
        this.airdropCampaignData.connect(this.signers.backendWallet).batchAddDailyHash(twoRandomAddressesArray, oneHashArray),
      ).to.be.revertedWith("UnequalArrays");

      /* 2. One address, two hashes */
      const oneRandomAddressArray = [this.signers.alice.address]; // 1 address
      const twoHashesArray = [
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      ]; // 2 hashes

      await expect(
        this.airdropCampaignData.connect(this.signers.backendWallet).batchAddDailyHash(oneRandomAddressArray, twoHashesArray),
      ).to.be.revertedWith("UnequalArrays");
    });
  });
}
