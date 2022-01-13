const contract_config = require('../contract_config.json')
const cli_config = require('../cli_config.json')
const { upgrades } = require('hardhat');
const hre = require("hardhat");

async function main() {
  let salePrice = cli_config['cli_1b_put_nft_on_market']['price']
  let firstTokenId = cli_config['cli_1b_put_nft_on_market']['tokens']['firstTokenId']
  let lastTokenId = cli_config['cli_1b_put_nft_on_market']['tokens']['lastTokenId']
  console.log(`\nPutting on Market tokenIds from:${firstTokenId} to:${lastTokenId}, price:${salePrice} ...`)

  let marketContractAddress = contract_config['nftmarketaddress']
  let nftContractAddress = contract_config['nftaddress']
  const Market = await hre.ethers.getContractFactory("NFTMarket")
  const market = await Market.attach(marketContractAddress)
  const NFT = await hre.ethers.getContractFactory("NFT")
  const nft = await NFT.attach(nftContractAddress)

  const tokenURI = "https://ipfs.infura.io/ipfs/QmUHuUuKPXQLgbRrkEceHAYNaH7HKxMbiraGMLVUh9MnoB"
  const tokenDetails = {
    content: {
      membership: 'Lorem Ipsum',
    },
    date: Math.floor((Date.now() -  (3600 * 1000 * 24)) / 1000)
  }

  let listingPrice = await market.getListingPrice()
  salePrice = ethers.utils.parseUnits(salePrice.toString(), 'ether')

  let transaction
  let tx
  let event

  for (var tokenId = firstTokenId; tokenId <= lastTokenId; tokenId++) {
    transaction = await market.createMarketItem(nft.address, tokenId, salePrice, { value: listingPrice })
    tx = await transaction.wait()
    console.log(`New tokenId: ${tokenId}`)
  }

  console.log("\ncli_1b_put_nft_on_market completed successfully.")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
