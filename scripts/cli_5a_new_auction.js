const config = require('../config.json')
const cli_config = require('../cli_config.json')
const { upgrades } = require('hardhat')
const hre = require("hardhat")

async function main() {
  let accounts = await ethers.getSigners()
  let owner = accounts[0]
  let owner_address = [owner.address.substr(0, 4), owner.address.substr(38, 4)].join('...')

  let tokenId = cli_config['cli_5a_new_auction']['tokenId']
  let auctionAddress = config['deployed']['auctionAddress']
  let nftContractAddress = config['deployed']['nftaddress']
  const Auction = await hre.ethers.getContractFactory("Auction")
  const auctionContract = await Auction.attach(auctionAddress)

  let transaction
  let tx
  let event
  console.log("\nStarting new auction ...")

  transaction = await auctionContract.connect(owner).createAuction(nftContractAddress, tokenId)
  tx = await transaction.wait()

  console.log("\ncli_5a_new_auction completed successfully.")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
