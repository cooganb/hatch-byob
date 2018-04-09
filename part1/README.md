# Build Your Own Blockchain (BYOB) - PART 1

You first need to implement a simple blockchain data structure in `blockchain.js`. It should support adding a string of text as the data in a block, and printing the contents of the whole blockchain. Make sure the tests pass.

You are provided `mychain.js`, which is a simple REPL (read-evaluate-print-loop) style program. Edit this program to include your blockchain, and support commands that add text messages to your blockchain and dump its contents.

This program should also load a blockchain from a .json file via the `--load=..` command-line parameter, but only if all blocks loaded are valid. Finally, this program should save the blockchain to a .json file via the `.save` command.


## Details

The provided REPL program `mychain.js` accepts an optional command-line parameter: `--load={FILE}`, which specifies a JSON file `{FILE}` to load a blockchain from.

The program expects input from the keyboard in the format: `.command other data`. The leading `.` identifies a command. Supported commands:

* `.help`: Print the help

* `.q`: Quit the program (also: Ctrl+C twice)

* `.add {text}`: Add text to the blockchain

* `.print`: Print the blocks of the blockchain

* `.save {FILE}`: Save the blockchain to `{FILE}` as JSON.


## Tasks

Implement a blockchain data structure in `blockchain.js`. Required operations:

* `addBlock(data)`: specifiy a string of text to add as a new block to the blockchain

* `print()`: loop through all the blocks and print them as JSON

* `isValid()`: validate all the blocks in the chain (including the genesis block)

The blockchain should automatically add a genesis block with `"000000"` as its special hash.

Each block should include the following fields:

* `hash`: the computed hash for the block (see below)

* `prevHash`: the hash of the previous block (`undefined` for the genesis block)

* `index`: the numeric index of the block (0-based starting with the genesis block)

* `data`: a string of text

* `timestamp`: The timestamp the block was created (`Date.now()`)

Block hashes should be computed as the SHA256 hash of a string containing the block's `prevHash`, `index`, `data`, and `timestamp` fields, each separated by `;`.

Verify that the tests all pass.

Edit `repl.js` to add handlers for the `.print` and `.save` commands the same as the `.add` command is handled.

Put the loaded `blocks` (when using `--load=..` parameter) into the blockchain. Check for validity with `isValid()`; if invalid, quit with an error message.

Add listeners (via `listener.on(..)`) for the add/print/save commands, with appropriate calls to the blockchain's methods.

Saving a blockchain should `JSON.stringify(..)` the blockchain's blocks as an array.
