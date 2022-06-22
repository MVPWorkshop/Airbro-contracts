import { expect } from "chai";
import { ethers } from "hardhat";

export function shouldChangeAdminInAllAirDrops(): void {

    const bytes32MerkleRootHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

  it("should change admin address and influence all airdrop admin address vars", async function() {
    // naming of ERC20 to be created
    const newTokenName: string = "Wakanda Coin";
    const newTokenSymbol: string = "WKND";

    // create new airdrop, along with new ERC20
    expect( await this.airbroFactory.connect(this.signers.deployer).dropNewTokensToNftHolders(
        this.testNftCollection.address, // rewardedNftCollection,
        newTokenName, // Name of new ERC20 Token
        newTokenSymbol, // Symbol of new ERC20 Token
        100, // tokensPerClaim
        30
      ),
    ).to.emit(this.airbroFactory, "NewAirdrop");

    // attaching deployed airdrop contract to this test
    const newDropFactory = await ethers.getContractFactory("TokenDrop");
    const tokenDropContract = newDropFactory.attach(await this.airbroFactory.airdrops(0));

    // checking if initial admin address is able to set MerkleRootHash
    expect(await tokenDropContract.connect(this.signers.backendWallet).setMerkleRoot(bytes32MerkleRootHash))
    .to.emit(tokenDropContract, "MerkleRootChanged").withArgs(bytes32MerkleRootHash);

    await this.airbroFactory.connect(this.signers.backendWallet).changeAdmin(this.signers.alice.address);
    expect(await this.airbroFactory.admin()).to.be.equal(this.signers.alice.address)
        .and.to.emit(this.airbroFactory,"AdminChanged").withArgs(this.signers.alice.address);

    // checking if new admin address is able to set MerkleRootHash
    expect(await tokenDropContract.connect(this.signers.alice).setMerkleRoot(bytes32MerkleRootHash))
    .to.emit(tokenDropContract, "MerkleRootChanged").withArgs(bytes32MerkleRootHash);

  });

}
