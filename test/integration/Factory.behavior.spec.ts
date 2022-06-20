import { expect } from "chai";
import { ethers } from "hardhat";

export function shouldBehaveLikeFactory(): void {
  it("should emit NewAirdrop event", async function() {
    await expect(
      await this.airbroFactory.connect(this.signers.deployer).dropNewTokensToNftHolders(
        this.testNftCollection.address, // rewardedNftCollection,
        "Reward Token", // newTokenName
        "TKN", // newTokenSymbol
        100, // tokensPerClaim
        30 // airdrop duration in days
      ),
    ).to.emit(this.airbroFactory, "NewAirdrop");
  });

  it("should fund and claim existing token airdrop", async function() {
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
    await expect(tokenDropContract.fundAirdrop()).to.emit(tokenDropContract, "AirdropFunded");
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);

    await expect(tokenDropContract.claim(0, [])).to.emit(tokenDropContract, "Claimed");
    await expect(tokenDropContract.claim(0, [])).to.be.revertedWith("AlreadyRedeemed");

    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);

    await expect(tokenDropContract.batchClaim([1, 2], [])).to.emit(tokenDropContract, "Claimed");

    expect(await tokenDropContract.hasClaimed(1)).to.be.equal(true);
    expect(await tokenDropContract.hasClaimed(3)).to.be.equal(false);
  });

  it("should fund and claim new token airdrop", async function() {
    // naming of ERC20 to be created
    const newTokenName: string = "Wakanda Coin";
    const newTokenSymbol: string = "WKND";

    // create new airdrop, along with new ERC20
    expect( await this.airbroFactory.connect(this.signers.deployer).dropNewTokensToNftHolders(
        this.testNftCollection.address, // rewardedNftCollection,
        newTokenName, // Name of new ERC20 Token
        newTokenSymbol, // Symbol of new ERC20 Token
        100, // tokensPerClaim
        30
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

    // expect(await this.tokenDropContract.balanceOf(this.signers.deployer.address)).to.be.equal(300);

  });

  // what is the purpose of this test?
  it("should create contract with merkle proof", async function() {

    //TODO generate a real hash of a CSV file

    await expect(
      await this.airbroFactory.connect(this.signers.deployer).dropNewTokensToNftHolders(
        this.testNftCollection.address, // rewardedNftCollection,
        "Reward Token", // newTokenName
        "TKN", // newTokenSymbol
        100, // tokensPerClaim
        30
      ),
    ).to.emit(this.airbroFactory, "NewAirdrop");
  });
}
