const shell = require("shelljs");

module.exports = {
  istanbulReporter: ["html", "lcov"],
  providerOptions: {
    mnemonic: process.env.MNEMONIC,
  },
  skipFiles: [
    "test",
    "Airbro1155Contract.sol",
    "AirbroFactorySMCampaign.sol",
    "airdrops/ItemNFTDrop.sol",
    "airdrops/NFTDrop.sol",
    "airdropsSMCampaign-old",
  ],
};
