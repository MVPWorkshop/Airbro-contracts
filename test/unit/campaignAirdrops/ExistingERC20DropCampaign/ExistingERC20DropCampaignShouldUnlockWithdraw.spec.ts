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

    it("should unlock withdraw", async function () {
      // not sure how to mock funding the contract or how to mock a specific var in the this.existingERC20DropCampaign contract if that is possible
      await expect(this.existingERC20DropCampaign.connect(this.signers.alice).fundAirdrop()).to.emit(
        this.existingERC20DropCampaign,
        "AirdropFunded",
      );

      await expect(this.existingERC20DropCampaign.connect(this.signers.backendWallet).unlockWithdraw()).to.emit(
        this.existingERC20DropCampaign,
        "WithdrawUnlocked",
      );

      await this.existingERC20DropCampaign.connect(this.signers.alice).withdrawAirdropFunds();
    });
  });
}
