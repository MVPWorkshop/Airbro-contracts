/**
 * Types for arguments used in constructor of campaign / airdrop contracts.
 * Imported into fixtureTypes.ts and constructorArgTypes.ts
 * */
export type newERC1155DropCampaignArgsType = {
  uri: string;
  airbroCampaignFactoryAddress: string;
};

export type newSB1155DropCampaignArgsType = {
  uri: string;
  airbroCampaignFactoryAddress: string;
};

export type existingERC20DropCampaignArgsType = {
  rewardToken: string;
  tokenSupply: number;
  airbroCampaignFactoryAddress: string;
};

export type unitTokenDropCampaignArgsType = {
  rewardedNft: string;
  tokensPerClaim: number;
  name: string;
  symbol: string;
  airdropDuration: number;
};

export type unitTokenDropSMCampaignCampaignArgsType = {
  rewardedNft: string;
  tokensPerClaim: number;
  name: string;
  symbol: string;
  airdropDuration: number;
  airBroFactoryAddress: string;
};

export type existingTokenDropConstructorArgsType = {
  rewardedNft: string;
  tokensPerClaim: number;
  rewardToken: string;
  totalAirdropAmount: number;
  airdropDuration: number;
};

export type unitExistingTokenDropSMCampaignFixtureArgsType = {
  rewardedNft: string;
  tokensPerClaim: number;
  rewardToken: string;
  totalAirdropAmount: number;
  airdropDuration: number;
  airBroFactorySMCampaignAddress: string;
};

export type existing1155NFTDropConstructorArgsType = {
  rewardedNft: string;
  reward1155Nft: string;
  tokensPerClaim: number;
  tokenId: number;
  totalAirdropAmount: number;
  airdropDuration: number;
};
