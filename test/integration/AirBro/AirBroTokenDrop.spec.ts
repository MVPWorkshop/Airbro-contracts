import { expect } from "chai";
import { ethers } from "hardhat";

export function shouldAirDropNewToken(): void {
  it("should fund and claim new token airdrop", async function () {
    // naming of ERC20 to be created
    const newTokenName: string = "Wakanda Coin";
    const newTokenSymbol: string = "WKND";

    // create new airdrop, along with new ERC20
    expect(
      await this.airbroFactory.connect(this.signers.deployer).dropNewTokensToNftHolders(
        this.testNftCollection.address, // rewardedNftCollection,
        newTokenName, // Name of new ERC20 Token
        newTokenSymbol, // Symbol of new ERC20 Token
        100, // tokensPerClaim
        30,
      ),
    ).to.emit(this.airbroFactory, "NewAirdrop");

    // attaching deployed airdrop contract to this test
    const newDropFactory = await ethers.getContractFactory("TokenDrop");
    const tokenDropContract = newDropFactory.attach(await this.airbroFactory.airdrops(0));

    expect(await this.airbroFactory.connect(this.signers.deployer).totalAirdropsCount()).to.equal(1);

    // minting NFT to admin so admin is able to claim tokens
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);

    // test to see if claiming is successfull when eligible and after tokens are claimed
    await expect(tokenDropContract.claim(0, [])).to.emit(tokenDropContract, "Claimed");
    await expect(tokenDropContract.claim(0, [])).to.be.revertedWith("AlreadyRedeemed");

    // minting 2 NFTs to admin so admin is able to batch claim tokens
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);

    await expect(tokenDropContract.batchClaim([1, 2], [])).to.emit(tokenDropContract, "Claimed");

    expect(await tokenDropContract.hasClaimed(1)).to.be.equal(true);
    expect(await tokenDropContract.hasClaimed(3)).to.be.equal(false);

    expect(await tokenDropContract.balanceOf(this.signers.deployer.address)).to.be.equal(300);
  });
}
