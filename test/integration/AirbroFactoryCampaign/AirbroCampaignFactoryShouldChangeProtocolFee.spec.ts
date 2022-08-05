import { expect } from "chai";
import { ethers, network } from "hardhat";
import { MerkleTree } from "merkletreejs";
const { keccak256 } = ethers.utils;
import { constants } from "ethers";

export function AirbroCampaignFactoryShouldChangeProtocolFeeInAllAirDrops(): void {
  const newClaimFee = ethers.utils.parseEther("0.04");

  it("admin should be able to change protocol fee", async function () {
    // checking if admin address is able to change protocol fee
    expect(await this.airbroCampaignFactory.connect(this.signers.backendWallet).changeFee(newClaimFee))
      .to.emit(this.airbroCampaignFactory, "ClaimFeeChanged")
      .withArgs(newClaimFee);

    expect(await this.airbroCampaignFactory.claimFee()).to.be.equal(newClaimFee);
  });

  it("new admin should be able to change protocol fee", async function () {
    // changing admin address in the airbroCampaignFactory Contract
    await expect(this.airbroCampaignFactory.connect(this.signers.backendWallet).changeAdmin(this.signers.lisa.address))
      .to.emit(this.airbroCampaignFactory, `AdminChanged`)
      .withArgs(this.signers.lisa.address);

    expect(await this.airbroCampaignFactory.admin()).to.be.equal(this.signers.lisa.address);

    // checking if old admin can change protocol fee
    await expect(this.airbroCampaignFactory.connect(this.signers.backendWallet).changeFee(newClaimFee)).to.be.revertedWith(`NotAdmin`);

    // checking if new admin address is able to change protocol fee
    expect(await this.airbroCampaignFactory.connect(this.signers.lisa).changeFee(newClaimFee))
      .to.emit(this.airbroCampaignFactory, "ClaimFeeChanged")
      .withArgs(newClaimFee);

    expect(await this.airbroCampaignFactory.claimFee()).to.be.equal(newClaimFee);
  });

  // add test that checks if fee is differnt on drop contract after changing it on factory contract
}
