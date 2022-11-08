import { expect } from "chai";

export function shouldBehaveLikeFactory(): void {
  it("should emit NewAirdrop event", async function () {
    await expect(
      await this.airbroFactory.connect(this.signers.deployer).dropNewTokensToNftHolders(
        this.testNftCollection.address, // rewardedNftCollection,
        "Reward Token", // newTokenName
        "TKN", // newTokenSymbol
        100, // tokensPerClaim
        30, // airdrop duration in days
      ),
    ).to.emit(this.airbroFactory, "NewAirdrop");
  });

  // what is the purpose of this test?
  it("should create contract with merkle proof", async function () {
    //TODO generate a real hash of a CSV file

    await expect(
      await this.airbroFactory.connect(this.signers.deployer).dropNewTokensToNftHolders(
        this.testNftCollection.address, // rewardedNftCollection,
        "Reward Token", // newTokenName
        "TKN", // newTokenSymbol
        100, // tokensPerClaim
        30,
      ),
    ).to.emit(this.airbroFactory, "NewAirdrop");
  });
}
