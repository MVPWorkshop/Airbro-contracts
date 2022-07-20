import { expect } from "chai";
import { randomAddress } from "../../shared/constants";

const bytes32MerkleRootHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

export function AirdropCampaignDataShouldAddDailyMerkleRootHash(): void {
  describe("should set daily merkle root hash", async function () {
    it("should allow admin to set daily merkle root hash", async function () {
      await expect(
        this.airdropCampaignData.connect(this.signers.backendWallet).addDailyMerkleRootHash(randomAddress, bytes32MerkleRootHash),
      )
        .to.emit(this.airdropCampaignData, "MerkleRootHashAdded")
        .withArgs(randomAddress, bytes32MerkleRootHash);

      //   console.log(await this.airdropCampaignData.connect(this.signers.backendWallet).airdrops(randomAddress)); //returns 0, why? Maybe we need a method to specifically construct all the data for users to view
    });
    it("should revert non admin wallet from setting the daily merkle root hash", async function () {
      await expect(
        this.airdropCampaignData.connect(this.signers.alice).addDailyMerkleRootHash(randomAddress, bytes32MerkleRootHash),
      ).to.be.revertedWith("NotAdmin");
    });
  });
}
