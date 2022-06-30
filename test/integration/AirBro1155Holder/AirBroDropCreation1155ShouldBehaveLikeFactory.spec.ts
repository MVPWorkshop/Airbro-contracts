import { expect } from "chai";
import { ethers } from "hardhat";

export function AirbroFactory1155ShouldBehaveLikeFactory(): void {
  it("should emit NewAirdrop event", async function() {
    await expect(
      await this.airbroFactory1155Holder.connect(this.signers.deployer).dropNewTokensToNftHolders(
        this.testNftCollection.address, // rewardedNftCollection,
        "Reward Token", // newTokenName
        "TKN", // newTokenSymbol
        100, // tokensPerClaim
        30 // airdrop duration in days
      ),
    ).to.emit(this.airbroFactory1155Holder, "NewAirdrop");
  });

}
