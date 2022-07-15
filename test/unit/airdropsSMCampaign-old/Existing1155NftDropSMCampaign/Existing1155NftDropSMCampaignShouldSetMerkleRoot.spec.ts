import { expect } from "chai";

export const Existing1155NftDropSMCampaignShouldSetMerkleRoot = (): void => {
  const bytes32MerkleRootHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

  describe("should set merkleRoot", async function () {
    it("should allow admin to set merkleRoot", async function () {
      await expect(this.existing1155NFTDropSMCampaign.connect(this.signers.backendWallet).setMerkleRoot(bytes32MerkleRootHash))
        .to.emit(this.existing1155NFTDropSMCampaign, "MerkleRootChanged")
        .withArgs(bytes32MerkleRootHash);
    });
    it("should revert merkleRoot change from non admin account", async function () {
      const nonOwnerAccount = this.signers.alice;
      await expect(this.existing1155NFTDropSMCampaign.connect(nonOwnerAccount).setMerkleRoot(bytes32MerkleRootHash)).to.be.revertedWith(
        "Unauthorized",
      );
    });
  });
};
