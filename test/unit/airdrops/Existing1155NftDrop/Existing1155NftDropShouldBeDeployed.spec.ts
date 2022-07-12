import { expect } from "chai";
import { ethers } from "hardhat";

const dayInSeconds: number = 86400;
const airdropDuration: number = 2;

export const Existing1155NftDropShouldDeploy = (): void => {
  describe("should deploy", async function () {
    it("should have contract owner to address of deployer upon deployment", async function () {
      expect(await this.existing1155NFTDrop.owner()).to.be.equal(this.signers.deployer.address);
    });

    it("expect airdropStartTime to be the block timestamp", async function () {
      const blockNumBefore = await ethers.provider.getBlockNumber();
      const blockBefore = await ethers.provider.getBlock(blockNumBefore);

      expect(await this.existing1155NFTDrop.airdropStartTime()).to.be.equal(blockBefore.timestamp);
    });

    it("expect airdropFinishTime to be correctly set", async function () {
      const blockNumBefore = await ethers.provider.getBlockNumber();
      const blockBefore = await ethers.provider.getBlock(blockNumBefore);

      expect(await this.existing1155NFTDrop.airdropFinishTime()).to.be.equal(blockBefore.timestamp + airdropDuration * dayInSeconds);
    });

    it("should return correct airdrop type", async function () {
      expect(await this.existing1155NFTDrop.getAirdropType()).to.be.equal("ERC1155");
    });

    // it("should have merkleRoot set to 0x00", async function () {
    //   expect(await this.existing1155NFTDrop.merkleRoot()).to.be.equal("0x0000000000000000000000000000000000000000000000000000000000000000");
    // });

    // it("should set airBroFactoryAddress to the airbroFactory address", async function () {
    //   expect(await this.existing1155NFTDrop.airBroFactoryAddress()).to.be.equal(this.mocks.mockAirBroFactory.address);
    // });
  });
};
