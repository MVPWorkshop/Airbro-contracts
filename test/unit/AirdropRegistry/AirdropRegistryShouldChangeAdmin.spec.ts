import { expect } from "chai";
import { Wallet } from "ethers";

export function AirdropRegistryShouldChangeAdmin(): void {
  describe("airdrop registry admin changing functionality", async function () {
    it("should be able to change admin", async function () {
      const newAdmin: Wallet = this.signers.jerry;
      // changing admin address in the airdropRegistry Contract
      await expect(this.airdropRegistry.connect(this.signers.registryAdmin).changeAdmin(newAdmin.address))
        .to.emit(this.airdropRegistry, `AdminChanged`)
        .withArgs(newAdmin.address);
    });
    it("should revert when non admin address tries to initialize admin change", async function () {
      const nonAdmin: Wallet = this.signers.jerry;
      await expect(this.airdropRegistry.connect(nonAdmin).changeAdmin(this.signers.jerry.address)).to.be.revertedWith(
        `NotAdmin`,
      );
    });
  });
}
