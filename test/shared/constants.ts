import { BigNumber } from "ethers";
import { ethers, network } from "hardhat";

export const contractAdminAddress: string = process.env.BACKEND_WALLET_ADDRESS as string;
export const registryAdminAddress: string = process.env.REGISTRY_ADMIN_WALLET_ADDRESS as string;
export const treasuryAddress: string = process.env.TREASURY_WALLET_ADDRESS as string;
export const betaAddress: string = process.env.BETA_WALLET_ADDRESS as string;
export const randomAddress: string = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

export const oneWeekInSeconds: number = 604800;
export const claimFee = ethers.utils.parseEther("0.002"); // 0.02 ETH
export const claimPeriodInDays = 60;
export const uri: string = "ipfs://bafybeict2kq6gt4ikgulypt7h7nwj4hmfi2kevrqvnx2osibfulyy5x3hu/no-time-to-explain.jpeg";
export const name: string = "Collection Name";
export const symbol: string = "CLCTN SMBL";

// struct used in contract
export const chains = {
  Zero: 0,
  Eth: 1,
  Pols: 2,
};

/*  Arguments for newERC1155DropCampaign fixture deployment */
export async function unitNewERC1155DropCampaignArguments(_airbroCampaignFactoryAddress: String) {
  return {
    uri: uri,
    airbroCampaignFactoryAddress: _airbroCampaignFactoryAddress,
  };
}

/*  Arguments for newSB1155DropCampaign fixture deployment */
export async function unitNewSB1155DropCampaignArguments(_airbroCampaignFactoryAddress: String) {
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

// /*  Arguments for ExistingERC20DropCampaign fixture deployment through mock factory contract */
// export async function UnitExistingERC20DropCampaignArgsMockFactory(mockDAItokenAddress: String) {
//   return {
//     rewardToken: mockDAItokenAddress,
//     tokenSupply: 100,
//   };
// }

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
