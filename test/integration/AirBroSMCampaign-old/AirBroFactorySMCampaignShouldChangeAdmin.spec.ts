import { expect } from "chai";
import { ethers } from "hardhat";

export function AirbroFactorySMCampaignShouldChangeAdminInAllAirDrops(): void {
  const bytes32MerkleRootHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

  it("change admin inheritance - TokenDropSMCampaign", async function () {
    // naming of ERC20 to be created
    const newTokenName: string = "Wakanda Coin";
    const newTokenSymbol: string = "WKND";

    // create new airdrop, along with new ERC20
    expect(
      await this.airbroFactorySMCampaign.connect(this.signers.deployer).dropNewTokensToNftHolders(
        this.testNftCollection.address, // rewardedNftCollection,
        newTokenName, // Name of new ERC20 Token
        newTokenSymbol, // Symbol of new ERC20 Token
        100, // tokensPerClaim
        30,
      ),
    ).to.emit(this.airbroFactorySMCampaign, "NewAirdrop");

    // attaching deployed airdrop contract to this test
    const newDropFactory = await ethers.getContractFactory("TokenDropSMCampaign");
    const tokenDropContract = newDropFactory.attach(await this.airbroFactorySMCampaign.airdrops(0));

    // checking if initial admin address is able to set MerkleRootHash
    expect(await tokenDropContract.connect(this.signers.backendWallet).setMerkleRoot(bytes32MerkleRootHash))
      .to.emit(tokenDropContract, "MerkleRootChanged")
      .withArgs(bytes32MerkleRootHash);

    await this.airbroFactorySMCampaign.connect(this.signers.backendWallet).changeAdmin(this.signers.alice.address);
    expect(await this.airbroFactorySMCampaign.admin())
      .to.be.equal(this.signers.alice.address)
      .and.to.emit(this.airbroFactorySMCampaign, "AdminChanged")
      .withArgs(this.signers.alice.address);

    // checking if new admin address is able to set MerkleRootHash
    expect(await tokenDropContract.connect(this.signers.alice).setMerkleRoot(bytes32MerkleRootHash))
      .to.emit(tokenDropContract, "MerkleRootChanged")
      .withArgs(bytes32MerkleRootHash);
  });

  it("change admin inheritance - ExistingTokenDropSMCampaign", async function () {
    const totalAirdropAmount = ethers.utils.parseEther("1000");

    await this.testToken.connect(this.signers.deployer).mint(this.signers.deployer.address, totalAirdropAmount);

    // create new airdrop, along with existing ERC20
    expect(
      await this.airbroFactorySMCampaign.connect(this.signers.deployer).dropExistingTokensToNftHolders(
        this.testNftCollection.address, // rewardedNftCollection,
        100, // tokensPerClaim
        this.testToken.address, //existing token address
        totalAirdropAmount, // total tokens to be rewarded
        30,
      ),
    ).to.emit(this.airbroFactorySMCampaign, "NewAirdrop");

    // attaching deployed airdrop contract to this test
    const existingDropFactory = await ethers.getContractFactory("ExistingTokenDropSMCampaign");
    const tokenDropContract = existingDropFactory.attach(await this.airbroFactorySMCampaign.airdrops(0));

    // checking if initial admin address is able to set MerkleRootHash
    expect(await tokenDropContract.connect(this.signers.backendWallet).setMerkleRoot(bytes32MerkleRootHash))
      .to.emit(tokenDropContract, "MerkleRootChanged")
      .withArgs(bytes32MerkleRootHash);

    await this.airbroFactorySMCampaign.connect(this.signers.backendWallet).changeAdmin(this.signers.alice.address);
    expect(await this.airbroFactorySMCampaign.admin())
      .to.be.equal(this.signers.alice.address)
      .and.to.emit(this.airbroFactorySMCampaign, "AdminChanged")
      .withArgs(this.signers.alice.address);

    // checking if new admin address is able to set MerkleRootHash
    expect(await tokenDropContract.connect(this.signers.alice).setMerkleRoot(bytes32MerkleRootHash))
      .to.emit(tokenDropContract, "MerkleRootChanged")
      .withArgs(bytes32MerkleRootHash);
  });

  it("change admin inheritance - Existing1155NftDropSMCampaign", async function () {
    const idOf1155: string = "nftAirdrop";
    const amounOft1155: number = 1000;
    const tokensPerClaim: number = 1;
    const durationInDays: number = 1;
    const tokenId: number = 1; // token id set to 1

    // create new airdrop, along with existing 1155
    expect(
      await this.airbroFactorySMCampaign
        .connect(this.signers.deployer)
        .dropExisting1155NftsToNftHolders(
          this.testNftCollection.address,
          this.test1155NftCollection.address,
          tokensPerClaim,
          tokenId,
          amounOft1155,
          durationInDays,
        ),
    ).to.emit(this.airbroFactorySMCampaign, "NewAirdrop");

    // attaching deployed airdrop contract to this test
    const existing1155NftDropFactory = await ethers.getContractFactory("Existing1155NftDropSMCampaign");
    const existing1155NftDropContract = existing1155NftDropFactory.attach(await this.airbroFactorySMCampaign.airdrops(0));

    // checking if initial admin address is able to set MerkleRootHash
    expect(await existing1155NftDropContract.connect(this.signers.backendWallet).setMerkleRoot(bytes32MerkleRootHash))
      .to.emit(existing1155NftDropContract, "MerkleRootChanged")
      .withArgs(bytes32MerkleRootHash);

    await this.airbroFactorySMCampaign.connect(this.signers.backendWallet).changeAdmin(this.signers.alice.address);
    expect(await this.airbroFactorySMCampaign.admin())
      .to.be.equal(this.signers.alice.address)
      .and.to.emit(this.airbroFactorySMCampaign, "AdminChanged")
      .withArgs(this.signers.alice.address);

    // checking if new admin address is able to set MerkleRootHash
    expect(await existing1155NftDropContract.connect(this.signers.alice).setMerkleRoot(bytes32MerkleRootHash))
      .to.emit(existing1155NftDropContract, "MerkleRootChanged")
      .withArgs(bytes32MerkleRootHash);
  });
}
