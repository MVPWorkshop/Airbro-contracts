import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { Fixture } from "ethereum-waffle";
import { Signer } from "ethers";

import type { AirbroFactory } from "../src/types/contracts/AirbroFactory";

declare module "mocha" {
  export interface Context {
    Airbro: AirbroFactory;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
  alice: SignerWithAddress;
  bob: SignerWithAddress;
  backendWallet: SignerWithAddress;
}
