const config = require('../config.json')
const game_config = require('../game_config.json')
const { upgrades } = require('hardhat')
const hre = require("hardhat")

async function main() {
  console.log("\ngame_4_payout starting...")

  let payByAddress = game_config['game_4_payout']['hostAddress']
  let payByAccount = await hre.ethers.getSigner(payByAddress)
  console.log('hostAddress: ', payByAddress)

  let payToAddress = game_config['game_4_payout']['player1Address']
  console.log('player1Address: ', payToAddress)

  let gameAddress = config['deployed']['gameAddress']
  const Game = await hre.ethers.getContractFactory("Game")
  const gameContract = await Game.attach(gameAddress)

  let tx
  let event

  transaction = await gameContract.connect(payByAccount).awardWinner(payToAddress)
  tx = await transaction.wait()
  event = tx.events[0] //event WinnerAwarded
  console.log("player:", event.args['winner'])
  console.log("amount:", event.args['amount'])

  let balance = await gameContract.rewards()
  console.log("rewards balance:", balance)
  
  console.log("\ngame_4_payout completed successfully.")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
