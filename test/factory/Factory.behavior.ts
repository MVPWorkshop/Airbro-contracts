import { expect } from "chai";
import { ethers } from "hardhat";


export function shouldBehaveLikeFactory(): void {

  it("should emit NewAirdrop event", async function() {
    await expect(await this.airbroFactory.connect(this.signers.admin).dropNewTokensToNftHolders(
      this.testNftCollection.address, // rewardedNftCollection,
      "Reward Token", // newTokenName
      "TKN", // newTokenSymbol
      100, // tokensPerClaim
    )).to.emit(this.airbroFactory, "NewAirdrop");
  });

  it("should fund existing token airdrop contract", async function() {
    const totalAirdropAmount = ethers.utils.parseEther("1000");

    await this.testToken.connect(this.signers.admin).mint(this.signers.admin.address, totalAirdropAmount);
    console.log("Test token balance of: " + await this.testToken.balanceOf(this.signers.admin.address));

    await expect(await this.airbroFactory.connect(this.signers.admin).dropExistingTokensToNftHolders(
      this.testNftCollection.address, // rewardedNftCollection,
      100, // tokensPerClaim
      this.testToken.address, //existing token address
      totalAirdropAmount, // total tokens to be rewarded
    )).to.emit(this.airbroFactory, "NewAirdrop");

    const existingDropFactory = await ethers.getContractFactory("ExistingTokenDrop");
    const tokenDropContract = existingDropFactory.attach(await this.airbroFactory.airdrops(0));

    await this.testToken.connect(this.signers.admin).approve(tokenDropContract.address, totalAirdropAmount);

    await expect(tokenDropContract.fundAirdrop()).to.emit(tokenDropContract,"AirdropFunded");

  });

}
