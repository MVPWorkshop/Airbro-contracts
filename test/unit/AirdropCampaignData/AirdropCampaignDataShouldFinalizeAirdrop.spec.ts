import { expect } from "chai";
import { randomAddress as campaignAddress } from "../../shared/constants";

// struct used in contract
const chains = {
  Zero: 0,
  Eth: 1,
  Pols: 2,
};

export function AirdropCampaignDataShouldFinalizeAirdrop(): void {
  describe("should finalize airdrop", async function () {
    it("should allow backend to finalize airdrop", async function () {
      // adding chain (mandatory before editing anything for a campaign on this contract)
      await this.airdropCampaignData.connect(this.signers.backendWallet).addAirdropCampaignChain(campaignAddress, chains.Eth);

      await expect(this.airdropCampaignData.connect(this.signers.backendWallet).finalizeAirdrop(campaignAddress))
        .to.emit(this.airdropCampaignData, "FinalizedAirdrop")
        .withArgs(campaignAddress);
    });
    it("should revert campaign finalization attempt from non bakckend wallet address", async function () {
      // adding chain (mandatory before editing anything for a campaign on this contract)
      await this.airdropCampaignData.connect(this.signers.backendWallet).addAirdropCampaignChain(campaignAddress, chains.Eth);

      await expect(this.airdropCampaignData.connect(this.signers.alice).finalizeAirdrop(campaignAddress)).to.be.revertedWith(
        "NotAirbroManager",
      );
    });

    it("should revert finalization of campaign where chain is not set", async function () {
      await expect(this.airdropCampaignData.connect(this.signers.backendWallet).finalizeAirdrop(campaignAddress)).to.be.revertedWith(
        "ChainDataNotSet",
      );
    });

    it("should revert if trying to finalize an airdrop twice", async function () {
      // adding chain (mandatory before editing anything for a campaign on this contract)
      await this.airdropCampaignData.connect(this.signers.backendWallet).addAirdropCampaignChain(campaignAddress, chains.Eth);

      // first finalization
      await expect(this.airdropCampaignData.connect(this.signers.backendWallet).finalizeAirdrop(campaignAddress))
        .to.emit(this.airdropCampaignData, "FinalizedAirdrop")
        .withArgs(campaignAddress);

      // secnd finalization - should fail
      await expect(this.airdropCampaignData.connect(this.signers.backendWallet).finalizeAirdrop(campaignAddress)).to.be.revertedWith(
        "AirdropHasFinished",
      );
    });
  });
}
