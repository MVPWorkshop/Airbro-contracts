import { expect } from "chai";
import { ethers } from "hardhat";
import { oneWeekInSeconds } from "../../shared/constants";

export function shouldAirdropExisting1155NftDrop() {
  const bytes32MerkleRootHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

  it("should mint and drop existing IERC1155 NFT token", async function () {
    // minting an NFT's to alice and bob. Both addresses should receive a reward for holding this NFT collection
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.alice.address);
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.bob.address);
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.deployer.address);

    // minting 2 for jerry
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.jerry.address);
    await this.testNftCollection.connect(this.signers.deployer).safeMint(this.signers.jerry.address);

    const aliceBalance = await this.testNftCollection.balanceOf(this.signers.alice.address);
    expect(aliceBalance).to.be.equal(1);

    const bobBalance = await this.testNftCollection.balanceOf(this.signers.bob.address);
    expect(bobBalance).to.be.equal(1);

    const jerryBalance = await this.testNftCollection.balanceOf(this.signers.jerry.address);
    expect(jerryBalance).to.be.equal(2);

    // minting the admin an amount of 2000 1155 nft's
    const idOf1155: string = "nftAirdrop";
    const fullAmountOf1155: number = 2000;
    const amountOf1155: number = 1000;
    const tokenId: number = 1; // token id set to 1

    await this.test1155NftCollection.connect(this.signers.deployer).mint(idOf1155, fullAmountOf1155); // deployer minting 2000 nfts
    const adminBalance1155 = await this.test1155NftCollection.balanceOf(this.signers.deployer.address, tokenId);
    // console.log(`Admin's 1155Nft balance: ${parseInt(adminBalance1155)}`);
    expect(adminBalance1155).to.be.equal(2000);

    const tokensPerClaim: number = 1;
    const durationInDays: number = 1;

    // dropping the existing 1155 tokens to holders
    await expect(
      await this.airbroFactory
        .connect(this.signers.deployer)
        .dropExisting1155NftsToNftHolders(
          this.testNftCollection.address,
          this.test1155NftCollection.address,
          tokensPerClaim,
          tokenId,
          amountOf1155,
          durationInDays,
        ),
    ).to.emit(this.airbroFactory, "NewAirdrop");

    // getting the deployed airdrop contract found at the 0th index in the airdrops array of AirbroFactory.sol
    const existingDropFactory = await ethers.getContractFactory("Existing1155NftDrop");
    const dropContract = existingDropFactory.attach(await this.airbroFactory.airdrops(0));

    //funding our airdrop contract with existing 1155 nfts
    await expect(this.test1155NftCollection.connect(this.signers.deployer).setApprovalForAll(dropContract.address, true)).to.emit(
      this.test1155NftCollection,
      "ApprovalForAll",
    );
    await expect(dropContract.connect(this.signers.bob).fundAirdrop()).to.be.revertedWith(
      "ERC1155: caller is not token owner nor approved",
    );
    await expect(dropContract.fundAirdrop()).to.emit(dropContract, "AirdropFunded").withArgs(dropContract.address);

    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    expect(await dropContract.airdropFundBlockTimestamp()).to.be.equal(blockBefore.timestamp);

    await expect(dropContract.fundAirdrop()).to.be.revertedWith("AlreadyFunded");

    expect(await this.test1155NftCollection.balanceOf(dropContract.address, tokenId)).to.be.equal(amountOf1155); //our airdrop contract now has 1000 x nft1155 of id 1
    expect(await this.test1155NftCollection.balanceOf(this.signers.deployer.address, tokenId)).to.be.equal(fullAmountOf1155 - amountOf1155);

    // alice withdrawing 1155 on basis of owning nft with id of 1
    const _alice_nft_id = 0;
    const _bob_nft_id = 1;
    const _admin_nft_id = 2;
    const _jerry_nft_ids = [3, 4];

    let leftoverNftAmount: number = amountOf1155;

    await expect(dropContract.connect(this.signers.alice).claim(_bob_nft_id, [])).to.be.revertedWith("Unauthorized"); // Alice trying to claim based on Bob's NFT id which she does not own

    await expect(dropContract.connect(this.signers.alice).claim(_alice_nft_id, [])).to.emit(dropContract, "Claimed");
    expect(await this.test1155NftCollection.balanceOf(this.signers.alice.address, 1)).to.be.equal(1);
    await expect(dropContract.connect(this.signers.alice).claim(_alice_nft_id, [])).to.be.revertedWith("AlreadyRedeemed"); // error - 'ERC721: owner query for nonexistent token'
    leftoverNftAmount = leftoverNftAmount - tokensPerClaim;

    // alice withdrawing 1155 on basis of owning nft with id of 1
    await expect(dropContract.connect(this.signers.bob).claim(_admin_nft_id, [])).to.be.revertedWith("Unauthorized"); // Bob trying to claim based on Admins's NFT id he does not own
    await expect(dropContract.connect(this.signers.bob).claim(_bob_nft_id, [])).to.emit(dropContract, "Claimed");
    expect(await this.test1155NftCollection.balanceOf(this.signers.bob.address, 1)).to.be.equal(1);
    leftoverNftAmount = leftoverNftAmount - tokensPerClaim;

    await expect(dropContract.connect(this.signers.bob).claim(_bob_nft_id, [])).to.be.revertedWith("AlreadyRedeemed"); // error - 'ERC721: owner query for nonexistent token'

    // jerry batch claim
    expect(await this.test1155NftCollection.balanceOf(this.signers.jerry.address, 1)).to.be.equal(0);
    await dropContract.connect(this.signers.jerry).batchClaim(_jerry_nft_ids);
    expect(await this.test1155NftCollection.balanceOf(this.signers.jerry.address, 1)).to.be.equal(2);
    leftoverNftAmount = leftoverNftAmount - tokensPerClaim * 2; // since jerry claimed 2 tokens

    // airdropFunds provider withdrawing their leftover funds after the airdrop has finished
    await expect(dropContract.connect(this.signers.deployer).withdrawAirdropFunds()).to.be.revertedWith("AirdropStillInProgress");

    await ethers.provider.send("evm_increaseTime", [oneWeekInSeconds]); // add one week worth of seconds

    await expect(dropContract.connect(this.signers.bob).withdrawAirdropFunds()).to.be.revertedWith("Unauthorized");

    const balanceBeforeWithdraw = await this.test1155NftCollection.balanceOf(this.signers.deployer.address, tokenId);
    await dropContract.connect(this.signers.deployer).withdrawAirdropFunds();
    const balanceAfterWithdraw = await this.test1155NftCollection.balanceOf(this.signers.deployer.address, tokenId);

    expect(balanceAfterWithdraw.toNumber()).to.be.equal(balanceBeforeWithdraw.toNumber() + leftoverNftAmount);
  });
}
