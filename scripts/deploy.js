// scripts/deploy_upgradeable_box.js
const { upgrades } = require('hardhat')
const hre = require("hardhat")
const fs = require('fs')
const allowance_config = require('../allowance_config.json')

async function main () {
  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket")
  console.log('Deploying NFTMarket...')
  const nftMarket = await upgrades.deployProxy(NFTMarket)
  await nftMarket.deployed()
  console.log("nftMarket deployed to:", nftMarket.address)

  const NFT = await hre.ethers.getContractFactory("NFT")
  const nft = await upgrades.deployProxy(NFT, [nftMarket.address, "Pay-A-Vegan", "VEG"])
  await nft.deployed()
  console.log("nft deployed to:", nft.address)

  let accounts = await ethers.getSigners()
  let owner = accounts[0]
  await nft.addMinter(owner.address)

  let contract_owner = allowance_config[hre.network.name]['contract_owner']['address']

  let config = `
  export const nftmarketaddress = "${nftMarket.address}"
  export const nftaddress = "${nft.address}"
  export const network_name = "${hre.network.name}"
  export const contract_owner = "${contract_owner}"
  `
  let data = JSON.stringify(config)
  fs.writeFileSync('config.js', JSON.parse(data))

  let contract_config = `
  {
    "nftmarketaddress" : "${nftMarket.address}",
    "nftaddress" : "${nft.address}"
  }
  `
  let contract_data = JSON.stringify(contract_config)
  fs.writeFileSync('contract_config.json', JSON.parse(contract_data))
}

main();
