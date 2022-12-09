import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";
const { keccak256 } = ethers.utils;
import { constants } from "ethers";
import { claimFee, uri, name, symbol } from "../../../shared/constants";

const bytes32MerkleRootHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

export function NewSB1155DropCampaignShouldGoThroughUserFlow() {
  it("should set airbroCampaignFactoryAddress to the airbroFactory address", async function () {
    expect(await this.newSB1155DropCampaign.airbroCampaignFactory()).to.be.equal(this.airbroCampaignFactory.address);
  });

  it("should allow factory admin to set merkleRoot", async function () {
    await expect(this.newSB1155DropCampaign.connect(this.signers.backendWallet).setMerkleRoot(bytes32MerkleRootHash))
      .to.emit(this.newSB1155DropCampaign, "MerkleRootSet")
      .withArgs(bytes32MerkleRootHash);
  });

  it("should revert merkleRoot change from non admin account", async function () {
    await expect(
      this.newSB1155DropCampaign.connect(this.signers.alice).setMerkleRoot(bytes32MerkleRootHash),
    ).to.be.revertedWith("Unauthorized");
  });

  it("should test newSB1155DropCampaign Contract flow", async function () {
    await expect(
      this.airdropRegistry.connect(this.signers.registryAdmin).addFactory(this.airbroCampaignFactory.address),
    )
      .to.emit(this.airdropRegistry, "FactoryWhitelisted")
      .withArgs(this.airbroCampaignFactory.address);

    await expect(this.airbroCampaignFactory.connect(this.signers.backendWallet).closeBeta()).to.emit(
      this.airbroCampaignFactory,
      "BetaClosed",
    );

    // creating the NewSB1155DropCampaign from the factory contract
    await expect(
      this.airbroCampaignFactory.connect(this.signers.deployer).createNewSB1155DropCampaign(name, symbol, uri),
    ).to.emit(this.airdropRegistry, "NewAirdrop");
    const newSB1155DropCampaignFactory = await ethers.getContractFactory("NewSB1155DropCampaign");
    const NewSB1155DropCampaignContract = newSB1155DropCampaignFactory.attach(
      await this.airdropRegistry.getAirdrop(constants.Zero),
    );

    //create merkleRootHash
    const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address];
    const leaves = whitelisted.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
    const roothash = merkleTree.getHexRoot();

    //backendWallet sets new merkleRootHash upon completion of the campaign (deadline has passed)
    void expect(await NewSB1155DropCampaignContract.connect(this.signers.backendWallet).setMerkleRoot(roothash))
      .to.emit(NewSB1155DropCampaignContract, "MerkleRootSet")
      .withArgs(roothash);

    //create Merkle Proof for alice
    const hexProof = merkleTree.getHexProof(leaves[0]);

    // alice withdrawing 1155 on basis of her address being included in the merkleRoot
    void expect(
      await NewSB1155DropCampaignContract.connect(this.signers.alice).claim(hexProof, this.signers.alice.address, {
        value: claimFee,
      }),
    )
      .to.emit(NewSB1155DropCampaignContract, "Claimed")
      .withArgs(this.signers.alice.address)
      .and.to.emit(NewSB1155DropCampaignContract, "Attest")
      .withArgs(this.signers.alice.address);

    // alice trying to withdraw twice
    await expect(
      NewSB1155DropCampaignContract.connect(this.signers.alice).claim(hexProof, this.signers.alice.address, {
        value: claimFee,
      }),
    ).to.be.revertedWith("AlreadyRedeemed");

    // address that is not in merkleRootHash trying to withdraw
    await expect(
      NewSB1155DropCampaignContract.connect(this.signers.lisa).claim(hexProof, this.signers.lisa.address, {
        value: claimFee,
      }),
    ).to.be.revertedWith("NotEligible");

    // alice attempts to transfer soulbound token to another account -> it should revert
    await expect(
      NewSB1155DropCampaignContract.connect(this.signers.alice).safeTransferFrom(
        this.signers.alice.address,
        this.signers.jerry.address,
        constants.Zero,
        constants.One,
        "0x",
      ),
    ).to.be.revertedWith(`SoulboundTokenUntransferable`);

    // burning souldbound nft reward
    void expect(await NewSB1155DropCampaignContract.connect(this.signers.alice).burn())
      .to.emit(NewSB1155DropCampaignContract, "Revoke")
      .withArgs(this.signers.alice.address);

    // reverting burn attempt of soulbound nft if function not called by owner
    await expect(NewSB1155DropCampaignContract.connect(this.signers.alice).burn()).to.be.revertedWith(
      `ERC1155: burn amount exceeds balance`,
    );
  });
}
