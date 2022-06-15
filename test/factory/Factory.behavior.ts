import { expect } from "chai";
import { ethers } from "hardhat";
import { shouldAirdropExisting1155token } from "./AirBro1155NftMint.spec";

const bytes32MerkleRootHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

export function shouldBehaveLikeFactory(): void {
  it("should emit NewAirdrop event", async function() {
    await expect(
      await this.airbroFactory.connect(this.signers.admin).dropNewTokensToNftHolders(
        this.testNftCollection.address, // rewardedNftCollection,
        "Reward Token", // newTokenName
        "TKN", // newTokenSymbol
        100, // tokensPerClaim
        30, // airdrop duration in days
        bytes32MerkleRootHash, // merkle root hash, can be null
      ),
    ).to.emit(this.airbroFactory, "NewAirdrop");
  });

  it("should fund and claim existing token airdrop", async function() {
    const totalAirdropAmount = ethers.utils.parseEther("1000");

    await this.testToken.connect(this.signers.admin).mint(this.signers.admin.address, totalAirdropAmount);
    console.log("Test token balance of: " + (await this.testToken.balanceOf(this.signers.admin.address)));

    await expect(
      await this.airbroFactory.connect(this.signers.admin).dropExistingTokensToNftHolders(
        this.testNftCollection.address, // rewardedNftCollection,
        100, // tokensPerClaim
        this.testToken.address, //existing token address
        totalAirdropAmount, // total tokens to be rewarded
        30,
        bytes32MerkleRootHash, // merkle root hash, can be null
      ),
    ).to.emit(this.airbroFactory, "NewAirdrop");

    const existingDropFactory = await ethers.getContractFactory("ExistingTokenDrop");
    const tokenDropContract = existingDropFactory.attach(await this.airbroFactory.airdrops(0));

    await this.testToken.connect(this.signers.admin).approve(tokenDropContract.address, totalAirdropAmount);

    await expect(await this.airbroFactory.connect(this.signers.admin).totalAirdropsCount()).to.equal(1);
    await expect(tokenDropContract.fundAirdrop()).to.emit(tokenDropContract, "AirdropFunded");
    await this.testNftCollection.connect(this.signers.admin).safeMint(this.signers.admin.address);

    await expect(tokenDropContract.claim(0, [])).to.emit(tokenDropContract, "Claimed");
    await expect(tokenDropContract.claim(0, [])).to.be.revertedWith("AlreadyRedeemed");

    await this.testNftCollection.connect(this.signers.admin).safeMint(this.signers.admin.address);
    await this.testNftCollection.connect(this.signers.admin).safeMint(this.signers.admin.address);

    await expect(tokenDropContract.batchClaim([1, 2], [])).to.emit(tokenDropContract, "Claimed");

    expect(await tokenDropContract.hasClaimed(1)).to.be.equal(true);
    expect(await tokenDropContract.hasClaimed(3)).to.be.equal(false);
  });

  it("should create contract with merkle proof", async function() {

    //TODO generate a real hash of a CSV file

    await expect(
      await this.airbroFactory.connect(this.signers.admin).dropNewTokensToNftHolders(
        this.testNftCollection.address, // rewardedNftCollection,
        "Reward Token", // newTokenName
        "TKN", // newTokenSymbol
        100, // tokensPerClaim
        30,
        bytes32MerkleRootHash, // merkle root hash, can be null
      ),
    ).to.emit(this.airbroFactory, "NewAirdrop");
  });

  shouldAirdropExisting1155token()
}
