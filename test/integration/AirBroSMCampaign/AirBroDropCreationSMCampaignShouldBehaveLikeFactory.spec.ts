import { expect } from "chai";
import { ethers } from "hardhat";

export function AirbroFactorySMCampaignShouldBehaveLikeFactory(): void {
  it("should emit NewAirdrop event", async function () {
    await expect(
      await this.airbroFactorySMCampaign.connect(this.signers.deployer).dropNewTokensToNftHolders(
        this.testNftCollection.address, // rewardedNftCollection,
        "Reward Token", // newTokenName
        "TKN", // newTokenSymbol
        100, // tokensPerClaim
        30, // airdrop duration in days
      ),
    ).to.emit(this.airbroFactorySMCampaign, "NewAirdrop");
  });
}
