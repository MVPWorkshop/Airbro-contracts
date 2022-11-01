# AirBro - NFT Airdrop tool

## Frontend

You can find the frontend repo here: https://github.com/MVPWorkshop/Airbro-interfaces

## Backend

You can find the backend repo here: https://github.com/MVPWorkshop/Airbro-engine

### Pre Requisites

Before running any command, you need to create a `.env` file and set a BIP-39 compatible mnemonic as an environment
variable. Follow the example in `.env.example`. If you don't already have a mnemonic, use this [website](https://iancoleman.io/bip39/) to generate one.

Then, proceed with installing dependencies:

```sh
yarn install
```

### Compile

Compile the smart contracts with Hardhat:

```sh
$ yarn compile
```

### TypeChain

Compile the smart contracts and generate TypeChain artifacts:

```sh
$ yarn typechain
```

### Lint Solidity

Lint the Solidity code:

```sh
$ yarn lint:sol
```

### Lint TypeScript

Lint the TypeScript code:

```sh
$ yarn lint:ts
```

### Test

Run the Mocha tests:

```sh
$ yarn test
```

### Coverage

Generate the code coverage report:

```sh
$ yarn coverage
```

### Report Gas

See the gas usage per unit test and average gas per method call:

```sh
$ REPORT_GAS=true yarn test
```

### Clean

Delete the smart contract artifacts, the coverage reports and the Hardhat cache:

```sh
$ yarn clean
```

### Deploy

### Important note

- Before deploying the smart contracts, make sure to update the hardcoded `admin` variable in each smart contract in the `./contracts/airdrops` folder. The variable should be set to a valid backend wallet address.

- For testing, make sure the variable `contractAdminAddress` (found in `./tests/shared/constants.ts`) is the same as the previously mentioned smart contract `admin` variable.

Deploy the contracts to Hardhat Network:

```sh
$ yarn deploy --greeting "Bonjour, le monde!"
```

## Upgrading contracts

Upgradable contracts

- contracts/AirdropCampaignData.sol

To upgrade, change the code of the contract, and then runn the following code:

```sh
$ yarn upgrade:AidropCampaignData --address [address_of_deployed_contract_here]
```

### Latest verified polygon mumbai testnet deployment

https://mumbai.polygonscan.com/address/0x1Cf717072285dC1CE9DBcED31d51e4Ad5dE6fB7f#code

## Syntax Highlighting

If you use VSCode, you can enjoy syntax highlighting for your Solidity code via the
[vscode-solidity](https://github.com/juanfranblanco/vscode-solidity) extension. The recommended approach to set the
compiler version is to add the following fields to your VSCode user settings:

```json
{
  "solidity.compileUsingRemoteVersion": "v0.8.4+commit.c7e474f2",
  "solidity.defaultCompiler": "remote"
}
```

Where of course `v0.8.4+commit.c7e474f2` can be replaced with any other version.
