import { expect } from "chai";
import { ethers, network } from "hardhat";
import { MerkleTree } from "merkletreejs";
const { keccak256 } = ethers.utils;

const dayInSeconds: number = 86400;

const totalAirdropAmount = ethers.utils.parseEther("1000");
const halfAirdropAmount = ethers.utils.parseEther("500");
const tokensPerClaim = 100;
const airdropDurationInDays = 30; //days

export function AirbroFactorySMCampaignShouldAirDropExistingToken() {
  it("should fund and drop tokens to newly minted nft1155 holders", async function () {
    // creating new airdrop
    expect(
      await this.airbroFactorySMCampaign.connect(this.signers.deployer).dropExistingTokensToNftHolders(
        this.test1155NftCollection.address, // rewardedNftCollection,
        tokensPerClaim,
        this.testToken.address, //existing token address
        totalAirdropAmount, // total tokens to be rewarded
        airdropDurationInDays,
      ),
    ).to.emit(this.airbroFactorySMCampaign, "NewAirdrop");

    const existingDropFactory = await ethers.getContractFactory("ExistingTokenDropSMCampaign");
    const tokenDropContract = existingDropFactory.attach(await this.airbroFactorySMCampaign.airdrops(0)); // Address of newly created airdrop. How will this be sent to the frontend ?

    expect(await tokenDropContract.totalAirdropAmount()).to.be.equal(totalAirdropAmount);

    // funding the airdrop with tokens
    expect(await tokenDropContract.airdropFunded()).to.be.equal(false);

    await expect(tokenDropContract.fundAirdrop()).to.be.revertedWith("InsufficientAmount");

    // minging the admin 500 of the existing tokens, which will revert since its not enough
    await this.testToken.connect(this.signers.deployer).mint(this.signers.deployer.address, halfAirdropAmount);
    await expect(tokenDropContract.connect(this.signers.deployer).fundAirdrop()).to.be.revertedWith("InsufficientAmount");

    // minting the admin the other 500, but will stil revert since it is not approved
    await this.testToken.connect(this.signers.deployer).mint(this.signers.deployer.address, halfAirdropAmount);
    await expect(tokenDropContract.connect(this.signers.deployer).fundAirdrop()).to.be.revertedWith("InsufficientAmount");

    await this.testToken.connect(this.signers.deployer).approve(tokenDropContract.address, totalAirdropAmount); //deployer approving tokens
    await expect(tokenDropContract.fundAirdrop()).to.emit(tokenDropContract, "AirdropFunded").withArgs(tokenDropContract.address); // funding airdrop contract

    expect(await tokenDropContract.airdropFunded()).to.be.equal(true); // should be funded

    await expect(tokenDropContract.connect(this.signers.deployer).fundAirdrop()).to.be.revertedWith("AlreadyFunded");

    /**
     * The user will receive the test1155NftCollection.
     * A twitter bot will update the backend with a merkle tree of users who satisfied a condition using this nft.
     * The backendWallet will update the merkleRoot on the airdrop smart contract.
     *  */
    const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
    const leaves = whitelisted.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
    const roothash = merkleTree.getHexRoot();

    await expect(tokenDropContract.connect(this.signers.backendWallet).setMerkleRoot(roothash))
      .to.emit(tokenDropContract, "MerkleRootChanged")
      .withArgs(roothash); //backend setting the merkleRoot

    // Alice claiming new token
    const hexProof = merkleTree.getHexProof(leaves[0]);
    expect(await this.testToken.balanceOf(this.signers.alice.address)).to.be.equal(0); // alice has not claimed any tokens yet and should have balance of 0

    await expect(tokenDropContract.connect(this.signers.alice).claim(hexProof))
      .to.emit(tokenDropContract, "Claimed")
      .withArgs(this.signers.alice.address);
    expect(await this.testToken.balanceOf(this.signers.alice.address)).to.be.equal(tokensPerClaim); //alice should have additional tokens matching the tokensPerClaim amount

    await expect(tokenDropContract.connect(this.signers.alice).claim(hexProof)).to.be.revertedWith("AlreadyRedeemed"); // should be reverted since Alice already redeemed
  });

  it("should fund contract and allow funder to withdraw funds when airdrop is finished", async function () {
    expect(
      await this.airbroFactorySMCampaign.connect(this.signers.deployer).dropExistingTokensToNftHolders(
        this.test1155NftCollection.address, // rewardedNftCollection,
        tokensPerClaim,
        this.testToken.address, //existing token address
        totalAirdropAmount, // total tokens to be rewarded
        airdropDurationInDays,
      ),
    ).to.emit(this.airbroFactorySMCampaign, "NewAirdrop");

    const existingDropFactory = await ethers.getContractFactory("ExistingTokenDropSMCampaign");
    const tokenDropContract = existingDropFactory.attach(await this.airbroFactorySMCampaign.airdrops(0)); // Address of newly created airdrop

    // minting and approving tokens, and then funding
    await this.testToken.connect(this.signers.deployer).mint(this.signers.deployer.address, totalAirdropAmount);
    await this.testToken.connect(this.signers.deployer).approve(tokenDropContract.address, totalAirdropAmount); //deployer approving tokens

    expect(await tokenDropContract.connect(this.signers.deployer).fundAirdrop())
      .to.emit(tokenDropContract, "AirdropFunded")
      .withArgs(tokenDropContract.address); // funding airdrop contract

    await expect(tokenDropContract.connect(this.signers.alice).withdrawAirdropFunds()).to.be.revertedWith("Unauthorized");
    await expect(tokenDropContract.connect(this.signers.deployer).withdrawAirdropFunds()).to.be.revertedWith("AirdropStillInProgress");

    // updating time
    await network.provider.send("evm_increaseTime", [airdropDurationInDays * dayInSeconds]);
    await network.provider.send("evm_mine");

    // chechking balance
    expect(await this.testToken.balanceOf(this.signers.deployer.address)).to.be.equal(0);
    expect(await this.testToken.balanceOf(tokenDropContract.address)).to.be.equal(totalAirdropAmount);

    await expect(tokenDropContract.connect(this.signers.alice).withdrawAirdropFunds()).to.be.revertedWith("Unauthorized");
    expect(await tokenDropContract.connect(this.signers.deployer).withdrawAirdropFunds()).to.be.ok; // is this right?

    // chechking balance
    expect(await this.testToken.balanceOf(this.signers.deployer.address)).to.be.equal(totalAirdropAmount);
    expect(await this.testToken.balanceOf(tokenDropContract.address)).to.be.equal(0);
  });
}
