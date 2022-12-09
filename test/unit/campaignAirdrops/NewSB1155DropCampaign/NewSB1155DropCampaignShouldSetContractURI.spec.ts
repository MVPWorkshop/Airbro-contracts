import { expect } from "chai";
const URI: string = "https://example.com";

export function NewSBDropCampaignShouldSetContractURI(): void {
  describe("should set contract URI", async function () {
    it("should allow admin to set contract URI", async function () {
      await expect(this.newSB1155DropCampaign.connect(this.signers.backendWallet).setContractURI(URI))
        .to.emit(this.newSB1155DropCampaign, "ContractURISet")
        .withArgs(URI);
    });

    it("should revert non-admin that tries to set the contract URI", async function () {
      await expect(this.newSB1155DropCampaign.connect(this.signers.alice).setContractURI(URI)).to.be.revertedWith(
        "Unauthorized",
      );
    });

    it("should revert if admin tries to set contractURI twice", async function () {
      await expect(this.newSB1155DropCampaign.connect(this.signers.backendWallet).setContractURI(URI))
        .to.emit(this.newSB1155DropCampaign, "ContractURISet")
        .withArgs(URI);

      await expect(
        this.newSB1155DropCampaign.connect(this.signers.backendWallet).setContractURI(URI),
      ).to.be.revertedWith("ContractUriAlreadySet");
    });
  });
}
