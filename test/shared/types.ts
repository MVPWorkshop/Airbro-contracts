import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { Fixture, MockContract } from "ethereum-waffle";
import { Wallet } from "@ethersproject/wallet";

import type { AirbroFactory } from "../../src/types/contracts/AirbroFactory";
import { TestNftCollection } from "../../src/types/contracts/mocks/TestNftCollection";
import { TestToken } from "../../src/types/contracts/mocks/TestToken";

declare module "mocha" {
  export interface Context {
    Airbro: AirbroFactory;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
    testNftCollection: TestNftCollection;
    testToken: TestToken;
  }
}

export interface Signers {
  deployer: Wallet;
  alice: Wallet;
  bob: Wallet;
  jerry: Wallet;
  lisa: Wallet;
  peter: Wallet;
  backendWallet: SignerWithAddress;
}

export interface Mocks {
  mockAirBroFactory: MockContract;
  mockAirBroFactorySMCampaign: MockContract; // delete later
  mockAirbroCampaignFactory: MockContract;
}
