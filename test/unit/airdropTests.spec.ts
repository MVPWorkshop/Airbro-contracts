import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const bytes32MerkleRootHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

export const airdropTests = (): void => {

// export function airdropTests(){  
   describe('existing 1155 nft drop',async function(){
        it('should have contract owner to address of deployer upon deployment',async function(){
            expect(await this.Existing1155NftDrop.owner()).to.be.equal(this.signers.deployer.address)
        })
        it('should set contract admin to a hardcoded address',async function(){
            expect(await this.Existing1155NftDrop.admin()).to.be.equal(this.signers.backendWallet.address)
        })
        it('should allow admin to change admin address',async function(){
            await expect(this.Existing1155NftDrop.connect(this.signers.backendWallet).changeAdmin(this.signers.bob.address))
            .to.emit(this.Existing1155NftDrop,"AdminChanged").withArgs(this.signers.bob.address);
            
            expect(await this.Existing1155NftDrop.admin()).to.equal(this.signers.bob.address)
        }) 
        it('should revert admin change from non admin account',async function(){
            const nonOwnerAccount:SignerWithAddress = this.signers.alice;
            await expect(this.Existing1155NftDrop.connect(nonOwnerAccount).changeAdmin(this.signers.bob.address)).to.be.revertedWith('NotAdmin')
        })

        it('should allow admin to set merkleRoot',async function(){            
            await expect(this.Existing1155NftDrop.connect(this.signers.backendWallet).setMerkleRoot(bytes32MerkleRootHash))
            .to.emit(this.Existing1155NftDrop, "MerkleRootChanged").withArgs(bytes32MerkleRootHash);
    
        }) 
        it('should revert merkleRoot change from non admin account',async function(){
            const nonOwnerAccount:SignerWithAddress = this.signers.alice;
            await expect(this.Existing1155NftDrop.connect(nonOwnerAccount).setMerkleRoot(bytes32MerkleRootHash)).to.be.revertedWith('NotAdmin')
        })
   })
    
    
    describe('existing token drop',async function(){
        it('should have contract owner to address of deployer upon deployment',async function(){
            expect(await this.ExistingTokenDrop.owner()).to.be.equal(this.signers.deployer.address)
        })
        it('should set contract admin to a hardcoded address',async function(){
            expect(await this.ExistingTokenDrop.admin()).to.be.equal(this.signers.backendWallet.address)
        })
        it('should allow admin to change admin address',async function(){
            await expect(this.ExistingTokenDrop.connect(this.signers.backendWallet).changeAdmin(this.signers.bob.address))
            .to.emit(this.ExistingTokenDrop,"AdminChanged").withArgs(this.signers.bob.address);
    
            expect(await this.ExistingTokenDrop.admin()).to.equal(this.signers.bob.address)
        }) 
        it('should revert admin change from non admin account',async function(){
            const nonOwnerAccount:SignerWithAddress = this.signers.alice;
            await expect(this.ExistingTokenDrop.connect(nonOwnerAccount).changeAdmin(this.signers.bob.address)).to.be.revertedWith('NotAdmin')
        })

        it('should allow admin to set merkleRoot',async function(){            
            await expect(this.ExistingTokenDrop.connect(this.signers.backendWallet).setMerkleRoot(bytes32MerkleRootHash))
            .to.emit(this.ExistingTokenDrop, "MerkleRootChanged").withArgs(bytes32MerkleRootHash);
    
        }) 
        it('should revert merkleRoot change from non admin account',async function(){
            const nonOwnerAccount:SignerWithAddress = this.signers.alice;
            await expect(this.ExistingTokenDrop.connect(nonOwnerAccount).setMerkleRoot(bytes32MerkleRootHash)).to.be.revertedWith('NotAdmin')
        })
    })
    

    describe('item nft drop',async function(){
        it('should have contract owner to address of deployer upon deployment',async function(){
            expect(await this.ItemNFTDrop.owner()).to.be.equal(this.signers.deployer.address)
        })
        it('should set contract admin to a hardcoded address',async function(){
            expect(await this.ItemNFTDrop.admin()).to.be.equal(this.signers.backendWallet.address)
        })
        it('should allow admin to change admin address',async function(){
            await expect(this.ItemNFTDrop.connect(this.signers.backendWallet).changeAdmin(this.signers.bob.address))
            .to.emit(this.ItemNFTDrop,"AdminChanged").withArgs(this.signers.bob.address);
    
            expect(await this.ItemNFTDrop.admin()).to.equal(this.signers.bob.address)
        }) 
        it('should revert admin change from non admin account',async function(){
            const nonOwnerAccount:SignerWithAddress = this.signers.alice;
            await expect(this.ItemNFTDrop.connect(nonOwnerAccount).changeAdmin(this.signers.bob.address)).to.be.revertedWith('NotAdmin')
        })

        it('should allow admin to set merkleRoot',async function(){            
            await expect(this.ItemNFTDrop.connect(this.signers.backendWallet).setMerkleRoot(bytes32MerkleRootHash))
            .to.emit(this.ItemNFTDrop, "MerkleRootChanged").withArgs(bytes32MerkleRootHash);
    
        }) 
        it('should revert merkleRoot change from non admin account',async function(){
            const nonOwnerAccount:SignerWithAddress = this.signers.alice;
            await expect(this.ItemNFTDrop.connect(nonOwnerAccount).setMerkleRoot(bytes32MerkleRootHash)).to.be.revertedWith('NotAdmin')
        })
    })
    

    describe('nft drop',async function(){
        it('should have contract owner to address of deployer upon deployment',async function(){
            expect(await this.NFTDrop.owner()).to.be.equal(this.signers.deployer.address)
        })
        it('should set contract admin to a hardcoded address',async function(){
            expect(await this.NFTDrop.admin()).to.be.equal(this.signers.backendWallet.address)
        })
        it('should allow admin to change admin address',async function(){
            await expect(this.NFTDrop.connect(this.signers.backendWallet).changeAdmin(this.signers.bob.address))
            .to.emit(this.NFTDrop,"AdminChanged").withArgs(this.signers.bob.address);
    
            expect(await this.NFTDrop.admin()).to.equal(this.signers.bob.address)
        }) 
        it('should revert admin change from non admin account',async function(){
            const nonOwnerAccount:SignerWithAddress = this.signers.alice;
            await expect(this.NFTDrop.connect(nonOwnerAccount).changeAdmin(this.signers.bob.address)).to.be.revertedWith('NotAdmin')
        })

        it('should allow admin to set merkleRoot',async function(){            
            await expect(this.NFTDrop.connect(this.signers.backendWallet).setMerkleRoot(bytes32MerkleRootHash))
            .to.emit(this.NFTDrop, "MerkleRootChanged").withArgs(bytes32MerkleRootHash);
    
        }) 
        it('should revert merkleRoot change from non admin account',async function(){
            const nonOwnerAccount:SignerWithAddress = this.signers.alice;
            await expect(this.NFTDrop.connect(nonOwnerAccount).setMerkleRoot(bytes32MerkleRootHash)).to.be.revertedWith('NotAdmin')
        })
    })
    
    
    describe('token drop',async function(){
        it('should have contract owner to address of deployer upon deployment',async function(){
            expect(await this.TokenDrop.owner()).to.be.equal(this.signers.deployer.address)
        })
        it('should set contract admin to a hardcoded address',async function(){
            expect(await this.TokenDrop.admin()).to.be.equal(this.signers.backendWallet.address)
        })
        it('should allow admin to change admin address',async function(){
            await expect(this.TokenDrop.connect(this.signers.backendWallet).changeAdmin(this.signers.bob.address))
            .to.emit(this.TokenDrop,"AdminChanged").withArgs(this.signers.bob.address);
    
            expect(await this.TokenDrop.admin()).to.equal(this.signers.bob.address)
        }) 
        it('should revert admin change from non admin account',async function(){
            const nonOwnerAccount:SignerWithAddress = this.signers.alice;
            await expect(this.TokenDrop.connect(nonOwnerAccount).changeAdmin(this.signers.bob.address)).to.be.revertedWith('NotAdmin')
        })

        it('should allow admin to set merkleRoot',async function(){            
            await expect(this.TokenDrop.connect(this.signers.backendWallet).setMerkleRoot(bytes32MerkleRootHash))
            .to.emit(this.TokenDrop, "MerkleRootChanged").withArgs(bytes32MerkleRootHash);
    
        }) 
        it('should revert merkleRoot change from non admin account',async function(){
            const nonOwnerAccount:SignerWithAddress = this.signers.alice;
            await expect(this.TokenDrop.connect(nonOwnerAccount).setMerkleRoot(bytes32MerkleRootHash)).to.be.revertedWith('NotAdmin')
        })
    })
    
}