require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');
require('@openzeppelin/hardhat-upgrades');
// hardhat.config.ts

const fs = require('fs');
const privateKey = fs.readFileSync(".secret").toString().trim() || "01234567890123456789";
const infuraId = fs.readFileSync(".infuraid").toString().trim() || "";
//const ALCHEMY_API_KEY = fs.readFileSync(".alchemy").toString().trim() || "";

module.exports = {
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {
      chainId: 1337
    },
  /*
    mainnet: {
      url: `https://rinkeby.infura.io/v3/${infuraId}`, // or any other JSON-RPC provider
      accounts: [privateKey]
    },
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [privateKey]
    },
    */
    goerli: {
      url: `https://goerli.infura.io/v3/${infuraId}`, //Infura url with projectId
      accounts: [privateKey], // add the account that will deploy the contract (private key)     
    },
    rinkeby: {
     url: `https://rinkeby.infura.io/v3/${infuraId}`, //Infura url with projectId
     accounts: [privateKey] // add the account that will deploy the contract (private key)
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      //url: `https://polygon-mumbai.infura.io/v3/${infuraId}`,
      accounts: [privateKey]
    },
    matic: {
      url: "https://rpc-mainnet.maticvigil.com",
      accounts: [privateKey]
    }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
