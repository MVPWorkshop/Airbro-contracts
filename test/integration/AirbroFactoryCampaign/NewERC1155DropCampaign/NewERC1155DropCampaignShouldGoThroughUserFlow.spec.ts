import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";
const { keccak256 } = ethers.utils;
import { constants } from "ethers";
import { claimFee, uri, name, symbol } from "../../../shared/constants";

const bytes32MerkleRootHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

export function NewERC1155DropCampaignShouldGoThroughUserFlow() {
  it("should set airbroCampaignFactoryAddress to the airbroFactory address", async function () {
    expect(await this.newERC1155DropCampaign.airbroCampaignFactory()).to.be.equal(this.airbroCampaignFactory.address);
  });

  it("should allow factory admin to set merkleRoot", async function () {
    await expect(this.newERC1155DropCampaign.connect(this.signers.backendWallet).setMerkleRoot(bytes32MerkleRootHash))
      .to.emit(this.newERC1155DropCampaign, "MerkleRootSet")
      .withArgs(bytes32MerkleRootHash);
  });

  it("should revert merkleRoot change from non admin account", async function () {
    await expect(
      this.newERC1155DropCampaign.connect(this.signers.alice).setMerkleRoot(bytes32MerkleRootHash),
    ).to.be.revertedWith("Unauthorized");
  });

  it("should test newERC1155DropCampaign Contract flow", async function () {
    await expect(
      this.airdropRegistry.connect(this.signers.registryAdmin).addFactory(this.airbroCampaignFactory.address),
    )
      .to.emit(this.airdropRegistry, "FactoryWhitelisted")
      .withArgs(this.airbroCampaignFactory.address);

    await expect(this.airbroCampaignFactory.connect(this.signers.backendWallet).closeBeta()).to.emit(
      this.airbroCampaignFactory,
      "BetaClosed",
    );

    // testing whether the cloned contracts can initialize even if the OG "library" contract is
    // initalized, the OG contract from which the clones are made from
    const newERC1155DropCampaignOGFactory = await ethers.getContractFactory("NewERC1155DropCampaign");
    const NewERC1155DropCampaignOGContract = newERC1155DropCampaignOGFactory.attach(
      await this.airbroCampaignFactory.erc1155DropCampaign(),
    );
    await NewERC1155DropCampaignOGContract.initialize(name, symbol, uri, this.airbroCampaignFactory.address);

    // creating the NewERC1155DropCampaign from the factory contract
    await expect(
      this.airbroCampaignFactory.connect(this.signers.deployer).createNewERC1155DropCampaign(name, symbol, uri),
    ).to.emit(this.airdropRegistry, "NewAirdrop");
    const newERC1155DropCampaignFactory = await ethers.getContractFactory("NewERC1155DropCampaign");
    const NewERC1155DropCampaignContract = newERC1155DropCampaignFactory.attach(
      await this.airdropRegistry.getAirdrop(constants.Zero),
    );

    //create merkleRootHash
    const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address];
    const leaves = whitelisted.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
    const roothash = merkleTree.getHexRoot();

    //backendWallet sets new merkleRootHash upon completion of the campaign (deadline has passed)
    void expect(await NewERC1155DropCampaignContract.connect(this.signers.backendWallet).setMerkleRoot(roothash))
      .to.emit(NewERC1155DropCampaignContract, "MerkleRootSet")
      .withArgs(roothash);

    //create Merkle Proof for alice
    const hexProof = merkleTree.getHexProof(leaves[0]);

    // alice withdrawing 1155 on basis of her address being included in the merkleRoot
    void expect(
      await NewERC1155DropCampaignContract.connect(this.signers.alice).claim(hexProof, this.signers.alice.address, {
        value: claimFee,
      }),
    )
      .to.emit(NewERC1155DropCampaignContract, "Claimed")
      .withArgs(this.signers.alice.address);

    // alice trying to withdraw twice
    await expect(
      NewERC1155DropCampaignContract.connect(this.signers.alice).claim(hexProof, this.signers.alice.address, {
        value: claimFee,
      }),
    ).to.be.revertedWith("AlreadyRedeemed");

    // address that is not in merkleRootHash trying to withdraw
    await expect(
      NewERC1155DropCampaignContract.connect(this.signers.lisa).claim(hexProof, this.signers.lisa.address, {
        value: claimFee,
      }),
    ).to.be.revertedWith("NotEligible");
  });
}
