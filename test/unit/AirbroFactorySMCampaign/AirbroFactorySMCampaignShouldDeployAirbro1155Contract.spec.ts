import { expect } from "chai";
import { ethers } from "hardhat";
import { constants } from "ethers";

export const AirbroFactorySMCampaignShouldDelpoyAirbro1155Contract = (): void => {
  describe("should deploy new 1155 NFT Collection", async function () {
    it("should create new 1155 NFT Collection", async function () {
      // create new 1155 nft collection
      expect(
        await this.airbroFactorySMCampaign.createNewNft1155Contract(
          "ipfs://bafybeict2kq6gt4ikgulypt7h7nwj4hmfi2kevrqvnx2osibfulyy5x3hu/no-time-to-explain.jpeg",
        ),
      )
        .to.emit(this.airbroFactorySMCampaign, "NewNft1155Contract")
        .withArgs(await this.airbroFactorySMCampaign.nft1155Contracts(constants.Zero), this.signers.deployer.address);
    });

    it("should allow user to mint an NFT from the new collection", async function () {
      await this.airbroFactorySMCampaign.createNewNft1155Contract(
        "ipfs://bafybeict2kq6gt4ikgulypt7h7nwj4hmfi2kevrqvnx2osibfulyy5x3hu/no-time-to-explain.jpeg",
      );

      const new1155NftCollectionFactory = await ethers.getContractFactory("Airbro1155Contract");
      const collection1155 = new1155NftCollectionFactory.attach(await this.airbroFactorySMCampaign.nft1155Contracts(constants.Zero));

      await collection1155.connect(this.signers.alice).mint();

      expect(await collection1155.connect(this.signers.alice).balanceOf(this.signers.alice.address, constants.Zero)).to.be.equal(
        constants.One,
      );
    });

    it("should increment totalNft1155ContractsCount for each 1155 NFT Collection created", async function () {
      await this.airbroFactorySMCampaign.createNewNft1155Contract(
        "ipfs://bafybeict2kq6gt4ikgulypt7h7nwj4hmfi2kevrqvnx2osibfulyy5x3hu/no-time-to-explain.jpeg",
      );
      expect(await this.airbroFactorySMCampaign.totalNft1155ContractsCount()).to.be.equal(constants.One);

      await this.airbroFactorySMCampaign.createNewNft1155Contract(
        "ipfs://bafybeict2kq6gt4ikgulypt7h7nwj4hmfi2kevrqvnx2osibfulyy5x3hu/no-time-to-explain.jpeg",
      );
      expect(await this.airbroFactorySMCampaign.totalNft1155ContractsCount()).to.be.equal(constants.Two);
    });
  });
};
