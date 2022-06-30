import { expect } from "chai";
import { ethers } from "hardhat";


export function AirbroFactory1155HolderShouldAirdropExisting1155NftDrop1155(){
    const bytes32MerkleRootHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

    it('should mint and drop existing IERC1155 NFT token',async function(){

        // create new 1155 nft collection

        // minting an NFT's to alice and bob. Both addresses should receive a reward for holding this NFT collection

        // this testNftCollection needs to be 1155
        
        // create airdrop with new 1155 and existing 1155 as reward

        // getting the deployed airdrop contract found at the 0th index in the airdrops array of AirbroFactory.sol
        
        //funding our airdrop contract with existing 1155 nfts
        
        //create merkleRoot*

        // alice withdrawing 1155 on basis of her address being included in the merkleRoot
        

        // try and claim for address that is not in merkleRoot
        // try and claim after already redeeming reward
        // try and claim after airdrop has expired
        // try and claim when address is in merkleRoot

    })
}