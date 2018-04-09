"use strict";

var SHA256 = require("crypto-js/sha256");
var Transaction = require("./transaction.js");

Object.assign(module.exports,{
	blocks: [ createGenesisBlock(), ],

	addBlock,
	isValid,
	containsTransaction,
});


// ******************************

function createGenesisBlock() {
	return {
		hash: "000000",
		index: 0,
		data: "genesis!",
		timestamp: Date.now(),
	};
}

function createBlock(prevHash,index,data) {
	var block = {
		prevHash,
		index,
		data,
		timestamp: Date.now(),
	};

	block.hash = createBlockHash(block);

	return block;
}

function createBlockHash(block) {
	return SHA256(`${block.prevHash};${block.index};${JSON.stringify(block.data)};${block.timestamp}`).toString();
}

function addBlock(data) {
	var prevHash = this.blocks[this.blocks.length - 1].hash;
	var index = this.blocks.length;

	var block = createBlock(prevHash,index,data);

	if (blockIsValid(block)) {
		this.blocks.push(
			createBlock(prevHash,index,data)
		);

		return this.blocks[this.blocks.length - 1];
	}

	return false;
}

function blockIsValid(block) {
	var checkHash = createBlockHash(block);

	if (!Array.isArray(block.data)) return false;
	if (block.hash !== checkHash) return false;
	for (let transaction of block.data) {
		if (!Transaction.isValid(transaction)) return false;
	}

	return true;
}

function isValid() {
	if (this.blocks[0].hash !== "000000") return false;
	if (this.blocks[0].index !== 0) return false;

	var prevHash = this.blocks[0].hash;

	for (let [idx,block] of this.blocks.entries()) {
		if (idx === 0) continue;

		if (!blockIsValid(block)) return false;
		if (block.index !== idx) return false;
		if (block.prevHash !== prevHash) return false;

		prevHash = block.hash;
	}

	return true;
}

function containsTransaction(transactionHash) {
	var block = this.blocks.find(function matchBlock(block){
		return blockContainsTransaction(block,transactionHash);
	});

	return block != null ? block.hash : false;
}

function blockContainsTransaction(block,transactionHash) {
	if (Array.isArray(block.data)) {
		let tr = block.data.find(function matchTransaction(tr){
			return tr.hash === transactionHash;
		});

		return tr != null;
	}

	return false;
}
