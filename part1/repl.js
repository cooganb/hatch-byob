"use strict";

var repl = require("repl");
var EventEmitter = require("eventemitter2").EventEmitter2;

var replOptions = {
	prompt: "> ",
	eval: handleInput,
	useColors: false,
	writer: function output(v) { return v; },
};
var replServer;
var messages;

var MyREPL = Object.assign(module.exports,{
	start,
});


// ******************************

function start() {
	if (!replServer) {
		replServer = repl.start(replOptions);

		// override built-in Node.js REPL commands
		replServer.defineCommand("help",{ action: showHelp, });
		replServer.defineCommand("break",{ action: ignoreCommand, });
		replServer.defineCommand("clear",{ action: ignoreCommand, });
		replServer.defineCommand("editor",{ action: ignoreCommand, });
		replServer.defineCommand("exit",{ action: ignoreCommand, });
		replServer.defineCommand("load",{ action: ignoreCommand, });
		replServer.defineCommand("save",{ action: ignoreCommand, });

		// define quit command
		replServer.defineCommand("q",{ action: quit, });

		// define add, print, and save commands
		replServer.defineCommand("add",{ action: action("add"),	});
		replServer.defineCommand("print",{ action: action("print"), });
		replServer.defineCommand("save",{ action: action("save"), });

		messages = new EventEmitter({ wildcard: true, delimiter: ":", newListener: false, maxListeners: 1E6, verboseMemoryLeak: true, });
	}

	return messages;
}

function quit() {
	this.close();
}

function ignoreCommand() {
	this.displayPrompt();
}

function showHelp() {
	console.log(`${".help".padEnd(20)}Print this help message`);
	console.log(`${".add {text}".padEnd(20)}Add {text} to blockchain`);
	console.log(`${".print".padEnd(20)}Print contents of blockchain`);
	console.log(`${".save {file}".padEnd(20)}Save contents of blockchain to {file}`);
	console.log(`${".q".padEnd(20)}Quit`);
	this.displayPrompt();
}

function action(actionName) {
	return function onAction(...args){
		this.clearBufferedCommand();
		messages.emit(actionName,...args);
		this.displayPrompt();
	};
}

function handleInput(cmd) {
	cmd = cmd.replace(/^\s+/,"").replace(/\s+$/,"");

	// shortcut "quit" if you forget ".q"
	if (cmd == "q") {
		return quit.call(this);
	}

	console.log("Unrecognized command. Type .help for available commands.");

	this.displayPrompt();
}
