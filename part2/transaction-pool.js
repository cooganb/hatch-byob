"use strict";

var Blockchain = require("./blockchain.js");
var Transaction = require("./transaction.js");

var TransactionPool = Object.assign(module.exports,{
	pending: [],
	invalid: [],

	isPending,
	isInvalid,
	accept,
});


// ******************************

function isPending(transactionHash) {
	return TransactionPool.pending.find(function findTransaction(tr){
		return tr.hash === transactionHash;
	});
}

function isInvalid(transactionHash) {
	return TransactionPool.invalid.find(function findTransaction(tr){
		return tr.hash === transactionHash;
	});
}

function accept(transaction) {
	if (
		!isPending(transaction.hash) &&
		Transaction.isValid(transaction) &&
		!Blockchain.containsTransaction(transaction.hash)
	) {
		TransactionPool.pending.push(transaction);
		return true;
	}
	else if (!isInvalid(transaction.hash)) {
		TransactionPool.invalid.push(transaction);
	}

	return false;
}
