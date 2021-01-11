/*
 * Miscellaneous Technical
 * Geometric Shapes
 * Number Forms -> ↂ and ↈ for DUP2 and DUP3
 * Ornamental Dingbats
 * Transport and Map Symbols 🚩
 * Supplemental Arrows-C
 * Geometric Shapes Extended
 * Alchemical Symbols 🜹
 * Miscellaneous Symbols and Pictographs 🏲 🗑
 * Enclosed Alphanumeric Supplement
 * Mende Kikakui
 * Byzantine Musical Symbols
 * Supplemental Punctuation
 * https://www.fileformat.info/info/unicode/block/miscellaneous_symbols_and_arrows/utf8test.htm
 * https://www.fileformat.info/info/unicode/block/supplemental_mathematical_operators/utf8test.htm
 * https://www.fileformat.info/info/unicode/block/miscellaneous_mathematical_symbols_b/utf8test.htm
 * https://www.fileformat.info/info/unicode/block/miscellaneous_mathematical_symbols_a/utf8test.htm
 * https://www.fileformat.info/info/unicode/block/miscellaneous_symbols/utf8test.htm
 * */

import { toRaw } from 'vue';
import isEqual from 'lodash.isequal';

export default {
    "STRT": {
        symbol: "○", // maybe ⌂
        description: "Initial position of the bird, bird starts going to the right.",
        async execute() {
        },
    },
    "FINI": {
        symbol: "◍",
        description: "Finishes this round",
        async execute(board) {
            if (board.selectedTestCase) {
                let expected = toRaw(board.selectedTestCase.finalStack || []);
                let stack = toRaw(board.stack);
                if (isEqual(expected, stack)) {
                    return await board.finish();
                } else {
                    return await board.dieBird("You did not finish with the expected result on the stack");
                }
            } else {
                return await board.finish();
            }
        },
    },
    "UPWD": {
        symbol: "▲",
        description: "Go UP",
        async execute(board) {
            board.bird.direction = "up";
        },
    },
    "DOWN": {
        symbol: "▼",
        description: "Go DOWN",
        async execute(board) {
            board.bird.direction = "down";
        },
    },
    "LEFT": {
        symbol: "◀",
        description: "Go LEFT",
        async execute(board) {
            board.bird.direction = "left";
        },
    },
    "RGHT": {
        symbol: "▶",
        description: "Go RIGHT",
        async execute(board) {
            board.bird.direction = "right";
        },
    },
    "REVR": {
        symbol: "↺",
        description: "Revert the direction of the bird",
        async execute(board) {
            let rev = {
                "up": "down",
                "left": "right",
                "right": "left",
                "down": "up",
            };
            board.bird.direction = rev[board.bird.direction];
        },
        instructionClass: "B",
    },
    "READ": {
        symbol: "⌬",
        description: "Read a number input onto the stack",
        async execute(board) {
            if (board.input.length == 0) {
                return await board.dieBird("There are no more numbers to read");
            }
            let input = toRaw(board.input.pop());
            board.stack.push(input);
        },
        instructionClass: "C",
    },
    "DUP1": {
        symbol: "ↀ",
        description: "Duplicate the last number on the stack",
        async execute(board) {
            if (board.stack.length < 1) {
                return await board.dieBird("The stack is empty, can not duplicate the last number.");
            }
            let x = board.stack.pop();
            board.stack.push(x);
            board.stack.push(x);
        },
        instructionClass: "D",
    },
    "SWAP": {
        symbol: "⎌",
        description: "Swap the top two numbers on the stack",
        async execute(board) {
            if (board.stack.length < 2) {
                return await board.dieBird("There are less than two numbers on the stack");
            }
            let x = board.stack.pop();
            let y = board.stack.pop();
            board.stack.push(x);
            board.stack.push(y);
        },
        instructionClass: "B",
    },
    "YOLO": {
        symbol: "※",
        description: "Go into a random direction",
        async execute(board) {
            const directions = ["up", "down", "left", "right"];
            board.bird.direction = directions[Math.floor(Math.random() * 4)];
        },
        instructionClass: "D",
    },
    "EMPT": {
        symbol: "⌿",
        description: "Check if the stack is empty",
        async execute(board) {
            if (board.stack.length > 0) {
                board.stack.push(0);
            } else {
                board.stack.push(1);
            }
        },
        instructionClass: "F",
    },
    "VOID": {
        symbol: "⌽",
        description: "Clear the top item on the stack",
        async execute(board) {
            if (board.stack.length < 1) {
                return await board.dieBird("The stack is empty");
            }
            board.stack.pop();
        },
        instructionClass: "F",
    },
    "CLER": {
        symbol: "⌀",
        description: "Clear the stack",
        async execute(board) {
            board.stack = [];
        },
        instructionClass: "G",
    },
    "SIZE": {
        symbol: "⍗",
        description: "Return the amount of items on the stack",
        async execute(board) {
            board.stack.push(board.stack.length);
        },
        instructionClass: "G",
    },
    "PLUS": {
        symbol: "⊕",
        description: "Add the top two numbers on the stack",
        async execute(board) {
            if (board.stack.length < 2) {
                return await board.dieBird("There are less than two numbers on the stack");
            }
            let x = board.stack.pop();
            let y = board.stack.pop();
            board.stack.push(y + x);
        },
        instructionClass: "B",
    },
    "MINU": {
        symbol: "⊖",
        description: "Subtract the top item from the stack from the number below",
        async execute(board) {
            if (board.stack.length < 2) {
                return await board.dieBird("There are less than two numbers on the stack");
            }
            let x = board.stack.pop();
            let y = board.stack.pop();
            board.stack.push(y - x);
        },
        instructionClass: "B",
    },
    "SUMA": {
        symbol: "∑",
        description: "Sum all the items on the stack",
        async execute(board) {
            let sum = 0;
            while (board.stack.length > 0) {
                sum += board.stack.pop();
            }
            board.stack.push(sum);
        },
        instructionClass: "G",
    },
    "BLCK": {
        symbol: "█",
        description: "Don't hit this block, it will kill you",
        async execute(board) {
            return await board.dieBird("You hit a wall");
        },
        instructionClass: "Z",
    },
    "GEQ1": {
        symbol: "⌥",
        description: "Go right if the number is 1 or greater, if not, go down",
        async execute(board) {
            if (board.stack.length < 1) {
                return await board.dieBird("There should be at least one number on the stack");
            }
            let x = board.stack.pop();
            if (x <= 0) {
                board.bird.direction = "down";
            } else {
                board.bird.direction = "right";
            }
        },
        instructionClass: "D",
    },
    "JMP1": {
        symbol: "⤼",
        description: "Jump over the next block",
        async execute(board) {
            if (board.bird.direction === "down") {
                board.bird.y += 1;
            } else if (board.bird.direction === "up") {
                board.bird.y -= 1;
            } else if (board.bird.direction === "left") {
                board.bird.x -= 1;
            } else if (board.bird.direction === "right") {
                board.bird.x += 1;
            }
        },
        instructionClass: "C",
    },
    "ADD1": {
        symbol: "++",
        description: "Add 1 to the first number on the stack",
        async execute(board) {
            if (board.stack.length < 1) {
                return await board.dieBird("There should be at least one number on the stack");
            }
            let x = board.stack.pop();
            x += 1;
            board.stack.push(x);
        },
        instructionClass: "C",
    },
    "SUB1": {
        symbol: "--",
        description: "Reduce the first number on the stack by one",
        async execute(board) {
            if (board.stack.length < 1) {
                return await board.dieBird("There should be at least one number on the stack");
            }
            let x = board.stack.pop();
            x -= 1;
            board.stack.push(x);
        },
        instructionClass: "C",
    },
    "INSZ": {
        symbol: "⍗",
        description: "Get the amount of items still in the input queue.",
        async execute(board) {
            board.stack.push(board.input.length);
        },
        instructionClass: "C",
    },
    "DUP2": {
        symbol: "ↂ",
        description: "Copy the last two numbers on the stack again.",
        async execute(board) {
            if (board.stack.length < 2) {
                return await board.dieBird("There are less than two numbers on the stack");
            }
            let x = board.stack.pop();
            let y = board.stack.pop();
            board.stack.push(y);
            board.stack.push(x);
            board.stack.push(y);
            board.stack.push(x);
        },
        instructionClass: "D",
    },
    "ROT1": {
        symbol: "⮃",
        description: "Swap the top two numbers in the stack.",
        async execute(board) {
            if (board.stack.length < 2) {
                return await board.dieBird("There are less than two numbers on the stack");
            }
            let x = board.stack.pop();
            let y = board.stack.pop();
            board.stack.push(x);
            board.stack.push(y);
        },
        instructionClass: "C",
    },
    "PRTI": {
        symbol: "⬯",
        description: "Teleport to the blue portal",
        async execute(board) {
            const foundPortals = board.boardObjects.filter(bo => bo.name === "PRTO");
            if (foundPortals.length > 1) {
                return await board.dieBird("Found more than one blue portal.");
            }
            if (foundPortals.length < 1) {
                return await board.dieBird("Did not find a blue portal.");
            }
            board.bird.x = foundPortals[0].x;
            board.bird.y = foundPortals[0].y;
        },
        instructionClass: "F2",
    },
    "PRTO": {
        symbol: "⬯",
        description: "Teleport to the orange portal",
        async execute(board) {
            const foundPortals = board.boardObjects.filter(bo => bo.name === "PRTI");
            if (foundPortals.length > 1) {
                return await board.dieBird("Found more than one orange portal.");
            }
            if (foundPortals.length < 1) {
                return await board.dieBird("Did not find a orange portal.");
            }
            board.bird.x = foundPortals[0].x;
            board.bird.y = foundPortals[0].y;
        },
        instructionClass: "F1",
    }
};
