# Build Your Own Blockchain (BYOB) - PART 2

Extend your blockchain to support the text messages being added as individual transactions, and grouping transactions into blocks. Also, your blockchain should validate transactions before adding them. Make sure the tests pass.

You are provided `myserver.js`, which is a simple HTTP server that runs on `http://localhost:8080`. Hook up your blockchain to this server, and set up routes for a `POST` command that adds data to your blockchain, as well as a `GET` command which queries for the status of a specific transaction.

Finally, edit `myclient.js` REPL program to issue HTTP requests to your running blockchain server.


## Details

The provided HTTP server program `myserver.js` accepts an optional command-line parameter: `--load={FILE}`, which specifies a JSON file `{FILE}` to load a blockchain from. It automatically writes the blockchain contents to a file called "mychain.json" every time a block is added.

The provided REPL program `myclient.js` expects input from the keyboard in the format: `.command other data`. The leading `.` identifies a command. Supported commands:

* `.help`: Print the help

* `.q`: Quit the program (also: Ctrl+C twice)

* `.add {text}`: Send a transaction with the text to the blockchain server

* `.check {transaction-hash}`: check a transaction's status


## Tasks

Starting with the blockchain implementation from Part 1, modify the blockchain so that the `data` field is an array of transaction objects instead of a single string. A block should be verified (`blockIsValid(..)`) including verifying all the transactions listed in the `data` array, before being added.

Also, the blockchain should have a `containsTransaction(..)` function that takes a transaction hash, searches all the blocks in the chain for that hash, and if found returns the hash of the block it's included in, or `false` if not found.

Fill out the implementation for `transaction.js` to support creating and validating transaction objects.

Fill out the implementation for `transaction-pool.js` to support `accept(..)`ing transactions to be added to a pending-transactions, or added to an invalid-transactions list if invalid. The pool should also provide `isPending(..)` and `isInvalid(..)` helpers that check for a transaction, by its hash, in those respective lists.

Verify that the tests all pass.

You should *not* need to edit `repl.js` for this exercise.

Put the loaded `blocks` (when using `--load=..` parameter) into the blockchain. Check for validity with `isValid()`; if invalid, quit with an error message.

Fill in the listeners in `myclient.js` to handle `add` and `check` actions, both of which need to use `fetch(..)` to make HTTP calls to the blockchain server. These handlers are `async function`s, which means you can `await` promises, but you also need to either provide output via `return` or `throw` an error. The REPL waits for these handlers to complete before resuming the input prompt loop.

Fill in the logic in the `onMessage(..)` handler in `myserver.js` to handle both the `POST` and `GET` HTTP messages. An incoming sent transaction request should be fed into the transaction pool (Hint: `accept(..)`), and if valid, a success response returned. A transaction-check should check the transaction-pool and the blockchain for a transaction, by its hash, and return an appropriate status message (`"Unknown"`, `"Pending"`, `"Invalid"`, or `"Complete: {block-hash}"`).
