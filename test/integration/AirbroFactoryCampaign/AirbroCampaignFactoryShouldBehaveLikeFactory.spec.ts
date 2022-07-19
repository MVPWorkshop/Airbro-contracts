import { expect } from "chai";
import { ethers } from "hardhat";
import { uri } from "../../shared/constants";
import { constants } from "ethers";

export function AirbroCampaignFactoryShouldBehaveLikeFactory(): void {
  it("should emit NewAirdrop event", async function () {
    await expect(this.airbroCampaignFactory.connect(this.signers.deployer).createNewERC1155DropCampaign(uri)).to.emit(
      this.airbroCampaignFactory,
      "NewAirdrop",
    );
  });

  it("should increment totalAirdropsCount", async function () {
    expect(await this.airbroCampaignFactory.totalAirdropsCount()).to.be.equal(constants.Zero);

    await expect(this.airbroCampaignFactory.connect(this.signers.deployer).createNewERC1155DropCampaign(uri)).to.emit(
      this.airbroCampaignFactory,
      "NewAirdrop",
    );

    expect(await this.airbroCampaignFactory.totalAirdropsCount()).to.be.equal(constants.One);
  });
}
