import { expect } from "chai";
import { ethers, network } from "hardhat";
import { MerkleTree } from "merkletreejs";
const { keccak256 } = ethers.utils;
import { constants } from "ethers";
import { claimFee } from "../../shared/constants";

export function AirbroCampaignFactoryShouldChangeProtocolFeeInAllAirDrops(): void {
  const newClaimFee = ethers.utils.parseEther("0.04");

  it("admin should be able to change protocol fee", async function () {
    // checking if admin address is able to change protocol fee
    expect(await this.airbroCampaignFactory.connect(this.signers.backendWallet).changeFee(newClaimFee))
      .to.emit(this.airbroCampaignFactory, "ClaimFeeChanged")
      .withArgs(newClaimFee);

    expect(await this.airbroCampaignFactory.claimFee()).to.be.equal(newClaimFee);
  });

  it("new admin should be able to change protocol fee", async function () {
    // changing admin address in the airbroCampaignFactory Contract
    await expect(this.airbroCampaignFactory.connect(this.signers.backendWallet).changeAdmin(this.signers.lisa.address))
      .to.emit(this.airbroCampaignFactory, `AdminChanged`)
      .withArgs(this.signers.lisa.address);

    expect(await this.airbroCampaignFactory.admin()).to.be.equal(this.signers.lisa.address);

    // checking if old admin can change protocol fee
    await expect(this.airbroCampaignFactory.connect(this.signers.backendWallet).changeFee(newClaimFee)).to.be.revertedWith(`NotAdmin`);

    // checking if new admin address is able to change protocol fee
    expect(await this.airbroCampaignFactory.connect(this.signers.lisa).changeFee(newClaimFee))
      .to.emit(this.airbroCampaignFactory, "ClaimFeeChanged")
      .withArgs(newClaimFee);

    expect(await this.airbroCampaignFactory.claimFee()).to.be.equal(newClaimFee);
  });

  it("new protocol fee should instantly be different on all daughter dropContracts", async function () {
    // changing protocol fee
    expect(await this.airbroCampaignFactory.connect(this.signers.backendWallet).changeFee(newClaimFee))
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
    expect(await this.newERC1155DropCampaign.connect(this.signers.backendWallet).setMerkleRoot(roothash))
      .to.emit(this.newERC1155DropCampaign, "MerkleRootSet")
      .withArgs(roothash);

    //create Merkle Proof for alice
    const hexProof = merkleTree.getHexProof(leaves[0]);

    const balanceBefore = await this.signers.alice.getBalance();

    // alice withdrawing 1155 on basis of her address being included in the merkleRoot
    expect(await this.newERC1155DropCampaign.connect(this.signers.alice).claim(hexProof, { value: newClaimFee }))
      .to.emit(this.newERC1155DropCampaign, "Claimed")
      .withArgs(this.signers.alice.address);

    // checking if claimFee has been withdrawn from claimer account
    const balanceAfter = await this.signers.alice.getBalance();
    expect(balanceBefore.sub(balanceAfter).gt(newClaimFee)).to.be.equal(true);
  });
}