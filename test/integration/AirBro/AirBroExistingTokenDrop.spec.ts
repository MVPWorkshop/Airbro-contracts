import { expect } from "chai";
import { ethers } from "hardhat";

export function shouldAirDropExistingToken(): void {
  it("should fund and claim existing token airdrop", async function () {
    const totalAirdropAmount = ethers.utils.parseEther("1000");

    await this.testToken.connect(this.signers.deployer).mint(this.signers.deployer.address, totalAirdropAmount);
    // console.log("Test token balance of: " + (await this.testToken.balanceOf(this.signers.deployer.address)));

    await expect(
      await this.airbroFactory.connect(this.signers.deployer).dropExistingTokensToNftHolders(
        this.testNftCollection.address, // rewardedNftCollection,
        100, // tokensPerClaim
        this.testToken.address, //existing token address
        totalAirdropAmount, // total tokens to be rewarded
        30,
      ),
    ).to.emit(this.airbroFactory, "NewAirdrop");

    const existingDropFactory = await ethers.getContractFactory("ExistingTokenDrop");
    const tokenDropContract = existingDropFactory.attach(await this.airbroFactory.airdrops(0));

    await this.testToken.connect(this.signers.deployer).approve(tokenDropContract.address, totalAirdropAmount);

    expect(await this.airbroFactory.connect(this.signers.deployer).totalAirdropsCount()).to.equal(1);
    await expect(tokenDropContract.fundAirdrop()).to.emit(tokenDropContract, "AirdropFunded").withArgs(tokenDropContract.address);
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);

    await expect(tokenDropContract.claim(0, [])).to.emit(tokenDropContract, "Claimed");
    await expect(tokenDropContract.claim(0, [])).to.be.revertedWith("AlreadyRedeemed");

    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);

    await expect(tokenDropContract.batchClaim([1, 2], [])).to.emit(tokenDropContract, "Claimed");

    expect(await tokenDropContract.hasClaimed(1)).to.be.equal(true);
    expect(await tokenDropContract.hasClaimed(3)).to.be.equal(false);
  });
}
