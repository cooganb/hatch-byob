require("mockdate").set(new Date(1523291999654));

const Blockchain = require("../blockchain");
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
					timestamp: 1523291999654,
				}
			];
			expect(Blockchain.blocks).toEqual(expected);
		});
	});

	describe("addBlock",() => {
		it("exports addBlock function",() => {
			expect(Blockchain.addBlock).toBeInstanceOf(Function);
		});

		it("adds a new block to blocks array",() => {
			const lengthBefore = Blockchain.blocks.length;
			Blockchain.addBlock("Awesome block");
			expect(Blockchain.blocks.length).toEqual(lengthBefore + 1);
		});

		test("newly added block contains valid prevHash (hash of the previous block)",() => {
			const prevHash = Blockchain.blocks[Blockchain.blocks.length - 1].hash;
			Blockchain.addBlock("Awesome block");
			expect(Blockchain.blocks[Blockchain.blocks.length - 1].prevHash).toEqual(prevHash);
		});

		test("newly added block contains next index",() => {
			const currentIndex = Blockchain.blocks[Blockchain.blocks.length - 1].index;
			Blockchain.addBlock("Awesome block");
			expect(Blockchain.blocks[Blockchain.blocks.length - 1].index).toEqual(currentIndex + 1);
		});

		test("newly added block contains data specified as the first argument",() => {
			Blockchain.addBlock("Awesome block");
			expect(Blockchain.blocks[Blockchain.blocks.length - 1].data).toEqual("Awesome block");
		});
	});

	describe("createBlockHash",() => {
		it("exports createBlockHash function",() => {
			expect(Blockchain.createBlockHash).toBeInstanceOf(Function);
		});

		it("calculates a hash of the block: sha256(prevHash;index;data;timestamp)",() => {
			const block = {
				prevHash: "000000",
				index: 1,
				data: "The power of a gun can kill",
				timestamp: 1523292008985,
			};
			expect(Blockchain.createBlockHash(block))
				.toEqual("362bd2ac975cfa4b34b6f726e9519872ffa250c33e7d0599ac61905134234c13");
		});
	});

	describe("print",() => {
		it("exports print function",() => {
			expect(Blockchain.print).toBeInstanceOf(Function);
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
			Blockchain.blocks = [{hash: "100000", index: 0}];
			expect(Blockchain.isValid()).toEqual(false);
		});

		it("validates that first block is the genesis block of index 0",() => {
			Blockchain.blocks = [{hash: "000000", index: 1}];
			expect(Blockchain.isValid()).toEqual(false);
		});

		it("validates that block index maches index of the array",() => {
			Blockchain.blocks = [
				...validChain.slice(0,2),
				{...validChain[2], index: 3},
				...validChain.slice(3),
			];
			expect(Blockchain.isValid()).toEqual(false);
		});

		it("validates that block prevHash maches previous block hash",() => {
			const maliciousBlock = {...validChain[2], data: 0};
			Blockchain.blocks = [
				...validChain.slice(0,2),
				{...maliciousBlock, hash: Blockchain.createBlockHash(maliciousBlock)},
				...validChain.slice(3),
			];
			expect(Blockchain.isValid()).toEqual(false);
		});

		it("validates that block data is a string",() => {
			Blockchain.blocks = [
				...validChain.slice(0,2),
				{...validChain[2], data: 0},
				...validChain.slice(3),
			];
			expect(Blockchain.isValid()).toEqual(false);
		});

		it("validates that block hash is correct",() => {
			Blockchain.blocks = [
				...validChain.slice(0, validChain.length - 1),
				{...validChain[validChain.length - 1], hash: "100000"},
			];
			expect(Blockchain.isValid()).toEqual(false);
		});
	});
});
