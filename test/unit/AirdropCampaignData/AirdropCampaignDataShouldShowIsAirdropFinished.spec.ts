import { expect } from "chai";
import { randomAddress as campaignAddress } from "../../shared/constants";

export function AirdropCampaignDataShouldShowIsAirdropFinished(): void {
  describe("should show if airdrop campaigns is finished", async function () {
    it("should return false for active and true for finished campaigns", async function () {
      //   airdrop is not finished
      expect(await this.airdropCampaignData.connect(this.signers.backendWallet).isAirdropFinished(campaignAddress)).to.be.equal(false);

      //   finalizing airdrop
      await this.airdropCampaignData.connect(this.signers.backendWallet).finalizeAirdrop(campaignAddress);

      //   airdrop is finished
      expect(await this.airdropCampaignData.connect(this.signers.alice).isAirdropFinished(campaignAddress)).to.be.equal(true);
    });
  });
}
