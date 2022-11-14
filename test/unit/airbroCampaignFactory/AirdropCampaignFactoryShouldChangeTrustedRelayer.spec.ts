import { expect } from "chai";
import { randomAddress } from "../../shared/constants";

export function AirdropCampaignFactoryShouldChangeTrustedRelayer(): void {
  describe("should change trusted relayer", async function () {
    it("should allow backend to change airbroManager", async function () {
      await expect(this.airbroCampaignFactory.connect(this.signers.backendWallet).changeTrustedRelayer(randomAddress))
        .to.emit(this.airbroCampaignFactory, "TrustedRelayerChanged")
        .withArgs(randomAddress);
    });

    it("should revert airbroManager change attempt from non backendWallet address", async function () {
      await expect(this.airbroCampaignFactory.connect(this.signers.alice).changeTrustedRelayer(randomAddress)).to.be.revertedWith(
        "NotAdmin",
      );
    });
  });
}
