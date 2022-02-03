import { expect } from "chai";

export function shouldBehaveLikeFactory(): void {

  it("should emit NewAirdrop event", async function() {
    await expect(await this.AirbroFactory.connect(this.signers.admin).dropNewTokensToNftHolders(
        this.testNftCollection.address, // rewardedNftCollection,
        "Reward Token", // newTokenName
        "TKN", // newTokenSymbol
        100, // tokensPerClaim
      ),
    ).to.emit(this.AirbroFactory, "NewAirdrop");
  });

}
