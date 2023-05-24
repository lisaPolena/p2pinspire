module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
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