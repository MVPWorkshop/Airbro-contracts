import { expect } from "chai";
import { BigNumber, constants } from "ethers";
import { ethers, network } from "hardhat";
import { oneWeekInSeconds } from "../../shared/constants";

export function shouldAirDropNewToken(): void {
  it("batchClaim function should revert if existing token airdrop has expired", async function () {
    // naming of ERC20 to be created
    const newTokenName: string = "Wakanda Coin";
    const newTokenSymbol: string = "WKND";
    const tokensPerClaim: BigNumber = ethers.utils.parseEther("100");
    const airdropDuration: number = 3;

    // create new airdrop, along with new ERC20
    expect(
      await this.airbroFactory.connect(this.signers.deployer).dropNewTokensToNftHolders(
        this.testNftCollection.address, // rewardedNftCollection,
        newTokenName, // Name of new ERC20 Token
        newTokenSymbol, // Symbol of new ERC20 Token
        tokensPerClaim, // tokensPerClaim
        airdropDuration,
      ),
    ).to.emit(this.airbroFactory, "NewAirdrop");

    // attaching deployed airdrop contract to this test
    const newDropFactory = await ethers.getContractFactory("TokenDrop");
    const tokenDropContract = newDropFactory.attach(await this.airbroFactory.airdrops(0));

    const tokenIdArray: Array<Number> = [0, 1];
    // minting 2 NFTs to deployer wallet
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);

    // for some reason evm_increaseTime is not increasing the time here and the test is failing
    await ethers.provider.send("evm_increaseTime", [oneWeekInSeconds]); // add one week worth of seconds

    await expect(tokenDropContract.batchClaim(tokenIdArray)).to.be.revertedWith(`AirdropExpired`);
  });

  it("batchClaim function should revert if one of the tokenIds' NFTs' rewards have already been redeemed", async function () {
    // naming of ERC20 to be created
    const newTokenName: string = "Wakanda Coin";
    const newTokenSymbol: string = "WKND";
    const tokensPerClaim: BigNumber = ethers.utils.parseEther("100");
    const airdropDuration: number = 3;

    // create new airdrop, along with new ERC20
    expect(
      await this.airbroFactory.connect(this.signers.deployer).dropNewTokensToNftHolders(
        this.testNftCollection.address, // rewardedNftCollection,
        newTokenName, // Name of new ERC20 Token
        newTokenSymbol, // Symbol of new ERC20 Token
        tokensPerClaim, // tokensPerClaim
        airdropDuration,
      ),
    ).to.emit(this.airbroFactory, "NewAirdrop");

    // attaching deployed airdrop contract to this test
    const newDropFactory = await ethers.getContractFactory("TokenDrop");
    const tokenDropContract = newDropFactory.attach(await this.airbroFactory.airdrops(0));

    const tokenIdArray: Array<Number> = [0, 1];
    // minting 2 NFTs to deployer wallet
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);

    await expect(tokenDropContract.claim(constants.Zero)).to.emit(tokenDropContract, "Claimed");

    await expect(tokenDropContract.batchClaim(tokenIdArray)).to.be.revertedWith(`AlreadyRedeemed`);
  });

  it("batchClaim function should revert if one of the tokenIds' NFTs' is not owned by the user", async function () {
    // naming of ERC20 to be created
    const newTokenName: string = "Wakanda Coin";
    const newTokenSymbol: string = "WKND";
    const tokensPerClaim: BigNumber = ethers.utils.parseEther("100");
    const airdropDuration: number = 3;

    // create new airdrop, along with new ERC20
    expect(
      await this.airbroFactory.connect(this.signers.deployer).dropNewTokensToNftHolders(
        this.testNftCollection.address, // rewardedNftCollection,
        newTokenName, // Name of new ERC20 Token
        newTokenSymbol, // Symbol of new ERC20 Token
        tokensPerClaim, // tokensPerClaim
        airdropDuration,
      ),
    ).to.emit(this.airbroFactory, "NewAirdrop");

    // attaching deployed airdrop contract to this test
    const newDropFactory = await ethers.getContractFactory("TokenDrop");
    const tokenDropContract = newDropFactory.attach(await this.airbroFactory.airdrops(0));

    const tokenIdArray: Array<Number> = [0, 1];
    // minting 1 NFT to deployer, 1 NFT to alice
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.alice.address);

    await expect(tokenDropContract.batchClaim(tokenIdArray)).to.be.revertedWith(`Unauthorized`);
  });

  it("should create and claim new token airdrop", async function () {
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
    await expect(tokenDropContract.claim(0)).to.emit(tokenDropContract, "Claimed");
    await expect(tokenDropContract.claim(0)).to.be.revertedWith("AlreadyRedeemed");

    // minting 2 NFTs to admin so admin is able to batch claim tokens
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);

    await expect(tokenDropContract.batchClaim([1, 2])).to.emit(tokenDropContract, "Claimed");

    expect(await tokenDropContract.hasClaimed(1)).to.be.equal(true);
    expect(await tokenDropContract.hasClaimed(3)).to.be.equal(false);

    expect(await tokenDropContract.balanceOf(this.signers.deployer.address)).to.be.equal(300);
  });
}
