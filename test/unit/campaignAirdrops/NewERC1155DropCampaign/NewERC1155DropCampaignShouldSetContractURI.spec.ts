import { expect } from "chai";

export function NewERC1155DropCampaignShouldSetContractURI(): void {
  const contractURI = "https://example.com";

  describe("should set contract uri", async function () {
    it("should allow admin to set contract uri", async function () {
      await expect(this.newERC1155DropCampaign.connect(this.signers.backendWallet).setContractURI(contractURI))
        .to.emit(this.newERC1155DropCampaign, "ContractURISet")
        .withArgs(contractURI);
    });
    it("should revert merkleRoot change from non admin account", async function () {
      await expect(this.newERC1155DropCampaign.connect(this.signers.alice).setContractURI(contractURI)).to.be.revertedWith("Unauthorized");
    });
  });
}
