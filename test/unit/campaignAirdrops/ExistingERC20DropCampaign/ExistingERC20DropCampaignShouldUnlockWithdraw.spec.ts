import { expect } from "chai";

export function ExistingERC20DropCampaignShouldUnlockWithdraw(): void {
  const bytes32MerkleRootHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

  describe("unlocking withdraw for funder address", async function () {
    it("should revert if merkleRootHash is already set", async function () {
      await expect(this.existingERC20DropCampaign.connect(this.signers.backendWallet).setMerkleRoot(bytes32MerkleRootHash, 20))
        .to.emit(this.existingERC20DropCampaign, "MerkleRootSet")
        .withArgs(bytes32MerkleRootHash);

      await expect(this.existingERC20DropCampaign.connect(this.signers.backendWallet).unlockWithdraw()).to.be.revertedWith(
        "MerkleRootHashSet",
      );
    });
  });
}
