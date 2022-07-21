import { expect } from "chai";
import { randomAddress as campaignAddress } from "../../shared/constants";

// struct used in contract
const chains = {
  Zero: 0,
  Eth: 1,
  pols: 2,
};

// not defined in struct of contract
const nonValidChainData = {
  PositiveInt: chains.pols + 1,
  NegativeInt: chains.Zero - 1,
};

export function AirdropCampaignDataShouldAddAirdropCampaignChain(): void {
  describe("should set airdrop campaign chain", async function () {
    it("should allow admin to set airdrop campaign chain", async function () {
      await expect(this.airdropCampaignData.connect(this.signers.backendWallet).addAirdropCampaignChain(campaignAddress, chains.Eth))
        .to.emit(this.airdropCampaignData, "ChainAdded")
        .withArgs(campaignAddress, chains.Eth);
    });

    it("should revert non admin wallet", async function () {
      await expect(
        this.airdropCampaignData.connect(this.signers.alice).addAirdropCampaignChain(campaignAddress, chains.Eth),
      ).to.be.revertedWith("NotAdmin");
    });

    it("should revert chain data if it is 0 (chains.zero)", async function () {
      await expect(
        this.airdropCampaignData.connect(this.signers.backendWallet).addAirdropCampaignChain(campaignAddress, chains.Zero),
      ).to.be.revertedWith(`ChainDataNotSet`);
    });

    it("should revert chain data if it is invalid enum integers (bellow 0 or above 2)", async function () {
      await expect(
        this.airdropCampaignData
          .connect(this.signers.backendWallet)
          .addAirdropCampaignChain(campaignAddress, nonValidChainData.PositiveInt),
      ).to.be.reverted;

      await expect(
        this.airdropCampaignData
          .connect(this.signers.backendWallet)
          .addAirdropCampaignChain(campaignAddress, nonValidChainData.NegativeInt),
      ).to.be.reverted;
    });

    it("should revert chain data if chain data is already set (chains.eth or chains.pols)", async function () {
      await expect(this.airdropCampaignData.connect(this.signers.backendWallet).addAirdropCampaignChain(campaignAddress, chains.Eth))
        .to.emit(this.airdropCampaignData, "ChainAdded")
        .withArgs(campaignAddress, chains.Eth);

      await expect(
        this.airdropCampaignData.connect(this.signers.backendWallet).addAirdropCampaignChain(campaignAddress, chains.pols),
      ).to.be.revertedWith(`ChainAlreadySet`);
    });
  });
}
