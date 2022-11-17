import { expect } from "chai";
import { BigNumber, constants } from "ethers";
import { ethers, network } from "hardhat";
import { oneWeekInSeconds } from "../../shared/constants";

const dayInSeconds: number = 60 * 60 * 24;

export function shouldAirDropNewToken(): void {
  it("isEligible function should return false if already redeemed existing token airdrop reward", async function () {
    const newTokenName: string = "Wakanda Coin";
    const newTokenSymbol: string = "WKND";
    const totalAirdropAmount: BigNumber = ethers.utils.parseEther("1000");
    const tokensPerClaim: BigNumber = ethers.utils.parseEther("100");
    const airdropDuration: number = 3;

    await this.testToken.connect(this.signers.deployer).mint(this.signers.deployer.address, totalAirdropAmount);
    // console.log("Test token balance of: " + (await this.testToken.balanceOf(this.signers.deployer.address)));

    // minting NFT to deployer address
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);

    // create new airdrop, along with new ERC20
    void expect(
      await this.airbroFactory.connect(this.signers.deployer).dropNewTokensToNftHolders(
        this.testNftCollection.address, // rewardedNftCollection,
        newTokenName, // Name of new ERC20 Token
        newTokenSymbol, // Symbol of new ERC20 Token
        tokensPerClaim, // tokensPerClaim
        airdropDuration,
      ),
    ).to.emit(this.airbroFactory, "NewAirdrop");

    const tokenDropFactory = await ethers.getContractFactory("TokenDrop");
    const tokenDropContract = tokenDropFactory.attach(await this.airbroFactory.airdrops(0));

    expect(await tokenDropContract.isEligibleForReward(constants.Zero)).to.equal(true);

    // deployer wallet claiming their reward
    await expect(tokenDropContract.claim(constants.Zero)).to.emit(tokenDropContract, "Claimed");

    expect(await tokenDropContract.isEligibleForReward(constants.Zero)).to.be.equal(false);
  });

  it("isEligible function in existing token airdrop should return false if msg.sender is not owner of NFT with sent tokenId", async function () {
    const newTokenName: string = "Wakanda Coin";
    const newTokenSymbol: string = "WKND";
    const totalAirdropAmount: BigNumber = ethers.utils.parseEther("1000");
    const tokensPerClaim: BigNumber = ethers.utils.parseEther("100");
    const airdropDuration: number = 3;

    await this.testToken.connect(this.signers.deployer).mint(this.signers.deployer.address, totalAirdropAmount);
    // console.log("Test token balance of: " + (await this.testToken.balanceOf(this.signers.deployer.address)));

    // minting NFT to deployer address
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);

    // create new airdrop, along with new ERC20
    void expect(
      await this.airbroFactory.connect(this.signers.deployer).dropNewTokensToNftHolders(
        this.testNftCollection.address, // rewardedNftCollection,
        newTokenName, // Name of new ERC20 Token
        newTokenSymbol, // Symbol of new ERC20 Token
        tokensPerClaim, // tokensPerClaim
        airdropDuration,
      ),
    ).to.emit(this.airbroFactory, "NewAirdrop");

    const existingDropFactory = await ethers.getContractFactory("ExistingTokenDrop");
    const tokenDropContract = existingDropFactory.attach(await this.airbroFactory.airdrops(0));

    // deployer wallet claiming reward but they do not own an nft
    expect(await tokenDropContract.connect(this.signers.alice).isEligibleForReward(constants.Zero)).to.be.equal(false);
  });

  it("isEligible function should retrun false if existing token airdrop expired", async function () {
    const newTokenName: string = "Wakanda Coin";
    const newTokenSymbol: string = "WKND";
    const totalAirdropAmount: BigNumber = ethers.utils.parseEther("1000");
    const tokensPerClaim: BigNumber = ethers.utils.parseEther("100");
    const airdropDuration: number = 1;

    await this.testToken.connect(this.signers.deployer).mint(this.signers.deployer.address, totalAirdropAmount);
    // console.log("Test token balance of: " + (await this.testToken.balanceOf(this.signers.deployer.address)));

    // minting NFT to deployer address
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);

    // create new airdrop, along with new ERC20
    void expect(
      await this.airbroFactory.connect(this.signers.deployer).dropNewTokensToNftHolders(
        this.testNftCollection.address, // rewardedNftCollection,
        newTokenName, // Name of new ERC20 Token
        newTokenSymbol, // Symbol of new ERC20 Token
        tokensPerClaim, // tokensPerClaim
        airdropDuration,
      ),
    ).to.emit(this.airbroFactory, "NewAirdrop");

    const existingDropFactory = await ethers.getContractFactory("ExistingTokenDrop");
    const tokenDropContract = existingDropFactory.attach(await this.airbroFactory.airdrops(0));

    // increasing time
    await network.provider.send("evm_increaseTime", [oneWeekInSeconds]); // add one week worth of seconds
    await network.provider.send("evm_mine"); // mine, so now the time increased by oneWeekInSeconds seconds

    expect(await tokenDropContract.isEligibleForReward(constants.Zero)).to.be.equal(false);
  });

  it("batchClaim function should revert if existing token airdrop has expired", async function () {
    // naming of ERC20 to be created
    const newTokenName: string = "Wakanda Coin";
    const newTokenSymbol: string = "WKND";
    const tokensPerClaim: BigNumber = ethers.utils.parseEther("100");
    const airdropDuration: number = 3;

    // create new airdrop, along with new ERC20
    void expect(
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

    const tokenIdArray: Array<number> = [0, 1];
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
    void expect(
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

    const tokenIdArray: Array<number> = [0, 1];
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
    void expect(
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

    const tokenIdArray: Array<number> = [0, 1];
    // minting 1 NFT to deployer, 1 NFT to alice
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.alice.address);

    await expect(tokenDropContract.batchClaim(tokenIdArray)).to.be.revertedWith(`Unauthorized`);
  });

  it("should create and claim new token airdrop", async function () {
    // naming of ERC20 to be created
    const newTokenName: string = "Wakanda Coin";
    const newTokenSymbol: string = "WKND";
    const tokensPerClaim: number = 100;
    const airdropDuration: number = 30;

    // create new airdrop, along with new ERC20
    void expect(
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

  it("should revert claim for token if Airdrop has expired", async function () {
    // naming of ERC20 to be created
    const newTokenName: string = "Wakanda Coin";
    const newTokenSymbol: string = "WKND";
    const tokensPerClaim: number = 100;
    const airdropDuration: number = 30;

    // create new airdrop, along with new ERC20
    void expect(
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

    expect(await this.airbroFactory.connect(this.signers.deployer).totalAirdropsCount()).to.equal(1);

    // minting NFT to admin so admin is able to claim tokens
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);

    // increasing time to make airdrop expired
    await network.provider.send("evm_increaseTime", [dayInSeconds * airdropDuration + 1]); // add 30 days worth of seconds + 1
    await network.provider.send("evm_mine"); // mine, so now the time increased by oneWeekInSeconds seconds

    // test to see if claiming is successfull when eligible and after tokens are claimed
    await expect(tokenDropContract.claim(0)).to.be.revertedWith("AirdropExpired");

    // minting 2 NFTs to admin so admin is able to batch claim tokens
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);

    await expect(tokenDropContract.batchClaim([1, 2])).to.be.revertedWith("AirdropExpired");
  });
}
