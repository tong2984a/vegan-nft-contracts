const config = require('../config.json')
const cli_config = require('../cli_config.json')
const { upgrades } = require('hardhat')
const hre = require("hardhat")

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

async function showProgressBar(delay) {
  for (let i = 0; i <= delay; i++) {
    const dots = ".".repeat(i)
    const left = delay - i
    const empty = " ".repeat(left)

    /* need to use  `process.stdout.write` becuase console.log print a newline character */
    /* \r clear the current line and then print the other characters making it looks like it refresh*/
    process.stdout.write(`\r[${dots}${empty}] ${i * 5}%`)
    await sleep(1000) //1 sec
  }
}

async function main() {
  let accounts = await ethers.getSigners()
  let owner = accounts[0]

  let delay = cli_config['cli_5e_end_auction']['delay_in_seconds']
  let auctionAddress = config['deployed']['auctionAddress']
  const Auction = await hre.ethers.getContractFactory("Auction")
  const auctionContract = await Auction.attach(auctionAddress)

  let transaction
  let tx
  let event
  console.log("\nAuction is ending ...")

  await showProgressBar(delay)

  transaction = await auctionContract.connect(owner).auctionEnd()
  tx = await transaction.wait()
  event = tx.events[0]
  console.log("\nauctionEnd winner:", event.args['winner'])
  console.log("\nauctionEnd amount:", event.args['amount'])

  console.log("\ncli_5e_end_auction completed successfully.")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
