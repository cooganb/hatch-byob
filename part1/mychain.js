"use strict";

var path = require("path");
var fs = require("fs");
var Blockchain = require("./blockchain.js");
var MyREPL = require("./repl.js");

var args = require("minimist")(process.argv.slice(2),{
	string: [ "load" ],
});

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

var listener = MyREPL.start();

listener.on("add",function onAdd(text = ""){
	Blockchain.addBlock(text);
});

listener.on("print",function onPrint(){
	Blockchain.print();
});

listener.on("save",function onSave(file){
	file = path.resolve(file);
	fs.writeFileSync(file,JSON.stringify(Blockchain.blocks,null,4),"utf-8");
	console.log(`Blockchain saved to: ${file}`);
});
