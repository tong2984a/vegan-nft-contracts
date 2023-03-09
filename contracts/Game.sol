// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract Game is ReentrancyGuard {
  address payable owner;
  uint256 listingPrice = 0.025 ether;
  uint public rewards = 0;

  constructor() {
    owner = payable(msg.sender);
  }

  // Allowed withdrawals of pending rewards
  mapping(address => uint) pendingRewards;

  // Events that will be fired on changes.
  event RewardsIncreased(address host, uint amount);
  event BetMade(address player, uint amount);
  event WinnerAwarded(address winner, uint amount);
  event RewardsWithdrew(address winner, uint amount);

  function depositRewards(
    ) public payable nonReentrant {
    rewards = msg.value;
    emit RewardsIncreased(msg.sender, msg.value);
  }

  function makeBet(
    ) public payable nonReentrant {
    require(msg.value > listingPrice, "Please submit the asking price in order to complete the purchase");
    rewards += msg.value;
    emit BetMade(msg.sender, msg.value);
  }

  function awardWinner(
    address payTo
    ) public nonReentrant {
    pendingRewards[payTo] = rewards * 4 / 5;
    owner.transfer(rewards / 5);
    rewards = 0;
    emit WinnerAwarded(payTo, pendingRewards[payTo]);
  }

  /// Withdraw a bid that was overbid.
  function withdrawRewards(
    ) external {
      uint amount = pendingRewards[msg.sender];
      // It is important to set this to zero because the recipient
      // can call this function again as part of the receiving call
      // before `send` returns.
      pendingRewards[msg.sender] = 0;

      payable(msg.sender).transfer(amount);
      emit RewardsWithdrew(msg.sender, amount);
  }
}
