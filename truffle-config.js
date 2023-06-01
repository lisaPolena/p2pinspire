const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    mumbai: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, 'https://polygon-mumbai.g.alchemy.com/v2/2qNZE4vHDxHv7f_2vcF1WrGtOa-ALKJW'),
      network_id: 80001,
      confirmations: 2, // # of confirmations to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true,    // Skip dry run before migrations? (optional for public nets)
    },
    matic: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, 'https://rpc-mainnet.maticvigil.com/v1/d1777c0c2afebbf09f57c8a40253cd4d6788f013'),
      network_id: 137,
      confirmations: 2, // # of confirmations to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true,    // Skip dry run before migrations? (optional for public nets)
    },
  },

  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/contracts/build",
  compilers: {
    solc: {
      version: "0.8.13"
    }
  }
};