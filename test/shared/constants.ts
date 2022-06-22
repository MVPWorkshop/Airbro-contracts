// change this to the backend wallet address which is hardcoded in the /airdrop SC’s
export const contractAdminAddress: string = "0xF4b5bFB92dD4E6D529476bCab28A65bb6B32EFb3";
export const randomAddress:string = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

/*  Arguments for TokenDrop fixture deployment */
export const unitTokenDropFixtureArguments = {
    rewardedNft: randomAddress,
    tokensPerClaim:2,
    name:"TokenDropName",
    symbol:"TokenDropSymbol",
    airdropDuration:1,
    // airBroFactoryAddress: // not found here, added manually in constructor in fixtures
}

/*  Arguments for ExistingTokenDrop fixture deployment */
export const unitExistingTokenDropFixtureArguments = {
    rewardedNft:randomAddress,
    tokensPerClaim:2,
    rewardToken:randomAddress,
    totalAirdropAmount:2,
    airdropDuration:1,
    // airBroFactoryAddress: // not found here, added manually in constructor in fixtures
}


