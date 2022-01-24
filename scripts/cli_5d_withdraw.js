const config = require('../config.json')
const cli_config = require('../cli_config.json')
const { upgrades } = require('hardhat')
const hre = require("hardhat")

async function main() {
  let accounts = await ethers.getSigners()
  let purchaser = accounts[1]

  let auctionAddress = config['deployed']['auctionAddress']
  const Auction = await hre.ethers.getContractFactory("Auction")
  const auctionContract = await Auction.attach(auctionAddress)

  let transaction
  let tx
  let event
  let balance
  console.log("\nMaking Withdrawal ...")

  balance = await auctionContract.payments(purchaser.address)
  console.log(`purchaser has refund`, balance)
  await auctionContract.withdrawPayments(purchaser.address)

  console.log("\ncli_5d_withdraw completed successfully.")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
