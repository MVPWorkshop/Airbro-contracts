import { expect } from "chai";

export function NewERC1155DropCampaignShouldSetMerkleRoot(): void {
  const bytes32MerkleRootHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

  describe("should set merkleRoot", async function () {
    it("should allow admin to set merkleRoot", async function () {
      await expect(this.newERC1155DropCampaign.connect(this.signers.backendWallet).setMerkleRoot(bytes32MerkleRootHash))
        .to.emit(this.newERC1155DropCampaign, "MerkleRootSet")
        .withArgs(bytes32MerkleRootHash);
    });
    it("should revert merkleRoot change from non admin account", async function () {
      await expect(this.newERC1155DropCampaign.connect(this.signers.alice).setMerkleRoot(bytes32MerkleRootHash)).to.be.revertedWith(
        "Unauthorized",
      );
    });
  });
}
