// import { Address } from "cluster";
// import { MockContract } from "ethereum-waffle";
// import { ethers } from "hardhat";

// change this to the backend wallet address which is hardcoded in the /airdrop SC’s
export const contractAdminAddress: string = "0xF4b5bFB92dD4E6D529476bCab28A65bb6B32EFb3";
export const randomAddress: string = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
export const oneWeekInSeconds: number = 604800;
export const uri: string = "ipfs://bafybeict2kq6gt4ikgulypt7h7nwj4hmfi2kevrqvnx2osibfulyy5x3hu/no-time-to-explain.jpeg";

/*  Arguments for newERC1155DropCampaign fixture deployment */
export async function unitNewERC1155DropCampaignArguments(_airbroCampaignFactoryAddress: String) {
  return {
    uri: uri,
    airbroCampaignFactoryAddress: _airbroCampaignFactoryAddress,
  };
}

/*  Arguments for ExistingERC20DropCampaign fixture deployment */
export async function UnitExistingERC20DropCampaignArgs(mockDAItokenAddress: String, airbroCampaignFactoryAddress: String) {
  return {
    rewardToken: mockDAItokenAddress,
    tokenSupply: 100,
    airbroCampaignFactoryAddress: airbroCampaignFactoryAddress,
  };
}

/*  Arguments for TokenDrop fixture deployment */
export async function unitTokenDropFixtureArguments(mockBaycNftAddress: String) {
  return {
    rewardedNft: mockBaycNftAddress,
    tokensPerClaim: 2,
    name: "TokenDropName",
    symbol: "TokenDropSymbol",
    airdropDuration: 1,
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
export async function unitExistingTokenDropFixtureArguments(mockTokenAddress: String, mockBaycNftAddress: String) {
  return {
    rewardedNft: mockBaycNftAddress,
    tokensPerClaim: 2,
    rewardToken: mockTokenAddress,
    totalAirdropAmount: 10,
    airdropDuration: 1,
  };
}

export async function unitExistingTokenDropSMCampaignFixtureArguments(mockTokenAddress: String, mockAirBroFactorySMCampaign: String) {
  return {
    rewardedNft: randomAddress,
    tokensPerClaim: 2,
    rewardToken: mockTokenAddress,
    totalAirdropAmount: 2,
    airdropDuration: 1,
    airBroFactorySMCampaignAddress: mockAirBroFactorySMCampaign,
  };
}

/*  Arguments for Existing1155NFTDrop and Existing1155NFTDropSMCampaign fixture deployment */
export async function unitExisting1155NFTDropArguments(rewardedNftAddress: String, rewardTokenAddress: String) {
  return {
    rewardedNft: rewardedNftAddress,
    reward1155Nft: rewardTokenAddress,
    tokensPerClaim: 2,
    tokenId: 1,
    totalAirdropAmount: 2,
    airdropDuration: 2,
  };
}

// implement for Existing1155NFTDropSMCampaign
