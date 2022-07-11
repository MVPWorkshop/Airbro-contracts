import { Address } from "cluster";
import { MockContract } from "ethereum-waffle";

// change this to the backend wallet address which is hardcoded in the /airdrop SC’s
export const contractAdminAddress: string = "0xF4b5bFB92dD4E6D529476bCab28A65bb6B32EFb3";
export const randomAddress: string = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
export const oneWeekInSeconds: number = 604800;

/*  Arguments for TokenDrop fixture deployment */
export async function unitTokenDropFixtureArguments(airBroFactoryAddress: String) {
  return {
    rewardedNft: randomAddress,
    tokensPerClaim: 2,
    name: "TokenDropName",
    symbol: "TokenDropSymbol",
    airdropDuration: 1,
    airBroFactoryAddress: airBroFactoryAddress,
  };
}

export async function unitTokenDropSMCampaignFixtureArguments(airBroFactory1155Address: String) {
  return {
    rewardedNft: randomAddress,
    tokensPerClaim: 2,
    name: "TokenDropName",
    symbol: "TokenDropSymbol",
    airdropDuration: 1,
    airBroFactoryAddress: airBroFactory1155Address,
  };
}

/*  Arguments for ExistingTokenDrop and ExistingTokenDropSMCampaign fixture deployment */
export async function unitExistingTokenDropFixtureArguments(mockTokenAddress: String, mockAirBroFactory: String) {
  return {
    rewardedNft: randomAddress,
    tokensPerClaim: 2,
    rewardToken: mockTokenAddress,
    totalAirdropAmount: 2,
    airdropDuration: 1,
    airBroFactoryAddress: mockAirBroFactory,
  };
}

export async function unitExistingTokenDropSMCampaignFixtureArguments(mockTokenAddress: String, mockAirBroFactorySMCampaign: String) {
  return {
    rewardedNft: randomAddress,
    tokensPerClaim: 2,
    rewardToken: mockTokenAddress, // argument in fixture
    totalAirdropAmount: 2,
    airdropDuration: 1,
    airBroFactorySMCampaignAddress: mockAirBroFactorySMCampaign, // argument in fixture
  };
}
