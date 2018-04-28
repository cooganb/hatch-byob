require("mockdate").set(new Date(1523303679438));

const TransactionPool = require("../transaction-pool");
const Transaction = require("../transaction");

describe("Transaction Pool",() => {
	let pendingCopy;
	let invalidCopy;

	const tx1 = Transaction.createTransaction("Foo");
	const tx2 = Transaction.createTransaction("Bar");
	const tx3 = Transaction.createTransaction("Baz");

	beforeEach(() => {
		pendingCopy = [...TransactionPool.pending];
		invalidCopy = [...TransactionPool.invalid];
	});
	afterEach(() => {
		TransactionPool.pending = pendingCopy;
		TransactionPool.invalid = invalidCopy;
	});

	describe("pending",() => {
		it("exports empty pending array",() => {
			expect(TransactionPool.pending).toBeInstanceOf(Array);
			expect(TransactionPool.pending.length).toEqual(0);
		});
	});

	describe("invalid",() => {
		it("exports empty invalid array",() => {
			expect(TransactionPool.invalid).toBeInstanceOf(Array);
			expect(TransactionPool.invalid.length).toEqual(0);
		});
	});

	describe("isPending",() => {
		it("exports isPending function",() => {
			expect(TransactionPool.isPending).toBeInstanceOf(Function);
		});

		it("returns a transaction from pending pool by transaction hash",() => {
			TransactionPool.pending = [tx1, tx2];
			TransactionPool.invalid = [tx3];
			expect(TransactionPool.isPending(tx1.hash)).toEqual(tx1);
			expect(TransactionPool.isPending(tx2.hash)).toEqual(tx2);
		});

		it("returns undefined if transaction not found in pending pool",() => {
			TransactionPool.pending = [tx1, tx2];
			TransactionPool.invalid = [tx3];
			expect(TransactionPool.isPending(tx3.hash)).toEqual(undefined);
		});
	});

	describe("isInvalid",() => {
		it("exports isInvalid function",() => {
			expect(TransactionPool.isInvalid).toBeInstanceOf(Function);
		});

		it("returns a transaction from invalid pool by transaction hash",() => {
			TransactionPool.pending = [tx1, tx2];
			TransactionPool.invalid = [tx3];
			expect(TransactionPool.isInvalid(tx3.hash)).toEqual(tx3);
		});

		it("returns undefined if transaction not found in invalid pool",() => {
			TransactionPool.pending = [tx1, tx2];
			TransactionPool.invalid = [tx3];
			expect(TransactionPool.isInvalid(tx1.hash)).toEqual(undefined);
			expect(TransactionPool.isInvalid(tx2.hash)).toEqual(undefined);
		});
	});

	describe("accept",() => {
		it("exports accept function",() => {
			expect(TransactionPool.accept).toBeInstanceOf(Function);
		});

		it("accepts new, valid, non-pending transaction",() => {
			expect(TransactionPool.accept(tx1)).toEqual(true);
			expect(TransactionPool.isPending(tx1.hash)).toEqual(tx1);
		});

		it("doesn't accept pending transaction",() => {
			TransactionPool.pending = [tx1];
			expect(TransactionPool.accept(tx1)).toEqual(false);
			expect(TransactionPool.isInvalid(tx1.hash)).toEqual(tx1);
		});

		it("doesn't accept invalid transaction",() => {
			expect(TransactionPool.accept({ ...tx1, data: 0 })).toEqual(false);
			expect(TransactionPool.isInvalid(tx1.hash)).toEqual({ ...tx1, data: 0 });
		});

		it.skip("doesn't accept transactions already included in the blockchain",() => {
			// FIXME: Implementing accept requires implemented Blockchain module
			//        Implementing Blockchain module requires implemented TransactionPool module
		});
	});
});
