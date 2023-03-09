const config = require('../config.json')
const game_config = require('../game_config.json')
const hre = require("hardhat")

async function main() {
  console.log("\ngame_5_withdraw starting ...")
  let winnerAddress = game_config['game_5_withdraw']['player1Address']
  let winnerAccount = await hre.ethers.getSigner(winnerAddress)
  console.log('winnerAddress: ', winnerAddress)

  let gameAddress = config['deployed']['gameAddress']
  const Game = await hre.ethers.getContractFactory("Game")
  const gameContract = await Game.attach(gameAddress)
  
  let transaction
  let tx
  let event

  transaction = await gameContract.connect(winnerAccount).withdrawRewards()
  tx = await transaction.wait()
  event = tx.events[0] //event RewardsWithdrew
  console.log("winner:", event.args['winner'])
  console.log("amount:", event.args['amount'])

  let balance = await gameContract.rewards()
  console.log("rewards balance:", balance)

  console.log("\ngame_5_withdraw completed successfully.")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
