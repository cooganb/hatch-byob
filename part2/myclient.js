"use strict";

var fetch = require("node-fetch");

var Transaction = require("./transaction.js");
var MyREPL = require("./repl.js");

var listener = MyREPL.start();

listener.on("add",async function onAdd(text = ""){
	var tr = Transaction.createTransaction(text);

	var res = await fetch("http://localhost:8080/transaction/send",{
		method: "POST",
		body: JSON.stringify(tr),
	});

	if (res.status === 200) {
		var respMsg = await res.json();

		if (respMsg.status == "OK") {
			return tr.hash;
		}
	}

	throw "Transaction failed to be sent.";
});

listener.on("check",async function onSave(transactionHash){
	var res = await fetch(`http://localhost:8080/transaction/${transactionHash}`,{
		method: "GET",
	});

	if (res.status === 200) {
		var respMsg = await res.json();

		if (respMsg.status) {
			return respMsg.status;
		}
	}

	throw "Transaction check failed.";
});
