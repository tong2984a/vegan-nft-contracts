const config = require('../config.json')
const cli_config = require('../cli_config.json')
const { upgrades } = require('hardhat');
const hre = require("hardhat");

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

async function showProgressBar(duration) {
  for (let i = 0; i <= 20; i++) {
    const dots = ".".repeat(i)
    const left = 20 - i
    const empty = " ".repeat(left)

    /* need to use  `process.stdout.write` becuase console.log print a newline character */
    /* \r clear the current line and then print the other characters making it looks like it refresh*/
    process.stdout.write(`\r[${dots}${empty}] ${i * 5}%`)
    await sleep(1000) //1 sec
  }
}

async function main() {
  let tokenId = cli_config['cli_5_auction']['tokenId']
  let accounts = await ethers.getSigners()
  let owner = accounts[0]
  let owner_address = [owner.address.substr(0, 4), owner.address.substr(38, 4)].join('...')
  let purchaser = accounts[1]
  let purchaser_address = [purchaser.address.substr(0, 4), purchaser.address.substr(38, 4)].join('...')
  let beneficiary = accounts[2]
  let beneficiary_address = [beneficiary.address.substr(0, 4), beneficiary.address.substr(38, 4)].join('...')
  const value1 = ethers.utils.parseUnits('1', 'ether')
  const value2 = ethers.utils.parseUnits('2', 'ether')
  const value1_in_wei = ethers.utils.formatUnits(value1, 0)
  const value2_in_wei = ethers.utils.formatUnits(value2, 0)
  console.log('wei value1: ', value1_in_wei)
  console.log('value1: ', Number(ethers.utils.formatEther( value1 )))
  console.log('wei value2: ', value2_in_wei)
  console.log('value2: ', Number(ethers.utils.formatEther( value2 )))
  console.log(`\nAuctioning tokenId:${tokenId} ...`)

  let auctionAddress = config['deployed']['auctionAddress']
  let nftContractAddress = config['deployed']['nftaddress']
  const Auction = await hre.ethers.getContractFactory("Auction")
  const auctionContract = await Auction.attach(auctionAddress)

  const BLOCKS_PER_DAY = 6_500;
  const bidFilter = auctionContract.filters.HighestBidIncreased(null, null);

  let transaction
  let tx
  let event
  let balance
  transaction = await auctionContract.connect(owner).createAuction(nftContractAddress, tokenId)
  tx = await transaction.wait()

  balance = await owner.getBalance()
  console.log(`owner: ${owner_address} balance(ETH): ${parseInt(balance) / 10**18}`)
  balance = await purchaser.getBalance()
  console.log(`purchaser: ${purchaser_address} balance(ETH): ${parseInt(balance) / 10**18}`)
  balance = await beneficiary.getBalance()
  console.log(`beneficiary: ${beneficiary_address} balance(ETH): ${parseInt(balance) / 10**18}`)

  console.log("\n")
  console.log("Bidding first time")
  transaction = await auctionContract.connect(purchaser).bid({value: value1_in_wei})
  tx = await transaction.wait()
  event = tx.events[0] //event HighestBidIncreased
  console.log("bid bidder:", event.args['bidder'])
  console.log("bid amount:", event.args['amount'])

  balance = await owner.getBalance()
  console.log(`owner: ${owner_address} balance(ETH): ${parseInt(balance) / 10**18}`)
  balance = await purchaser.getBalance()
  console.log(`purchaser: ${purchaser_address} balance(ETH): ${parseInt(balance) / 10**18}`)
  balance = await beneficiary.getBalance()
  console.log(`beneficiary: ${beneficiary_address} balance(ETH): ${parseInt(balance) / 10**18}`)

  console.log("\n")
  console.log("Bidding 2nd time")
  transaction = await auctionContract.connect(purchaser).bid({value: value2_in_wei})
  tx = await transaction.wait()
  event = tx.events[1] //event HighestBidIncreased
  console.log("bid bidder:", event.args['bidder'])
  console.log("bid amount:", event.args['amount'])

  balance = await owner.getBalance()
  console.log(`owner: ${owner_address} balance(ETH): ${parseInt(balance) / 10**18}`)
  balance = await purchaser.getBalance()
  console.log(`purchaser: ${purchaser_address} balance(ETH): ${parseInt(balance) / 10**18}`)
  balance = await beneficiary.getBalance()
  console.log(`beneficiary: ${beneficiary_address} balance(ETH): ${parseInt(balance) / 10**18}`)

/*
  // Fetch the previous 24hours of  bids
  const previousBids = await auctionContract.queryFilter(bidFilter, 0 - BLOCKS_PER_DAY);
  for (let event of previousBids) {
    if (event.args === undefined) return;
    console.log("**** queryFilter sender", event.args[0])
    console.log("**** queryFilter value", event.args[1])
    const timestamp = (await event.getBlock()).timestamp;
    console.log("**** queryFilter timestamp", timestamp)
    const transactionHash = event.transactionHash;
    console.log("**** queryFilter transactionHash", transactionHash)
    //processBidFilter(...(event.args), event);
  }
*/
/*
  console.log("\n")
  balance = await auctionContract.payments(purchaser.address)
  console.log(`purchaser has refund`, balance)
  await auctionContract.withdrawPayments(purchaser.address)
  //  bool = await auctionContract.connect(purchaser).callStatic.withdraw()

  balance = await owner.getBalance()
  console.log(`owner: ${owner_address} balance(ETH): ${parseInt(balance) / 10**18}`)
  balance = await purchaser.getBalance()
  console.log(`purchaser: ${purchaser_address} balance(ETH): ${parseInt(balance) / 10**18}`)
  balance = await beneficiary.getBalance()
  console.log(`beneficiary: ${beneficiary_address} balance(ETH): ${parseInt(balance) / 10**18}`)

  await showProgressBar(1)

  console.log("\n")
  transaction = await auctionContract.connect(owner).auctionEnd()
  tx = await transaction.wait()
  event = tx.events[0]
  console.log("auctionEnd winner:", event.args['winner'])
  console.log("auctionEnd amount:", event.args['amount'])

  balance = await owner.getBalance()
  console.log(`owner: ${owner_address} balance(ETH): ${parseInt(balance) / 10**18}`)
  balance = await purchaser.getBalance()
  console.log(`purchaser: ${purchaser_address} balance(ETH): ${parseInt(balance) / 10**18}`)
  balance = await beneficiary.getBalance()
  console.log(`beneficiary: ${beneficiary_address} balance(ETH): ${parseInt(balance) / 10**18}`)

  console.log("\n")
  balance = await auctionContract.payments(beneficiary.address)
  console.log(`beneficiary has refund`, balance)
  await auctionContract.withdrawPayments(beneficiary.address)

  balance = await owner.getBalance()
  console.log(`owner: ${owner_address} balance(ETH): ${parseInt(balance) / 10**18}`)
  balance = await purchaser.getBalance()
  console.log(`purchaser: ${purchaser_address} balance(ETH): ${parseInt(balance) / 10**18}`)
  balance = await beneficiary.getBalance()
  console.log(`beneficiary: ${beneficiary_address} balance(ETH): ${parseInt(balance) / 10**18}`)
*/

  console.log("\ncli_5_auction completed successfully.")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
