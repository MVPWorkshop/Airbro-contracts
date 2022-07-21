import { expect } from "chai";
import { randomAddress as campaignAddress } from "../../shared/constants";

// struct used in contract
const chains = {
  Zero: 0,
  Eth: 1,
  Pols: 2,
};

// not defined in struct of contract
const noxExistantChains = {
  positiveInt: 3,
  negativeInt: -1,
};

export function AirdropCampaignDataShouldAddAirdropCampaignChain(): void {
  describe("should set airdrop campaign chain", async function () {
    it("should allow admin to set airdrop campaign chain", async function () {
      await expect(this.airdropCampaignData.connect(this.signers.backendWallet).addAirdropCampaignChain(campaignAddress, chains.Zero))
        .to.emit(this.airdropCampaignData, "ChainAdded")
        .withArgs(campaignAddress, chains.Zero);

      await expect(this.airdropCampaignData.connect(this.signers.backendWallet).addAirdropCampaignChain(campaignAddress, chains.Eth))
        .to.emit(this.airdropCampaignData, "ChainAdded")
        .withArgs(campaignAddress, chains.Eth);

      await expect(this.airdropCampaignData.connect(this.signers.backendWallet).addAirdropCampaignChain(campaignAddress, chains.Pols))
        .to.emit(this.airdropCampaignData, "ChainAdded")
        .withArgs(campaignAddress, chains.Pols);
    });

    it("should revert non admin wallet", async function () {
      await expect(
        this.airdropCampaignData.connect(this.signers.alice).addAirdropCampaignChain(campaignAddress, chains.Eth),
      ).to.be.revertedWith("NotAdmin");
    });

    it("should revert chain which is not 0, 1, or 2", async function () {
      await expect(
        this.airdropCampaignData.connect(this.signers.alice).addAirdropCampaignChain(campaignAddress, noxExistantChains.positiveInt),
      ).to.be.reverted;

      await expect(
        this.airdropCampaignData.connect(this.signers.alice).addAirdropCampaignChain(campaignAddress, noxExistantChains.negativeInt),
      ).to.be.reverted;
    });
  });
}
