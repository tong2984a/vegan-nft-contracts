
const contract_config = require('../contract_config.json')
const { upgrades } = require('hardhat');
const hre = require("hardhat");

async function main () {
  console.log(`\nFetching NFTs ...`)

  let marketContractAddress = contract_config['nftmarketaddress']
  let nftContractAddress = contract_config['nftaddress']
  const Market = await hre.ethers.getContractFactory("NFTMarket")
  const market = await Market.attach(marketContractAddress)
  const NFT = await hre.ethers.getContractFactory("NFT")
  const nft = await NFT.attach(nftContractAddress)

  let marketItems = await market.fetchMarketItems()
  let items = await Promise.all(marketItems.map(async i => {
    const nft = await NFT.attach(i.nftContract)
    const tokenUri = await nft.tokenURI(i.tokenId)
    let salePrice = ethers.utils.formatUnits(i.price.toString(), 'ether')
    let nftContract = [i.nftContract.substr(0, 4), i.nftContract.substr(38, 4)].join('...')

    return {
      tokenId: i.tokenId.toNumber(),
      itemId: i.itemId.toNumber(),
      symbol: 'FIRE',
      image: '/slashfire.gif',
      nftContract,
      decimals: 0,
      salePrice,
      tokenUri
    }
  }))

  for (const item of items) {
    console.log(`tokenId: ${item.tokenId} itemId: ${item.itemId} price(ETH): ${item.salePrice} nftContract: ${item.nftContract}`)
  }

  let maxSupply = await nft.MAX_SUPPLY()
  let totalSupply = await nft.totalSupply()
  console.log("Total Supply", totalSupply.toNumber())

  console.log("\ncli_2_fetch_nft completed successfully.")
}

main();
