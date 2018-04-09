"use strict";

var path = require("path");
var fs = require("fs");
var http = require("http");

var getStream = require("get-stream");

var Blockchain = require("./blockchain.js");
var TransactionPool = require("./transaction-pool.js");

var args = require("minimist")(process.argv.slice(2),{
	string: [ "load" ],
});

const BLOCK_SIZE = 4;

if (args.load) {
	let file = path.resolve(args.load);
	let contents = fs.readFileSync(file,"utf-8");
	let blocks = JSON.parse(contents);

	Blockchain.blocks = blocks;

	if (Blockchain.isValid()) {
		console.log(`Blockchain loaded from: ${file}`);
	}
	else {
		console.log(`Blockchain invalid in: ${file}`);
		return;
	}
}

var CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Credentials": false,
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers": "Accept, Content-Type, User-Agent, X-Requested-With",
};

var JSON_HEADERS = {
	"Content-Type": "application/json",
	"Cache-Control": "max-age: 0, no-cache",
};

var httpServer = http.createServer(onMessage);

httpServer.listen(8080,"localhost");

console.log("Listening on http://localhost:8080...");


// ******************************

async function onMessage(req,res) {
	try {
		// CORS preflight?
		if (
			req.method == "OPTIONS" &&
			["GET","POST"].includes(req.headers["access-control-request-method"])
		) {
			res.writeHead(200,CORS_HEADERS);
			res.end();

			return;
		}

		var [,recordType,action] = req.url.match(/^\/([^\/]+)\/([^\/]+)/) || [];
		if (recordType && action) {
			recordType = recordType.toLowerCase();
			action = action.toLowerCase();

			if (
				req.method == "POST" &&
				recordType == "transaction" &&
				action == "send"
			) {
				let transaction = JSON.parse(await getStream(req));

				if (TransactionPool.accept(transaction)) {
					res.writeHead(200,Object.assign({},JSON_HEADERS,CORS_HEADERS));
					res.end(JSON.stringify({ status: "OK" }));

					if (TransactionPool.pending.length >= BLOCK_SIZE) {
						addNewBlock();
					}

					return;
				}
			}
			else if (
				req.method == "GET" &&
				recordType == "transaction" &&
				action !== ""
			) {
				let statusMsg = {};

				if (TransactionPool.isPending(action)) {
					statusMsg.status = "Pending";
				}
				else if (TransactionPool.isInvalid(action)) {
					statusMsg.status = "Invalid";
				}
				else {
					let blockHash = Blockchain.containsTransaction(action);

					if (blockHash) {
						statusMsg.status = `Complete: ${blockHash}`;
					}
					else {
						statusMsg.status = "Unknown";
					}
				}

				res.writeHead(200,Object.assign({},JSON_HEADERS,CORS_HEADERS));
				res.end(JSON.stringify(statusMsg));

				return;
			}
		}

		console.error("Unrecognized exchange.");
	}
	catch (err) {
		console.error(err.toString());
	}

	res.writeHead(404,CORS_HEADERS);
	res.end();
}

function addNewBlock() {
	var transactions = TransactionPool.pending.splice(0,BLOCK_SIZE);
	var block = Blockchain.addBlock(transactions);
	if (block) {
		saveBlockchain();
		console.log(`Block added: ${block.hash}`);
	}
}

function saveBlockchain() {
	fs.writeFileSync(
		path.resolve("mychain.json"),
		JSON.stringify(Blockchain.blocks,null,4),
		"utf-8"
	);
}
