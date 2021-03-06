const config = require('../config.json')
const cli_config = require('../cli_config.json')
const { upgrades } = require('hardhat');
const hre = require("hardhat");

async function main() {
  let count = cli_config['cli_1a_create_nft']['count']
  console.log(`\nCreating count:${count} ...`)

  let marketContractAddress = config['deployed']['nftmarketaddress']
  let nftContractAddress = config['deployed']['nftaddress']
  const Market = await hre.ethers.getContractFactory("NFTMarket")
  const market = await Market.attach(marketContractAddress)
  const NFT = await hre.ethers.getContractFactory("NFT")
  const nft = await NFT.attach(nftContractAddress)

  const tokenURIHash = config['token']['tokenURI.json']['hash']
  const tokenDetails = {
    content: {
      membership: 'Lorem Ipsum',
    },
    date: Math.floor((Date.now() -  (3600 * 1000 * 24)) / 1000)
  }

  let tokenId
  let transaction
  let tx
  let event
  for (let i = 0; i < count; i++) {
    transaction = await nft.createToken(
      tokenURIHash,
      tokenDetails.content,
      tokenDetails.date,
    )
    tx = await transaction.wait()
    event = tx.events[0]
    tokenId = event.args['tokenId'].toNumber()
    console.log(`New tokenId: ${tokenId}`)
  }

  console.log("\ncli_1a_create_nft completed successfully.")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
