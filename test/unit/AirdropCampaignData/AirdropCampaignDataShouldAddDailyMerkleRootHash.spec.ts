import { expect } from "chai";
import { randomAddress } from "../../shared/constants";

const bytes32MerkleRootHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

// struct used in contract
const chains = {
  Zero: 0,
  Eth: 1,
  Pols: 2,
};

export function AirdropCampaignDataShouldAddDailyMerkleRootHash(): void {
  describe("should set daily merkle root hash", async function () {
    it("should allow admin to set daily merkle root hash", async function () {
      // adding chain (mandatory before editing anything for a campaign on this contract)
      await this.airdropCampaignData.connect(this.signers.backendWallet).addAirdropCampaignChain(randomAddress, chains.Eth);

      await expect(
        this.airdropCampaignData.connect(this.signers.backendWallet).addDailyMerkleRootHash(randomAddress, bytes32MerkleRootHash),
      )
        .to.emit(this.airdropCampaignData, "MerkleRootHashAdded")
        .withArgs(randomAddress, bytes32MerkleRootHash);

      //   console.log(await this.airdropCampaignData.connect(this.signers.backendWallet).airdrops(randomAddress)); //returns 0, why? Maybe we need a method to specifically construct all the data for users to view
    });
    it("should revert non admin wallet from setting the daily merkle root hash", async function () {
      // adding chain (mandatory before editing anything for a campaign on this contract)
      await this.airdropCampaignData.connect(this.signers.backendWallet).addAirdropCampaignChain(randomAddress, chains.Eth);

      await expect(
        this.airdropCampaignData.connect(this.signers.alice).addDailyMerkleRootHash(randomAddress, bytes32MerkleRootHash),
      ).to.be.revertedWith("NotAdmin");
    });

    it("should revert if chain is not set", async function () {
      await expect(
        this.airdropCampaignData.connect(this.signers.backendWallet).addDailyMerkleRootHash(randomAddress, bytes32MerkleRootHash),
      ).to.be.revertedWith("ChainDataNotSet");
    });
  });
}
