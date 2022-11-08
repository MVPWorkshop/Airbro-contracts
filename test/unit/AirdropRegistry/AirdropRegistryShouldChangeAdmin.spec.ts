import { expect } from "chai";
import { randomAddress } from "../../shared/constants";

export function AirdropRegistryShouldChangeAdmin(): void {
  describe("airdrop registry admin changing functionality", async function () {
    it("should be able to change registry admin", async function () {
      await expect(this.airdropRegistry.connect(this.signers.registryAdmin).changeAdmin(this.signers.jerry.address))
        .to.emit(this.airdropRegistry, "AdminChanged")
        .withArgs(this.signers.jerry.address);

      await expect(this.airdropRegistry.connect(this.signers.registryAdmin).addFactory(randomAddress)).to.be.revertedWith("NotAdmin");
      await expect(this.airdropRegistry.connect(this.signers.registryAdmin).removeFactory(randomAddress)).to.be.revertedWith("NotAdmin");

      await expect(this.airdropRegistry.connect(this.signers.jerry).addFactory(randomAddress)).to.emit(
        this.airdropRegistry,
        "FactoryWhitelisted",
      );
    });
  });
}
