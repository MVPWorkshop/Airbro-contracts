import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";
const { keccak256 } = ethers.utils;
import { constants } from "ethers";
import { oneWeekInSeconds } from "../../../shared/constants";

const bytes32MerkleRootHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

export function NewERC1155DropCampaignShouldGoThroughUserFlow() {
  it("should set airbroCampaignFactoryAddress to the airbroFactory address", async function () {
    expect(await this.newERC1155DropCampaign.airbroCampaignFactoryAddress()).to.be.equal(this.airbroCampaignFactory.address);
  });

  it("should allow factory admin to set merkleRoot", async function () {
    await expect(this.newERC1155DropCampaign.connect(this.signers.backendWallet).setMerkleRoot(bytes32MerkleRootHash))
      .to.emit(this.newERC1155DropCampaign, "MerkleRootChanged")
      .withArgs(bytes32MerkleRootHash);
  });

  it("should revert merkleRoot change from non admin account", async function () {
    await expect(this.newERC1155DropCampaign.connect(this.signers.alice).setMerkleRoot(bytes32MerkleRootHash)).to.be.revertedWith(
      "Unauthorized",
    );
  });

  it("should test newERC1155DropCampaign Contract flow", async function () {
    //create merkleRootHash
    const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address];
    const leaves = whitelisted.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
    const roothash = merkleTree.getHexRoot();

    //backendWallet sets new merkleRootHash upon completion of the campaign (deadline has passed)
    expect(await this.newERC1155DropCampaign.connect(this.signers.backendWallet).setMerkleRoot(roothash))
      .to.emit(this.newERC1155DropCampaign, "MerkleRootChanged")
      .withArgs(roothash);

    //create Merkle Proof for alice
    const hexProof = merkleTree.getHexProof(leaves[0]);

    // alice withdrawing 1155 on basis of her address being included in the merkleRoot
    expect(await this.newERC1155DropCampaign.connect(this.signers.alice).claim(hexProof))
      .to.emit(this.newERC1155DropCampaign, "Claimed")
      .withArgs(this.signers.alice.address);

    // alice trying to withdraw twice
    await expect(this.newERC1155DropCampaign.connect(this.signers.alice).claim(hexProof)).to.be.revertedWith("AlreadyRedeemed");

    // address that is not in merkleRootHash trying to withdraw
    await expect(this.newERC1155DropCampaign.connect(this.signers.lisa).claim(hexProof)).to.be.revertedWith("NotEligible");
  });
}
