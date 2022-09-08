import { expect } from "chai";
import { ethers, network } from "hardhat";
import { MerkleTree } from "merkletreejs";
const { keccak256 } = ethers.utils;
const dayInSeconds: number = 86400;
import { claimFee } from "../../../shared/constants";
import { constants } from "ethers";

export function ExistingERC20DropCampaignShouldGoThroughUserFlow(): void {
  describe("should go through user flow", async function () {
    it("should create and fund ExistingERC20DropCampaign, allow users to claim, and allow funder to withdraw remaining funds", async function () {
      const tokenSupply: number = this.existingERC20DropCampaignArgs.tokenSupply; // 100

      await expect(this.airdropRegistry.connect(this.signers.registryAdmin).addFactory(this.airbroCampaignFactory.address))
        .to.emit(this.airdropRegistry, "FactoryWhitelisted")
        .withArgs(this.airbroCampaignFactory.address);

      await expect(this.airbroCampaignFactory.connect(this.signers.backendWallet).closeBeta()).to.emit(
        this.airbroCampaignFactory,
        "BetaClosed",
      );

      // creating the ExistingERC20DropCampaign from the factory contract
      await expect(
        this.airbroCampaignFactory.connect(this.signers.deployer).createExistingERC20DropCampaign(this.testToken.address, tokenSupply),
      ).to.emit(this.airdropRegistry, "NewAirdrop");
      const existingERC20DropCampaignFactory = await ethers.getContractFactory("ExistingERC20DropCampaign");
      const ExistingERC20DropCampaignContract = existingERC20DropCampaignFactory.attach(
        await this.airdropRegistry.airdrops(constants.Zero),
      );

      //   deployer mints tokens, and approves them to the airdrop contract
      await this.testToken.mint(this.signers.deployer.address, tokenSupply);
      await this.testToken.connect(this.signers.deployer).approve(ExistingERC20DropCampaignContract.address, tokenSupply);

      // funding contract
      await expect(ExistingERC20DropCampaignContract.connect(this.signers.deployer).fundAirdrop()).to.emit(
        ExistingERC20DropCampaignContract,
        "AirdropFunded",
      );
      expect(await ExistingERC20DropCampaignContract.airdropFunded()).to.be.equal(true);

      // setting merkle root
      const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address, this.signers.lisa.address]; // 4 persons can claim
      const leaves = whitelisted.map(addr => keccak256(addr));
      const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
      const roothash = merkleTree.getHexRoot();
      const aliceHexProof = merkleTree.getHexProof(leaves[0]);
      const bobHexProof = merkleTree.getHexProof(leaves[1]);

      await ExistingERC20DropCampaignContract.connect(this.signers.backendWallet).setMerkleRoot(roothash, whitelisted.length);

      expect(await this.testToken.balanceOf(this.signers.alice.address)).to.be.equal(0); // Initial balance of Alice
      expect(await this.testToken.balanceOf(ExistingERC20DropCampaignContract.address)).to.be.equal(100); // Contract balance after withdrawl

      expect(await ExistingERC20DropCampaignContract.connect(this.signers.alice).getAirdropAmount(aliceHexProof)).to.be.equal(25); // Alice using correct merkle proof should return 25 (tokenSupply / 4)
      expect(await ExistingERC20DropCampaignContract.connect(this.signers.bob).getAirdropAmount(aliceHexProof)).to.be.equal(0); // Bob using wrong Merkle Proof should return 0

      // alice claiming her tokens
      await expect(ExistingERC20DropCampaignContract.connect(this.signers.alice).claim(aliceHexProof, { value: claimFee }))
        .to.emit(ExistingERC20DropCampaignContract, "Claimed")
        .withArgs(this.signers.alice.address);

      expect(await this.testToken.balanceOf(this.signers.alice.address)).to.be.equal(25); // Alice's balance after claiming
      expect(await this.testToken.balanceOf(ExistingERC20DropCampaignContract.address)).to.be.equal(75); // Contract balance after withdrawl

      // Funder trying to withdraw remaining funds as Unauthorized account and before the expiration date
      await expect(ExistingERC20DropCampaignContract.connect(this.signers.alice).withdrawAirdropFunds()).to.be.revertedWith("Unauthorized");
      await expect(ExistingERC20DropCampaignContract.connect(this.signers.deployer).withdrawAirdropFunds()).to.be.revertedWith(
        "AirdropStillActive",
      );

      // changing the timestamp to be 1 second after the expiration date
      await network.provider.send("evm_increaseTime", [60 * dayInSeconds + 1]); // 1 seconds after expirationTimestamp
      await network.provider.send("evm_mine");

      // bob trying to claim after campaign expiration date
      await expect(ExistingERC20DropCampaignContract.connect(this.signers.bob).claim(bobHexProof, { value: claimFee })).to.be.revertedWith(
        "AirdropExpired",
      );

      // deployer withdrawing funds after campaign expiration date
      expect(await this.testToken.balanceOf(this.signers.deployer.address)).to.be.equal(0);
      await ExistingERC20DropCampaignContract.connect(this.signers.deployer).withdrawAirdropFunds();
      expect(await this.testToken.balanceOf(this.signers.deployer.address)).to.be.equal(75);
    });
  });
}
