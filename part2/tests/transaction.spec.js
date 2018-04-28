require("mockdate").set(new Date(1523303679438));

const Transaction = require("../transaction");

describe("Transaction",() => {
	describe("createTransactionHash",() => {
		it("exports createTransactionHash function",() => {
			expect(Transaction.createTransactionHash).toBeInstanceOf(Function);
		});

		it("calculates a hash of the transaction: sha256(data;timestamp)",() => {
			const transaction = {
				data: "The power of a gun can kill",
                timestamp: 1523303679438,
			};
			expect(Transaction.createTransactionHash(transaction))
				.toEqual("00ec102f3d9d954a44384d0d4a0e56d7a3d95acd8b89d395d776c2b25dc53a4e");
		});
	});

	describe("createTransaction",() => {
		it("exports createTransaction function",() => {
			expect(Transaction.createTransaction).toBeInstanceOf(Function);
		});

		test("newly added transaction contains data specified as the first argument",() => {
			const transaction = Transaction.createTransaction("The power of a gun can kill");
			expect(transaction.data).toEqual("The power of a gun can kill");
		});

		test("newly added transaction contains a timestamp",() => {
			const transaction = Transaction.createTransaction("The power of a gun can kill");
			expect(transaction.timestamp).toEqual(1523303679438);
		});

		test("newly added transaction contains a valid hash",() => {
			const transaction = Transaction.createTransaction("The power of a gun can kill");
			expect(transaction.hash)
				.toEqual("00ec102f3d9d954a44384d0d4a0e56d7a3d95acd8b89d395d776c2b25dc53a4e");
		});
	});

	describe("isValid",() => {
		it("exports isValid function",() => {
			expect(Transaction.isValid).toBeInstanceOf(Function);
		});

		it("positively validates correct transaction",() => {
			const transaction = Transaction.createTransaction("The power of a gun can kill");
			expect(Transaction.isValid(transaction)).toEqual(true);
		});

		it("validates transaction hash",() => {
			const transaction = Transaction.createTransaction("The power of a gun can kill");
			transaction.hash = "690520c5170970ba81b35dcb99ce4c6e73ca4504813fca9c7ba8e9986e215165";
			expect(Transaction.isValid(transaction)).toEqual(false);
		});	

		it("validates that data is a string",() => {
			const transaction = Transaction.createTransaction("The power of a gun can kill");
			transaction.data = 0;
			transaction.hash = "1f5fd773cbc0b657dceb9755119266731903d06e190fabc2309486db310c182b";
			expect(Transaction.isValid(transaction)).toEqual(false);
		});	

		it("validates that data is not empty",() => {
			const transaction = Transaction.createTransaction("");
			expect(Transaction.isValid(transaction)).toEqual(false);
		});
	});
});
