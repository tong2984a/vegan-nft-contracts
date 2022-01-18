const contract_config = require('../config.json')
const cli_config = require('../cli_config.json')
const { upgrades } = require('hardhat');
const hre = require("hardhat");

async function main() {
  console.log(`\Checking Wallets ...`)

  let accounts = await ethers.getSigners()
  let owner = accounts[0]

  let owner_balance = await owner.getBalance()
  console.log(`wallet: ${owner.address} balance(ETH): ${parseInt(owner_balance) / 10**18}`)

  console.log("\ncli_4_check_wallets completed successfully.")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
