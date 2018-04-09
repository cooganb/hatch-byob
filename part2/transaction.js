"use strict";

var SHA256 = require("crypto-js/sha256");

Object.assign(module.exports,{
	createTransaction,
	isValid,
});


// ******************************

function createTransaction(data) {
	var transaction = {
		data,
		timestamp: Date.now(),
	};

	transaction.hash = createTransactionHash(transaction);

	return transaction;
}

function createTransactionHash(transaction) {
	return SHA256(`${transaction.data};${transaction.timestamp}`).toString();
}

function isValid(transaction) {
	var checkHash = createTransactionHash(transaction);

	if (transaction.hash !== checkHash) return false;
	if (typeof transaction.data !== "string") return false;
	if (transaction.data.length === 0) return false;

	return true;
}
