import { Address } from "cluster";
import { MockContract } from "ethereum-waffle";

// change this to the backend wallet address which is hardcoded in the /airdrop SC’s
export const contractAdminAddress: string = "0xF4b5bFB92dD4E6D529476bCab28A65bb6B32EFb3";
export const randomAddress:string = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

/*  Arguments for TokenDrop fixture deployment */
export async function unitTokenDropFixtureArguments(airBroFactoryAddress:String){
    return {
        rewardedNft: randomAddress,
        tokensPerClaim:2,
        name:"TokenDropName",
        symbol:"TokenDropSymbol",
        airdropDuration:1,
        airBroFactoryAddress: airBroFactoryAddress
    }
}

export async function unitTokenDrop1155FixtureArguments(airBroFactory1155Address:String){
    return {
        rewardedNft: randomAddress,
        tokensPerClaim:2,
        name:"TokenDropName",
        symbol:"TokenDropSymbol",
        airdropDuration:1,
        airBroFactoryAddress: airBroFactory1155Address
    }
}

/*  Arguments for ExistingTokenDrop and ExistingTokenDrop1155 fixture deployment */
export async function unitExistingTokenDropFixtureArguments(mockTokenAddress: String, mockAirBroFactory:String) {
    return {
        rewardedNft:randomAddress,
        tokensPerClaim:2,
        rewardToken: mockTokenAddress,
        totalAirdropAmount:2,
        airdropDuration:1,
        airBroFactoryAddress: mockAirBroFactory
    }
}


export async function unitExistingTokenDrop1155FixtureArguments(mockTokenAddress: String, mockAirBroFactory1155Holder:String){
    return {
        rewardedNft:randomAddress,
        tokensPerClaim:2,
        rewardToken: mockTokenAddress, // argument in fixture
        totalAirdropAmount:2,
        airdropDuration:1,
        airBroFactory1155HolderAddress: mockAirBroFactory1155Holder // argument in fixture
    }
}