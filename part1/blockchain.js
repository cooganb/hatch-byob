"use strict";

var SHA256 = require("crypto-js/sha256");

Object.assign(module.exports,{
	blocks: [ createGenesisBlock(), ],

	addBlock,
	print,
	createBlockHash,
	isValid,
});


// ******************************

function createGenesisBlock() {
	var block = createBlock(undefined,0,"genesis!");
	block.hash = "000000";
	return block;
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
	return SHA256(`${block.prevHash};${block.index};${block.data};${block.timestamp}`).toString();
}

function addBlock(data) {
	var prevHash = this.blocks[this.blocks.length - 1].hash;
	var index = this.blocks.length;

	this.blocks.push(
		createBlock(prevHash,index,data)
	);
}

function print() {
	for (let block of this.blocks) {
		console.log(JSON.stringify(block,null,4));
	}
}

function isValid() {
	if (this.blocks[0].hash !== "000000") return false;
	if (this.blocks[0].index !== 0) return false;

	var prevHash = this.blocks[0].hash;

	for (let [idx,block] of this.blocks.entries()) {
		if (idx === 0) continue;

		let checkHash = createBlockHash(block);

		if (block.index !== idx) return false;
		if (block.prevHash !== prevHash) return false;
		if (typeof block.data !== "string") return false;
		if (block.hash !== checkHash) return false;

		prevHash = block.hash;
	}

	return true;
}
