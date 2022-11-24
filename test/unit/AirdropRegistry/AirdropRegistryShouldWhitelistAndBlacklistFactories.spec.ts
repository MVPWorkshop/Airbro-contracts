import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Wallet } from "ethers";
import { randomAddress } from "../../shared/constants";

export function AirdropRegistryShouldWhitelistAndBlacklistFactories(): void {
  describe("airdrop registry admin changing functionality", async function () {
    it("should only allow admin to whitelist factories", async function () {
      const admin: SignerWithAddress = this.signers.registryAdmin;
      const nonAdmin: Wallet = this.signers.jerry;

      await expect(this.airdropRegistry.connect(nonAdmin).addFactory(randomAddress)).to.be.revertedWith("NotAdmin");
      await expect(this.airdropRegistry.connect(admin).addFactory(randomAddress)).to.emit(
        this.airdropRegistry,
        "FactoryWhitelisted",
      );
    });

    it("should only allow admin to blacklist factories", async function () {
      const admin: SignerWithAddress = this.signers.registryAdmin;
      const nonAdmin: Wallet = this.signers.jerry;

      await expect(this.airdropRegistry.connect(nonAdmin).removeFactory(randomAddress)).to.be.revertedWith("NotAdmin");
      await expect(this.airdropRegistry.connect(admin).removeFactory(randomAddress)).to.emit(
        this.airdropRegistry,
        "FactoryBlacklisted",
      );
    });
  });
}
