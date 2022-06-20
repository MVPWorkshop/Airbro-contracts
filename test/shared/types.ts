import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { Fixture } from "ethereum-waffle";
import { Wallet } from "@ethersproject/wallet";

import type { AirbroFactory } from "../../src/types/contracts/AirbroFactory";

declare module "mocha" {
  export interface Context {
    Airbro: AirbroFactory;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  deployer: Wallet;
  alice: Wallet;
  bob: Wallet;
  backendWallet: SignerWithAddress;
}
