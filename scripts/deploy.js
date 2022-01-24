const cli_config = require('../cli_config.json')
const { upgrades } = require('hardhat')
const hre = require("hardhat")
const fs = require('fs')
const config = require('../config.json')

async function main () {
  let accounts = await ethers.getSigners()
  let owner = accounts[0]
  let beneficiary = accounts[2]
  let duration = cli_config['deploy']['auction']['duration_in_seconds'] //unit in sec

  const Auction = await hre.ethers.getContractFactory("Auction")
  console.log('Deploying Auction...')
  const auction = await upgrades.deployProxy(Auction, [duration, beneficiary.address])
  await auction.deployed()
  console.log("auction deployed to:", auction.address)

  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket")
  const nftMarket = await upgrades.deployProxy(NFTMarket)
  await nftMarket.deployed()
  console.log("nftMarket deployed to:", nftMarket.address)

  let symbol = config['token']['symbol']
  let name = config['token']['name']
  let contractURIHash = config['token']['contractURI.json']['hash']

  const NFT = await hre.ethers.getContractFactory("NFT")
  const nft = await upgrades.deployProxy(NFT, [nftMarket.address, name, symbol])
  await nft.deployed()
  await nft.setContractURIHash(contractURIHash)
  await nft.addMinter(owner.address)
  await nft.setApprovalForAll(auction.address, true);
  console.log("nft deployed to:", nft.address)

  let contract_owner = config['chains'][hre.network.name]['contract_owner']['address']
  let envChain = config['chains'][hre.network.name]['chain']

  let nftmarketaddress = nftMarket.address
  let nftaddress = nft.address
  let auctionAddress = auction.address

  config['deployed'] = {
    nftmarketaddress,
    nftaddress,
    auctionAddress,
    envChain,
    contract_owner
  }

  fs.writeFileSync('config.json', JSON.stringify(config, null, 4))
}

main();
