//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";


//[] Manage Pool
//[] Manage Deposits
//[] Facilitate swaps (i.e. Trades)
//[] Manage Withdraws

contract AMM {

	Token public token1;
	Token public token2;

	uint256 public token1Balance;
	uint256 public token2Balance;
	uint256 public K; // Constant used for our pricing formula X*Y=K

	uint256 public totalShares;
	mapping(address => uint256) public shares;
	uint256 constant PRECISION = 10**18;

	constructor(Token _token1, Token _token2){
		token1 = _token1;
		token2 = _token2;
	}

	function addLiquidity(uint256 _token1Amount, uint256 _token2Amount)  external {
		// Deposit Tokens
		require(
			token1.transferFrom(msg.sender,  address(this), _token1Amount),
			"failed to transfer token1"
		);

		require(
			token2.transferFrom(msg.sender,  address(this), _token2Amount),
			"message"
		);

		//Issue Shares
		uint256 share;

		// If first time adding liquidity, make share 100;
		if(totalShares == 0) {
			share = 100 * PRECISION;
		} else {

		}

		// Manage Pool
		token1Balance += _token1Amount;
		token2Balance += _token2Amount;
		K = token1Balance * token2Balance;

		// Updates shares
		totalShares += share;
		shares[msg.sender]+= share;
	}

}



