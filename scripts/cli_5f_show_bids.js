const config = require('../config.json')
const cli_config = require('../cli_config.json')
const { upgrades } = require('hardhat')
const hre = require("hardhat")

async function main() {
  let days = cli_config['cli_5f_show_bids']['days']
  let auctionAddress = config['deployed']['auctionAddress']
  const Auction = await hre.ethers.getContractFactory("Auction")
  const auctionContract = await Auction.attach(auctionAddress)
  const BLOCKS_PER_DAY = 6_500
  const bidFilter = auctionContract.filters.HighestBidIncreased(null, null);

  let event
  console.log("\nShowing bid history ...")

  // Fetch the previous 24hours of  bids
  const previousBids = await auctionContract.queryFilter(bidFilter, 0 - (days * BLOCKS_PER_DAY));
  for (let event of previousBids) {
    if (event.args === undefined) return;
    console.log("sender", event.args[0])
    console.log("value", event.args[1].toNumber())
    const timestamp = (await event.getBlock()).timestamp;
    console.log("timestamp", timestamp)
    const transactionHash = event.transactionHash;
    console.log("transactionHash", transactionHash)
  }

  console.log("\ncli_5f_show_bids completed successfully.")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
