import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { oneWeekInSeconds } from "../../shared/constants";

export function shouldAirDropExistingToken(): void {
  it("should fund and claim existing token airdrop", async function () {
    const totalAirdropAmount: BigNumber = ethers.utils.parseEther("1000");
    const tokensPerClaim: BigNumber = ethers.utils.parseEther("100");
    const airdropDuration: number = 3;
    let leftoverNftAmount: BigNumber = totalAirdropAmount;

    await this.testToken.connect(this.signers.deployer).mint(this.signers.deployer.address, totalAirdropAmount);
    // console.log("Test token balance of: " + (await this.testToken.balanceOf(this.signers.deployer.address)));

    // minting NFT to deployer address
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);

    // deploying airdrop with existing ERC20 token as reward
    await expect(
      await this.airbroFactory.connect(this.signers.deployer).dropExistingTokensToNftHolders(
        this.testNftCollection.address, // rewardedNftCollection,
        tokensPerClaim, // tokensPerClaim
        this.testToken.address, //existing token address
        totalAirdropAmount, // total tokens to be rewarded
        airdropDuration, // airdrop Duration, in days
      ),
    ).to.emit(this.airbroFactory, "NewAirdrop");

    const existingDropFactory = await ethers.getContractFactory("ExistingTokenDrop");
    const tokenDropContract = existingDropFactory.attach(await this.airbroFactory.airdrops(0));

    // approving totalAirdropAmount of ERC20 tokens to airdrop contract
    await this.testToken.connect(this.signers.deployer).approve(tokenDropContract.address, totalAirdropAmount);

    // airbroFactory incrementation - should be moved somewhere else
    expect(await this.airbroFactory.connect(this.signers.deployer).totalAirdropsCount()).to.equal(1);

    // funding airdrop
    await expect(tokenDropContract.fundAirdrop()).to.emit(tokenDropContract, "AirdropFunded").withArgs(tokenDropContract.address);

    // deployer wallet claiming their reward
    await expect(tokenDropContract.claim(0)).to.emit(tokenDropContract, "Claimed");

    // deployer wallet trying to redeem reward multiple times for the same tokenId
    await expect(tokenDropContract.claim(0)).to.be.revertedWith("AlreadyRedeemed");
    leftoverNftAmount = leftoverNftAmount.sub(tokensPerClaim);

    const tokenIdArray: Array<Number> = [1, 2];
    // minting more NFTs to deployer wallet
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);

    await expect(tokenDropContract.batchClaim(tokenIdArray, [])).to.emit(tokenDropContract, "Claimed");
    leftoverNftAmount = leftoverNftAmount.sub(tokensPerClaim.mul(tokenIdArray.length));

    expect(await tokenDropContract.hasClaimed(1)).to.be.equal(true);
    expect(await tokenDropContract.hasClaimed(3)).to.be.equal(false);

    // airdropFunds provider withdrawing their leftover funds after the airdrop has finished
    await expect(tokenDropContract.connect(this.signers.deployer).withdrawAirdropFunds()).to.be.revertedWith("AirdropStillInProgress");

    await ethers.provider.send("evm_increaseTime", [oneWeekInSeconds]); // add one week worth of seconds

    // non airdropFunds provider withdrawing leftover funds after the airdrop has finished should be reverted
    await expect(tokenDropContract.connect(this.signers.jerry).withdrawAirdropFunds()).to.be.revertedWith("Unauthorized");

    const balanceBeforeWithdraw = await this.testToken.balanceOf(this.signers.deployer.address);
    await tokenDropContract.connect(this.signers.deployer).withdrawAirdropFunds();
    const balanceAfterWithdraw = await this.testToken.balanceOf(this.signers.deployer.address);

    expect(balanceAfterWithdraw).to.be.equal(balanceBeforeWithdraw.add(leftoverNftAmount));
  });
}
