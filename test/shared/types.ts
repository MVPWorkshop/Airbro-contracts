import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { Fixture, MockContract } from "ethereum-waffle";
import { Wallet } from "@ethersproject/wallet";

import type { AirbroFactory } from "../../src/types/contracts/AirbroFactory";
import type { AirbroFactory1155Holder } from "../../src/types/contracts/AirbroFactory1155Holder";
import { TestNftCollection } from "../../src/types/contracts/mocks/TestNftCollection";
import { TestToken } from "../../src/types/contracts/mocks/TestToken";

declare module "mocha" {
  export interface Context {
    Airbro: AirbroFactory;
    Airbro1155Holder: AirbroFactory1155Holder;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
    testNftCollection: TestNftCollection,
    testToken: TestToken
  }
}

export interface Signers {
  deployer: Wallet;
  alice: Wallet;
  bob: Wallet;
  backendWallet: SignerWithAddress;
}

export interface Mocks {
  mockAirBroFactory: MockContract;
  mockAirBroFactory1155Holder: MockContract;

}
