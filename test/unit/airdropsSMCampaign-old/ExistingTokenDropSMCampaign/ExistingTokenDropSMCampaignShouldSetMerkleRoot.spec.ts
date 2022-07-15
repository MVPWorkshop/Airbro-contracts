import { expect } from "chai";

export const ExistingTokenDropSMCampaignShouldSetMerkleRoot = (): void => {
  const bytes32MerkleRootHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

  describe("should set merkleRoot", async function () {
    it("should allow admin to set merkleRoot", async function () {
      await expect(this.existingTokenDropSMCampaign.connect(this.signers.backendWallet).setMerkleRoot(bytes32MerkleRootHash))
        .to.emit(this.existingTokenDropSMCampaign, "MerkleRootChanged")
        .withArgs(bytes32MerkleRootHash);
    });

    it("should revert merkleRoot change from non admin account", async function () {
      const nonOwnerAccount = this.signers.alice;
      await expect(this.existingTokenDropSMCampaign.connect(nonOwnerAccount).setMerkleRoot(bytes32MerkleRootHash)).to.be.revertedWith(
        "Unauthorized",
      );
    });
  });
};
