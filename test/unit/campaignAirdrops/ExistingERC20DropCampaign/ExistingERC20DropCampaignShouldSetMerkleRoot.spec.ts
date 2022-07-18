import { expect } from "chai";

export function ExistingERC20DropCampaignShouldSetMerkleRoot(): void {
  const bytes32MerkleRootHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

  describe("should set merkle root", async function () {
    it("admin of contract should be able to set the merkle root", async function () {
      await expect(this.existingERC20DropCampaign.connect(this.signers.backendWallet).setMerkleRoot(bytes32MerkleRootHash, 20))
        .to.emit(this.existingERC20DropCampaign, "MerkleRootChanged")
        .withArgs(bytes32MerkleRootHash, 20);
    });

    it("should revert merkleRoot change from non admin account", async function () {
      await expect(this.existingERC20DropCampaign.connect(this.signers.alice).setMerkleRoot(bytes32MerkleRootHash, 20)).to.be.revertedWith(
        "Unauthorized",
      );
    });

    it("should revert 2nd merkle root change attempt", async function () {
      // setting merkle root
      this.existingERC20DropCampaign.connect(this.signers.backendWallet).setMerkleRoot(bytes32MerkleRootHash, 20);

      //trying to set it again
      await expect(
        this.existingERC20DropCampaign.connect(this.signers.backendWallet).setMerkleRoot(bytes32MerkleRootHash, 20),
      ).to.be.revertedWith("MerkleRootAlreadySet");
    });
  });
}
