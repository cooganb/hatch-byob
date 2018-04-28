require("mockdate").set(new Date(1523291999654));

const Blockchain = require("../blockchain");
const Transaction = require("../transaction");
const validChain = require("./test-1.json");

describe("Blockchain",() => {
	let blocksCopy;

	beforeEach(() => {
		blocksCopy = [...Blockchain.blocks];
	});
	afterEach(() => {
		Blockchain.blocks = blocksCopy;
	});

	describe("blocks",() => {
		it("exports blocks array",() => {
			expect(Blockchain.blocks).toBeInstanceOf(Array);
		});

		it("contains the genesis block in the blocks array",() => {
			const expected = [
				{
					data: "genesis!",
					hash: "000000",
					index: 0,
					prevHash: undefined,
					timestamp: 1523291999654
				}
			];
			expect(Blockchain.blocks).toEqual(expected);
		});
	});

	describe("createBlockHash",() => {
		it("exports createBlockHash function",() => {
			expect(Blockchain.createBlockHash).toBeInstanceOf(Function);
		});

		it("calculates a hash of the block: sha256(prevHash;index;json(data);timestamp)",() => {
			const block = {
				prevHash: "000000",
				index: 0,
				data: [],
				timestamp: 1523292008985,
			};
			expect(Blockchain.createBlockHash(block))
				.toEqual("53cfe62dce53f2ee06dd3d0d167d6c036ee7e9e8d6562ee453b78565796463d5");
		});
	});

	describe("blockIsValid",() => {
		it("exports blockIsValid function",() => {
			expect(Blockchain.blockIsValid).toBeInstanceOf(Function);
		});

		it("positively vaidates a correct block",() => {
			expect(Blockchain.blockIsValid(validChain[1])).toEqual(true);
		});

		it("validates that data is an array",() => {
			const block = { ...validChain[1], data: 0 };
			expect(Blockchain.blockIsValid(block)).toEqual(false);
		});

		it("validates hash correctness",() => {
			const block = { ...validChain[1], hash: "000000" };
			expect(Blockchain.blockIsValid(block)).toEqual(false);
		});

		it("validates transactions correctness",() => {
			const tx = Transaction.createTransaction("");
			tx.hash = "000000";
			const block = { ...validChain[1], data: [tx] };
			block.hash = Blockchain.createBlockHash(block);
			expect(Blockchain.blockIsValid(block)).toEqual(false);
		});
	});

	describe("addBlock",() => {
		it("exports addBlock function",() => {
			expect(Blockchain.addBlock).toBeInstanceOf(Function);
		});

		it("adds a new block to blocks array",() => {
			const lengthBefore = Blockchain.blocks.length;
			Blockchain.addBlock(validChain[1].data);
			expect(Blockchain.blocks.length).toEqual(lengthBefore + 1);
		});

		test("newly added block contains valid prevHash (hash of the previous block)",() => {
			const prevHash = Blockchain.blocks[Blockchain.blocks.length - 1].hash;
			Blockchain.addBlock(validChain[1].data);
			expect(Blockchain.blocks[Blockchain.blocks.length - 1].prevHash).toEqual(prevHash);
		});

		test("newly added block contains next index",() => {
			const currentIndex = Blockchain.blocks[Blockchain.blocks.length - 1].index;
			Blockchain.addBlock(validChain[1].data);
			expect(Blockchain.blocks[Blockchain.blocks.length - 1].index).toEqual(currentIndex + 1);
		});

		test("newly added block contains data specified as the first argument",() => {
			Blockchain.addBlock(validChain[1].data);
			expect(Blockchain.blocks[Blockchain.blocks.length - 1].data)
				.toEqual(validChain[1].data);
		});

		it("returns newly added block", () => {
			const lengthBefore = Blockchain.blocks.length;
			const actual = Blockchain.addBlock(validChain[1].data);
			const newBlock = { ...validChain[1], timestamp: 1523291999654 };
			expect(actual).toEqual({ ...newBlock, hash: Blockchain.createBlockHash(newBlock) });
		});

		it("returns false when adding block failed", () => {
			expect(Blockchain.addBlock(null)).toEqual(false);
		});
	});

	describe("isValid",() => {
		it("exports isValid function",() => {
			expect(Blockchain.isValid).toBeInstanceOf(Function);
		});

		it("positively validates correct chain",() => {
			Blockchain.blocks = validChain;
			expect(Blockchain.isValid()).toEqual(true);
		});

		it("positively validates chain consisting of only the genesis block",() => {
			Blockchain.blocks = [validChain[0]];
			expect(Blockchain.isValid()).toEqual(true);
		});

		it("validates that first block is the genesis block of hash \"000000\"",() => {
			Blockchain.blocks = [{hash: "100000",index: 0}];
			expect(Blockchain.isValid()).toEqual(false);
		});

		it("validates that first block is the genesis block of index 0",() => {
			Blockchain.blocks = [{hash: "000000",index: 1}];
			expect(Blockchain.isValid()).toEqual(false);
		});

		it("validates that block index maches index of the array",() => {
			Blockchain.blocks = [
				...validChain.slice(0,2),
				{...validChain[2],index: 3},
				...validChain.slice(3),
			];
			expect(Blockchain.isValid()).toEqual(false);
		});

		it("validates that block hash is correct",() => {
			Blockchain.blocks = [
				...validChain.slice(0,validChain.length - 1),
				{...validChain[validChain.length - 1], hash: "100000"},
			];
			expect(Blockchain.isValid()).toEqual(false);
		});
	});

	describe("containsTransaction", () => {
		it("returns block hash when blockchain contains given tranaction", () => {
			Blockchain.blocks = validChain;
			const actual = Blockchain.containsTransaction(
				"d5d4e5db28820ed5098b63e398688ae34b42b206f43712af0ac640409f48150f"
			);
			const expected = "71f665be0f3e83c908284567c59d24b3529740aa08b5d86c8c95311d8c744682";
			expect(actual).toEqual(expected);
		});

		it("returns false when blockchain doesn't contain given tranaction", () => {
			Blockchain.blocks = validChain;
			const actual = Blockchain.containsTransaction(
				"d5d4e5db28820ed5098b63e398688ae34b42b206f43712af0ac640409f48150F"
			);
			const expected = false;
			expect(actual).toEqual(expected);
		});
	});
});
