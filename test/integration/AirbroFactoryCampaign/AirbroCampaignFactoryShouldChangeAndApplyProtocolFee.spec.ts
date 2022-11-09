import { expect } from "chai";
import { ethers, waffle } from "hardhat";
const provider = waffle.provider;
import { MerkleTree } from "merkletreejs";
const { keccak256 } = ethers.utils;
import { uri, name, symbol, randomAddress, treasuryAddress } from "../../shared/constants";

export function AirbroCampaignFactoryShouldChangeAndApplyProtocolFeeInAllAirDrops(): void {
  const newClaimFee = ethers.utils.parseEther("0.04");
  const newCreatorFee = ethers.utils.parseEther("0.08");

  it("admin should be able to change protocol claim fee", async function () {
    // checking if admin address is able to change protocol claim fee
    void expect(await this.airbroCampaignFactory.connect(this.signers.backendWallet).changeClaimFee(newClaimFee))
      .to.emit(this.airbroCampaignFactory, "ClaimFeeChanged")
      .withArgs(newClaimFee);

    expect(await this.airbroCampaignFactory.claimFee()).to.be.equal(newClaimFee);
  });

  it("new admin should be able to change protocol claim fee", async function () {
    // changing admin address in the airbroCampaignFactory Contract
    await expect(this.airbroCampaignFactory.connect(this.signers.backendWallet).changeAdmin(this.signers.lisa.address))
      .to.emit(this.airbroCampaignFactory, `AdminChanged`)
      .withArgs(this.signers.lisa.address);

    expect(await this.airbroCampaignFactory.admin()).to.be.equal(this.signers.lisa.address);

    // checking if old admin can change protocol fee
    await expect(this.airbroCampaignFactory.connect(this.signers.backendWallet).changeClaimFee(newClaimFee)).to.be.revertedWith(`NotAdmin`);

    // checking if new admin address is able to change protocol claim fee
    void expect(await this.airbroCampaignFactory.connect(this.signers.lisa).changeClaimFee(newClaimFee))
      .to.emit(this.airbroCampaignFactory, "ClaimFeeChanged")
      .withArgs(newClaimFee);

    expect(await this.airbroCampaignFactory.claimFee()).to.be.equal(newClaimFee);
  });

  it("new protocol claim fee should instantly be different on all daughter dropContracts", async function () {
    // changing protocol fee
    void expect(await this.airbroCampaignFactory.connect(this.signers.backendWallet).changeClaimFee(newClaimFee))
      .to.emit(this.airbroCampaignFactory, "ClaimFeeChanged")
      .withArgs(newClaimFee);

    // checking if claimFee has been changed on factory contract
    expect(await this.airbroCampaignFactory.claimFee()).to.be.equal(newClaimFee);

    // finishing newERC1155DropCampaign and generating its merkleRootHash in order to test claiming with new claimFee

    //create merkleRootHash
    const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address];
    const leaves = whitelisted.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
    const roothash = merkleTree.getHexRoot();

    //backendWallet sets new merkleRootHash upon completion of the campaign (deadline has passed)
    void expect(await this.newERC1155DropCampaign.connect(this.signers.backendWallet).setMerkleRoot(roothash))
      .to.emit(this.newERC1155DropCampaign, "MerkleRootSet")
      .withArgs(roothash);

    //create Merkle Proof for alice
    const hexProof = merkleTree.getHexProof(leaves[0]);

    const balanceBefore = await this.signers.alice.getBalance();

    // alice withdrawing 1155 on basis of her address being included in the merkleRoot
    void expect(
      await this.newERC1155DropCampaign.connect(this.signers.alice).claim(hexProof, this.signers.alice.address, { value: newClaimFee }),
    )
      .to.emit(this.newERC1155DropCampaign, "Claimed")
      .withArgs(this.signers.alice.address);

    // checking if claimFee has been withdrawn from claimer account
    const balanceAfter = await this.signers.alice.getBalance();
    expect(balanceBefore.sub(balanceAfter).gt(newClaimFee)).to.be.equal(true);
  });

  it("admin should be able to change protocol creator fee", async function () {
    // checking if admin address is able to change protocol creator fee
    void expect(await this.airbroCampaignFactory.connect(this.signers.backendWallet).changeCreatorFee(newCreatorFee))
      .to.emit(this.airbroCampaignFactory, "CreatorFeeChanged")
      .withArgs(newCreatorFee);

    expect(await this.airbroCampaignFactory.creatorFee()).to.be.equal(newCreatorFee);
  });

  it("new admin should be able to change protocol creator fee", async function () {
    // changing admin address in the airbroCampaignFactory Contract
    await expect(this.airbroCampaignFactory.connect(this.signers.backendWallet).changeAdmin(this.signers.lisa.address))
      .to.emit(this.airbroCampaignFactory, `AdminChanged`)
      .withArgs(this.signers.lisa.address);

    expect(await this.airbroCampaignFactory.admin()).to.be.equal(this.signers.lisa.address);

    // checking if old admin can change protocol fee
    await expect(this.airbroCampaignFactory.connect(this.signers.backendWallet).changeCreatorFee(newCreatorFee)).to.be.revertedWith(
      `NotAdmin`,
    );

    // checking if new admin address is able to change protocol creator fee
    void expect(await this.airbroCampaignFactory.connect(this.signers.lisa).changeCreatorFee(newCreatorFee))
      .to.emit(this.airbroCampaignFactory, "CreatorFeeChanged")
      .withArgs(newCreatorFee);

    expect(await this.airbroCampaignFactory.creatorFee()).to.be.equal(newCreatorFee);
  });

  it("creator fee should be applied to all dropCampaign creations", async function () {
    await expect(this.airdropRegistry.connect(this.signers.registryAdmin).addFactory(this.airbroCampaignFactory.address))
      .to.emit(this.airdropRegistry, "FactoryWhitelisted")
      .withArgs(this.airbroCampaignFactory.address);

    // checking if admin address is able to change protocol creator fee
    void expect(await this.airbroCampaignFactory.connect(this.signers.backendWallet).changeCreatorFee(newCreatorFee))
      .to.emit(this.airbroCampaignFactory, "CreatorFeeChanged")
      .withArgs(newCreatorFee);

    expect(await this.airbroCampaignFactory.creatorFee()).to.be.equal(newCreatorFee);

    await expect(this.airbroCampaignFactory.connect(this.signers.backendWallet).closeBeta()).to.emit(
      this.airbroCampaignFactory,
      "BetaClosed",
    );

    const treasuryBefore = await provider.getBalance(treasuryAddress);

    await expect(
      this.airbroCampaignFactory.connect(this.signers.alice).createNewERC1155DropCampaign(name, symbol, uri, { value: newCreatorFee }),
    ).to.emit(this.airdropRegistry, "NewAirdrop");

    await expect(
      this.airbroCampaignFactory.connect(this.signers.alice).createNewSB1155DropCampaign(name, symbol, uri, { value: newCreatorFee }),
    ).to.emit(this.airdropRegistry, "NewAirdrop");

    await expect(
      this.airbroCampaignFactory.connect(this.signers.alice).createExistingERC20DropCampaign(randomAddress, 1000, { value: newCreatorFee }),
    ).to.emit(this.airdropRegistry, "NewAirdrop");

    const treasuryAfter = await provider.getBalance(treasuryAddress);

    const campaignsCreated = 3;
    expect(treasuryAfter.sub(treasuryBefore)).to.equal(newCreatorFee.mul(campaignsCreated));
  });
}
