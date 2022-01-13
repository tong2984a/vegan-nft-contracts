const contract_config = require('../contract_config.json')
const cli_config = require('../cli_config.json')
const { upgrades } = require('hardhat');
const hre = require("hardhat");

async function main () {
  let firstTokenId = cli_config['cli_3b_burn_nft']['tokens']['firstTokenId']
  let lastTokenId = cli_config['cli_3b_burn_nft']['tokens']['lastTokenId']
  console.log(`\nBurning tokenIds from:${firstTokenId} to:${lastTokenId} ...`)

  let marketContractAddress = contract_config['nftmarketaddress']
  let nftContractAddress = contract_config['nftaddress']
  const Market = await hre.ethers.getContractFactory("NFTMarket")
  const market = await Market.attach(marketContractAddress)
  const NFT = await hre.ethers.getContractFactory("NFT")
  const nft = await NFT.attach(nftContractAddress)

  let transaction
  let tx
  let event

  for (var tokenId = firstTokenId; tokenId <= lastTokenId; tokenId++) {
    await nft.burn(tokenId)
    console.log(`tokenId: ${tokenId}`)
  }

  console.log("\ncli_3b_burn_nft completed successfully.")
}

main();
