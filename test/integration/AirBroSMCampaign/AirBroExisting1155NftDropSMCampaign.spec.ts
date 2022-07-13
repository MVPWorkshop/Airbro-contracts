import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";
const { keccak256 } = ethers.utils;
import { constants } from "ethers";
import { oneWeekInSeconds } from "../../shared/constants";

const bytes32MerkleRootHash = "0x0000000000000000000000000000000000000000000000000000000000000000";


export function AirbroFactorySMCampaignShouldAirdropExisting1155NftDropSMCampaign() {

  it("should revert if non-admin wallet tries to change merkleRootHash", async function () {

    await this.airbroFactorySMCampaign.createNewNft1155Contract("ipfs://bafybeict2kq6gt4ikgulypt7h7nwj4hmfi2kevrqvnx2osibfulyy5x3hu/no-time-to-explain.jpeg")

    // getting the deployed Airbro1155 contract found at the 0th index in the nft1155Contracts array of AirbroFactorySMCampaign.sol
    const new1155NftCollectionFactory = await ethers.getContractFactory("Airbro1155Contract");
    const collection1155 = new1155NftCollectionFactory.attach(await this.airbroFactorySMCampaign.nft1155Contracts(constants.Zero));

    const amountOf1155: number = 1000;
    const tokenId: number = 1; // token id set to 1
    const tokensPerClaim: number = 1;
    const durationInDays: number = 1;

    // dropping the existing 1155 tokens to holders
    await this.airbroFactorySMCampaign
        .connect(this.signers.deployer)
        .dropExisting1155NftsToNftHolders(
          collection1155.address,
          this.test1155NftCollection.address,
          tokensPerClaim,
          tokenId,
          amountOf1155,
          durationInDays
        );

    // getting the deployed airdrop contract found at the 0th index in the airdrops array of AirbroFactorySMCampaign.sol
    const existingDropFactory = await ethers.getContractFactory("Existing1155NftDropSMCampaign");
    const dropContract = existingDropFactory.attach(await this.airbroFactorySMCampaign.airdrops(constants.Zero));

    //backendWallet sets new merkleRootHash upon completion of the campaign (deadline has passed)
    await expect(dropContract.connect(this.signers.bob).setMerkleRoot(bytes32MerkleRootHash))
      .to.be.revertedWith(`Unauthorized`);

  });

  it("should fund airdrop for existing1155NftDropSCCampaign", async function () {

    await this.airbroFactorySMCampaign.createNewNft1155Contract("ipfs://bafybeict2kq6gt4ikgulypt7h7nwj4hmfi2kevrqvnx2osibfulyy5x3hu/no-time-to-explain.jpeg")

    // getting the deployed Airbro1155 contract found at the 0th index in the nft1155Contracts array of AirbroFactorySMCampaign.sol
    const new1155NftCollectionFactory = await ethers.getContractFactory("Airbro1155Contract");
    const collection1155 = new1155NftCollectionFactory.attach(await this.airbroFactorySMCampaign.nft1155Contracts(constants.Zero));

    // minting the admin an amount of 2000 1155 nft's
    const idOf1155: string = "nftAirdrop";
    const fullAmountOf1155: number = 2000;
    const amountOf1155: number = 1000;
    const tokenId: number = 1; // token id set to 1
    const tokensPerClaim: number = 1;
    const durationInDays: number = 1;

    await this.test1155NftCollection.connect(this.signers.deployer).mint(idOf1155, fullAmountOf1155); // deployer minting 2000 nfts
    const adminBalance1155 = await this.test1155NftCollection.balanceOf(this.signers.deployer.address, tokenId);
    expect(adminBalance1155).to.be.equal(2000);

    // dropping the existing 1155 tokens to holders
    await this.airbroFactorySMCampaign
        .connect(this.signers.deployer)
        .dropExisting1155NftsToNftHolders(
          collection1155.address,
          this.test1155NftCollection.address,
          tokensPerClaim,
          tokenId,
          amountOf1155,
          durationInDays
        );

    // getting the deployed airdrop contract found at the 0th index in the airdrops array of AirbroFactorySMCampaign.sol
    const existingDropFactory = await ethers.getContractFactory("Existing1155NftDropSMCampaign");
    const dropContract = existingDropFactory.attach(await this.airbroFactorySMCampaign.airdrops(constants.Zero));

    //funding our airdrop contract with existing 1155 nfts
    await expect(this.test1155NftCollection.connect(this.signers.deployer).setApprovalForAll(dropContract.address, true)).to.emit(
      this.test1155NftCollection,
      "ApprovalForAll",
      );
      
  expect(await dropContract.airdropFunded()).to.be.equal(false);
 
  // funding of the dropContract
  await expect(dropContract.fundAirdrop()).to.emit(dropContract, "AirdropFunded").withArgs(dropContract.address);

  // airdropFunded value check
  expect(await dropContract.airdropFunded()).to.be.equal(true);

  // airdropFundBlockTimestamp value check
  const blockNumBefore = await ethers.provider.getBlockNumber();
  const blockBefore = await ethers.provider.getBlock(blockNumBefore);
  expect(await dropContract.airdropFundBlockTimestamp()).to.be.equal(blockBefore.timestamp);

  // airdropFundingHolder value check cannot be done because value is internal

  // Nft balance check of dropContract and deployer wallet
  expect(await this.test1155NftCollection.balanceOf(dropContract.address, tokenId)).to.be.equal(amountOf1155); //our airdrop contract now has 1000 x nft1155 of id 1
  expect(await this.test1155NftCollection.balanceOf(this.signers.deployer.address, tokenId)).to.be.equal(fullAmountOf1155 - amountOf1155);
  });


  // add another test for revert allowance when added in contracts
  it("should revert existing1155SCCampaign airdrop if msg.sender does not have sufficient funds", async function () {
  
        await this.airbroFactorySMCampaign.createNewNft1155Contract("ipfs://bafybeict2kq6gt4ikgulypt7h7nwj4hmfi2kevrqvnx2osibfulyy5x3hu/no-time-to-explain.jpeg")
    
        // getting the deployed Airbro1155 contract found at the 0th index in the nft1155Contracts array of AirbroFactorySMCampaign.sol
        const new1155NftCollectionFactory = await ethers.getContractFactory("Airbro1155Contract");
        const collection1155 = new1155NftCollectionFactory.attach(await this.airbroFactorySMCampaign.nft1155Contracts(constants.Zero));
    
        // minting the admin an amount of 500 1155 nft's but 1000 nft's are defined to be needed in the airdrop
        const idOf1155: string = "nftAirdrop";
        const amountOf1155: number = 1000;
        const insufficientAmountOf1155: number = amountOf1155 / 2;
        const tokenId: number = 1; // token id set to 1
        const tokensPerClaim: number = 1;
        const durationInDays: number = 1;
    
        // deployer minting 500 nfts - half of the needed amount for the airdrop
        await this.test1155NftCollection.connect(this.signers.deployer).mint(idOf1155, insufficientAmountOf1155); 
      const adminBalance1155 = await this.test1155NftCollection.balanceOf(this.signers.deployer.address, tokenId);
      expect(adminBalance1155).to.be.equal(500);

        // dropping the existing 1155 tokens to holders
        await this.airbroFactorySMCampaign
            .connect(this.signers.deployer)
            .dropExisting1155NftsToNftHolders(
              collection1155.address,
              this.test1155NftCollection.address,
              tokensPerClaim,
              tokenId,
              amountOf1155, // double the amount of 1155 nfts that was minted to deployer wallet
              durationInDays
            );
    
        // getting the deployed airdrop contract found at the 0th index in the airdrops array of AirbroFactorySMCampaign.sol
        const existingDropFactory = await ethers.getContractFactory("Existing1155NftDropSMCampaign");
        const dropContract = existingDropFactory.attach(await this.airbroFactorySMCampaign.airdrops(constants.Zero));
    
        //funding our airdrop contract with existing 1155 nfts
        await expect(this.test1155NftCollection.connect(this.signers.deployer).setApprovalForAll(dropContract.address, true)).to.emit(
          this.test1155NftCollection,
          "ApprovalForAll",
          );
       
    // await expect(dropContract.connect(this.signers.bob).fundAirdrop()).to.be.revertedWith("ERC1155: caller is not owner nor approved");
    await expect(dropContract.connect(this.signers.bob).fundAirdrop()).to.be.revertedWith("InsufficientAmount");      
        
      });

      it("should revert existing1155SCCampaign airdrop if msg.sender has already funded contract", async function () {
  
        await this.airbroFactorySMCampaign.createNewNft1155Contract("ipfs://bafybeict2kq6gt4ikgulypt7h7nwj4hmfi2kevrqvnx2osibfulyy5x3hu/no-time-to-explain.jpeg")
    
        // getting the deployed Airbro1155 contract found at the 0th index in the nft1155Contracts array of AirbroFactorySMCampaign.sol
        const new1155NftCollectionFactory = await ethers.getContractFactory("Airbro1155Contract");
        const collection1155 = new1155NftCollectionFactory.attach(await this.airbroFactorySMCampaign.nft1155Contracts(constants.Zero));
    
        // minting the admin an amount of 2000 1155 nft's
        const idOf1155: string = "nftAirdrop";
        const fullAmountOf1155: number = 2000;
        const amountOf1155: number = 1000;
        const tokenId: number = 1; // token id set to 1
        const tokensPerClaim: number = 1;
        const durationInDays: number = 1;
    
        // deployer minting 2000 nfts
        await this.test1155NftCollection.connect(this.signers.deployer).mint(idOf1155, fullAmountOf1155); 
      const adminBalance1155 = await this.test1155NftCollection.balanceOf(this.signers.deployer.address, tokenId);
      expect(adminBalance1155).to.be.equal(2000);

        // dropping the existing 1155 tokens to holders
        await this.airbroFactorySMCampaign
            .connect(this.signers.deployer)
            .dropExisting1155NftsToNftHolders(
              collection1155.address,
              this.test1155NftCollection.address,
              tokensPerClaim,
              tokenId,
              amountOf1155,
              durationInDays
            );
    
        // getting the deployed airdrop contract found at the 0th index in the airdrops array of AirbroFactorySMCampaign.sol
        const existingDropFactory = await ethers.getContractFactory("Existing1155NftDropSMCampaign");
        const dropContract = existingDropFactory.attach(await this.airbroFactorySMCampaign.airdrops(constants.Zero));
    
        //funding our airdrop contract with existing 1155 nfts
        await expect(this.test1155NftCollection.connect(this.signers.deployer).setApprovalForAll(dropContract.address, true)).to.emit(
          this.test1155NftCollection,
          "ApprovalForAll",
          );
       
        await expect(dropContract.fundAirdrop()).to.emit(dropContract, "AirdropFunded").withArgs(dropContract.address);

        await expect(dropContract.fundAirdrop()).to.be.revertedWith("AlreadyFunded");

      });


  it("should create new 1155 Collection and create drop for existing IERC1155 NFT token", async function () {
    
    // create new 1155 nft collection
    expect(
      await this.airbroFactorySMCampaign.createNewNft1155Contract(
        "ipfs://bafybeict2kq6gt4ikgulypt7h7nwj4hmfi2kevrqvnx2osibfulyy5x3hu/no-time-to-explain.jpeg",
      ),
    ).to.emit(this.airbroFactorySMCampaign, "NewNft1155Contract");

    // getting the deployed Airbro1155 contract found at the 0th index in the nft1155Contracts array of AirbroFactorySMCampaign.sol
    const new1155NftCollectionFactory = await ethers.getContractFactory("Airbro1155Contract");
    const collection1155 = new1155NftCollectionFactory.attach(await this.airbroFactorySMCampaign.nft1155Contracts(constants.Zero));

    // creating campaign (airdrop) for Nft holders of collection1155, with reward being Nfts from other 1155 collection

    // minting the admin an amount of 2000 1155 nft's
    const idOf1155: string = "nftAirdrop";
    const fullAmountOf1155: number = 2000;
    const amountOf1155: number = 1000;
    const tokenId: number = 1; // token id set to 1

    let leftoverNftAmount: number = amountOf1155;

    await this.test1155NftCollection.connect(this.signers.deployer).mint(idOf1155, fullAmountOf1155); // deployer minting 2000 nfts
    const adminBalance1155 = await this.test1155NftCollection.balanceOf(this.signers.deployer.address, tokenId);
    expect(adminBalance1155).to.be.equal(2000);

    const tokensPerClaim: number = 1;
    const durationInDays: number = 1;

    // dropping the existing 1155 tokens to holders
    await expect(
      await this.airbroFactorySMCampaign
        .connect(this.signers.deployer)
        .dropExisting1155NftsToNftHolders(
          collection1155.address,
          this.test1155NftCollection.address,
          tokensPerClaim,
          tokenId,
          amountOf1155,
          durationInDays,
        ),
    ).to.emit(this.airbroFactorySMCampaign, "NewAirdrop");

    // getting the deployed airdrop contract found at the 0th index in the airdrops array of AirbroFactorySMCampaign.sol
    const existingDropFactory = await ethers.getContractFactory("Existing1155NftDropSMCampaign");
    const dropContract = existingDropFactory.attach(await this.airbroFactorySMCampaign.airdrops(constants.Zero));

    // alice, bob and jerry minting 1155 NFTs in order to be eligible for reward later

    // All three addresses should receive a reward later for holding these NFTs as profile pics,
    // thus their addresses will be included in merkleRootHash
    await collection1155.connect(this.signers.alice).mint();
    await collection1155.connect(this.signers.bob).mint();
    await collection1155.connect(this.signers.jerry).mint();

    const aliceBalance = await collection1155.balanceOf(this.signers.alice.address, constants.Zero);
    expect(aliceBalance).to.be.equal(1);

    const bobBalance = await collection1155.balanceOf(this.signers.bob.address, constants.Zero);
    expect(bobBalance).to.be.equal(1);

    const jerryBalance = await collection1155.balanceOf(this.signers.jerry.address, constants.Zero);
    expect(jerryBalance).to.be.equal(1);

    //funding our airdrop contract with existing 1155 nfts
    await expect(this.test1155NftCollection.connect(this.signers.deployer).setApprovalForAll(dropContract.address, true)).to.emit(
        this.test1155NftCollection,
        "ApprovalForAll",
        );
        
    await expect(dropContract.fundAirdrop()).to.emit(dropContract, "AirdropFunded").withArgs(dropContract.address);
    
    //create merkleRootHash
    const whitelisted = [this.signers.alice.address, this.signers.bob.address, this.signers.jerry.address];
    const leaves = whitelisted.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leaves, keccak256, { sort: true });
    const roothash = merkleTree.getHexRoot();

    //backendWallet sets new merkleRootHash upon completion of the campaign (deadline has passed)
    expect(await dropContract.connect(this.signers.backendWallet).setMerkleRoot(roothash))
      .to.emit(dropContract, "MerkleRootChanged")
      .withArgs(roothash);

    //create Merkle Proof for alice
    const hexProof = merkleTree.getHexProof(leaves[0]);

    // alice withdrawing 1155 on basis of her address being included in the merkleRoot
    expect(await dropContract.connect(this.signers.alice).claim(hexProof))
      .to.emit(dropContract, "Claimed")
      .withArgs(this.signers.alice.address);
    leftoverNftAmount = leftoverNftAmount - tokensPerClaim;

    // alice trying to withdraw twice
    await expect(dropContract.connect(this.signers.alice).claim(hexProof)).to.be.revertedWith("AlreadyRedeemed");

    // address that is not in merkleRootHash trying to withdraw
    await expect(dropContract.connect(this.signers.lisa).claim(hexProof)).to.be.revertedWith("NotEligible");

    // airdropFunds provider withdrawing their leftover funds after the airdrop has finished
    await expect(dropContract.connect(this.signers.deployer).withdrawAirdropFunds()).to.be.revertedWith("AirdropStillInProgress");

    await ethers.provider.send("evm_increaseTime", [oneWeekInSeconds]); // add one week worth of seconds

    const balanceBeforeWithdraw = await this.test1155NftCollection.balanceOf(this.signers.deployer.address, tokenId);
    await dropContract.connect(this.signers.deployer).withdrawAirdropFunds();
    const balanceAfterWithdraw = await this.test1155NftCollection.balanceOf(this.signers.deployer.address, tokenId);

    expect(balanceAfterWithdraw.toNumber()).to.be.equal(balanceBeforeWithdraw.toNumber() + leftoverNftAmount);
  });
}
