const config = require('../config.json')
const cli_config = require('../cli_config.json')
const { upgrades } = require('hardhat')
const hre = require("hardhat")

async function main() {
  let accounts = await ethers.getSigners()
  let purchaser = accounts[1]

  let value = cli_config['cli_5c_overbid']['value_in_ether']
  const value_in_ether = ethers.utils.parseUnits(value.toString(), 'ether')
  const value_in_wei = ethers.utils.formatUnits(value_in_ether, 0)
  console.log('value_in_wei: ', value_in_wei)
  console.log('value_in_ether: ', Number(ethers.utils.formatEther( value_in_ether )))
  let auctionAddress = config['deployed']['auctionAddress']
  const Auction = await hre.ethers.getContractFactory("Auction")
  const auctionContract = await Auction.attach(auctionAddress)

  let transaction
  let tx
  let event
  console.log("\nOverbidding ...")

  transaction = await auctionContract.connect(purchaser).bid({value: value_in_wei})
  tx = await transaction.wait()
  event = tx.events[1] //event HighestBidIncreased
  console.log("bid bidder:", event.args['bidder'])
  console.log("bid amount:", event.args['amount'])

  console.log("\ncli_5c_overbid completed successfully.")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
