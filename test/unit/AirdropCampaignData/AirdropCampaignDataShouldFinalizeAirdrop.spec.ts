import { expect } from "chai";
import { randomAddress as campaignAddress } from "../../shared/constants";

export function AirdropCampaignDataShouldFinalizeAirdrop(): void {
  describe("should finalize airdrop", async function () {
    it("should allow backend to finalize airdrop", async function () {
      await expect(this.airdropCampaignData.connect(this.signers.backendWallet).finalizeAirdrop(campaignAddress))
        .to.emit(this.airdropCampaignData, "FinalizedAirdrop")
        .withArgs(campaignAddress);
    });
    it("should revert campaign finalization attempt from non bakckend wallet address", async function () {
      await expect(this.airdropCampaignData.connect(this.signers.alice).finalizeAirdrop(campaignAddress)).to.be.revertedWith("NotAdmin");
    });

    // it("should revert if chain is not set", async function () {}); //empty test
  });
}
