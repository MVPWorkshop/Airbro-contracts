// const shell = require("shelljs");

module.exports = {
  istanbulReporter: ["html", "lcov"],
  providerOptions: {
    mnemonic: process.env.MNEMONIC,
  },
  skipFiles: ["test", "Airbro1155Contract.sol", "airdrops/_deprecated_airdrops", "shared/AirdropMerkleProof.sol"],
};
