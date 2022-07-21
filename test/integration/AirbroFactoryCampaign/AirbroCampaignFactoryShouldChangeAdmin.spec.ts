import { expect } from "chai";
import { ethers, network } from "hardhat";
import { MerkleTree } from "merkletreejs";
const { keccak256 } = ethers.utils;
import { constants } from "ethers";

export function AirbroCampaignFactoryShouldChangeAdminInAllAirDrops(): void {
  const bytes32MerkleRootHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

  it("change admin inheritance - ExistingERC20DropCampaign - empty test", async function () {});

  it("change admin inheritance - NewERC1155DropCampaign", async function () {
    // making merkleTree and merkleRootHash
    const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
    const leaves = whitelisted.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
    const roothash = merkleTree.getHexRoot();

    // checking if non-admin account is able to set MerkleRootHash
    await expect(this.newERC1155DropCampaign.connect(this.signers.alice).setMerkleRoot(bytes32MerkleRootHash)).to.be.revertedWith(
      `Unauthorized`,
    );

    // checking if admin address is able to set MerkleRootHash
    expect(await this.newERC1155DropCampaign.connect(this.signers.backendWallet).setMerkleRoot(roothash))
      .to.emit(this.newERC1155DropCampaign, "MerkleRootChanged")
      .withArgs(roothash);
  });

  it("new admin should be able to set merkleRoot", async function () {
    // making merkleTree and merkleRootHash
    const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address];
    const leaves = whitelisted.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
    const roothash = merkleTree.getHexRoot();

    // changing admin address in the airbroCampaignFactory Contract
    expect(await this.airbroCampaignFactory.connect(this.signers.backendWallet).changeAdmin(this.signers.lisa.address))
      .to.emit(this.airbroCampaignFactory, `AdminChanged`)
      .withArgs(this.signers.lisa.address);

    expect(await this.airbroCampaignFactory.admin()).to.be.equal(this.signers.lisa.address);

    // checking if old admin can set MerkleRootHash
    await expect(this.newERC1155DropCampaign.connect(this.signers.backendWallet).setMerkleRoot(roothash)).to.be.revertedWith(
      `Unauthorized`,
    );

    // checking if new admin address is able to set MerkleRootHash
    expect(await this.newERC1155DropCampaign.connect(this.signers.lisa).setMerkleRoot(roothash))
      .to.emit(this.newERC1155DropCampaign, "MerkleRootChanged")
      .withArgs(roothash);
  });
}
