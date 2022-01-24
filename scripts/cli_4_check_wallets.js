const { upgrades } = require('hardhat');
const hre = require("hardhat");

async function main() {
  console.log(`\Checking Wallets ...`)

  let accounts = await ethers.getSigners()
  let owner = accounts[0]
  let owner_address = [owner.address.substr(0, 4), owner.address.substr(38, 4)].join('...')
  let purchaser = accounts[1]
  let purchaser_address = [purchaser.address.substr(0, 4), purchaser.address.substr(38, 4)].join('...')
  let beneficiary = accounts[2]
  let beneficiary_address = [beneficiary.address.substr(0, 4), beneficiary.address.substr(38, 4)].join('...')

  let balance

  balance = await owner.getBalance()
  console.log(`owner: ${owner_address} balance(ETH): ${parseInt(balance) / 10**18}`)
  balance = await purchaser.getBalance()
  console.log(`purchaser: ${purchaser_address} balance(ETH): ${parseInt(balance) / 10**18}`)
  balance = await beneficiary.getBalance()
  console.log(`beneficiary: ${beneficiary_address} balance(ETH): ${parseInt(balance) / 10**18}`)

  console.log("\n")

  console.log("\ncli_4_check_wallets completed successfully.")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
