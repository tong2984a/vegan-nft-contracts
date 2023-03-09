const cli_config = require('../cli_config.json')
const { upgrades } = require('hardhat')
const hre = require("hardhat")
const fs = require('fs')
const config = require('../config.json')

async function main () {

  const Game = await hre.ethers.getContractFactory("Game")
  console.log('Deploying Game...')
  const game = await Game.deploy();
  await game.deployed();
  console.log("Game deployed to:", game.address);

  let contract_owner = config['chains'][hre.network.name]['contract_owner']['address']
  let envChain = config['chains'][hre.network.name]['chain']

  let gameAddress = game.address

  config['deployed'] = {
    gameAddress,
    envChain,
    contract_owner
  }

  fs.writeFileSync('config.json', JSON.stringify(config, null, 4))
}

main();
