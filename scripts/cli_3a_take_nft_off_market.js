const config = require('../config.json')
const cli_config = require('../cli_config.json')
const { upgrades } = require('hardhat');
const hre = require("hardhat");

async function main () {
  let firstItemId = cli_config['cli_3a_take_nft_off_market']['items']['firstItemId']
  let lastItemId = cli_config['cli_3a_take_nft_off_market']['items']['lastItemId']
  console.log(`\nTaking Off Market from:${firstItemId} to:${lastItemId} ...`)

  let marketContractAddress = config['deployed']['nftmarketaddress']
  let nftContractAddress = config['deployed']['nftaddress']
  const Market = await hre.ethers.getContractFactory("NFTMarket")
  const market = await Market.attach(marketContractAddress)
  const NFT = await hre.ethers.getContractFactory("NFT")
  const nft = await NFT.attach(nftContractAddress)

  for (var itemId = firstItemId; itemId <= lastItemId; itemId++) {
    transaction = await market.createMarketSale(nft.address, itemId)
    tx = await transaction.wait()
    console.log(`itemId: ${itemId}`)
  }

  console.log("\ncli_3a_take_nft_off_market completed successfully.")
}

main();
