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
        execute() {
        },
    },
    "FINI": {
        symbol: "◍",
        description: "Finishes this round",
        execute(board) {
            if (board.validation) {
                let expected = toRaw(board.validation[0].finalStack || []);
                let stack = toRaw(board.stack);
                if (isEqual(expected, stack)) {
                    return board.finish();
                } else {
                    return board.dieBird();
                }
            } else {
                board.finish();
            }
        },
    },
    "UPWD": {
        symbol: "▲",
        description: "Go UP",
        execute(board) {
            board.bird.direction = "up";
        },
    },
    "DOWN": {
        symbol: "▼",
        description: "Go DOWN",
        execute(board) {
            board.bird.direction = "down";
        },
    },
    "LEFT": {
        symbol: "◀",
        description: "Go LEFT",
        execute(board) {
            board.bird.direction = "left";
        },
    },
    "RGHT": {
        symbol: "▶",
        description: "Go RIGHT",
        execute(board) {
            board.bird.direction = "right";
        },
    },
    "REVR": {
        symbol: "↺",
        description: "Revert the direction of the bird",
        execute(board) {
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
        execute(board) {
            if (board.input.length == 0) {
                return board.dieBird();
            }
            let input = toRaw(board.input.pop());
            board.stack.push(input);
        },
        instructionClass: "C",
    },
    "DUP1": {
        symbol: "ↀ",
        description: "Duplicate the last number on the stack",
        execute(board) {
            if (board.stack.length < 1) {
                return board.dieBird();
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
        execute(board) {
            if (board.stack.length < 2) {
                return board.dieBird();
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
        execute(board) {
            const directions = ["up", "down", "left", "right"];
            board.bird.direction = directions[Math.floor(Math.random() * 4)];
        },
        instructionClass: "D",
    },
    "EMPT": {
        symbol: "⌿",
        description: "Check if the stack is empty",
        execute(board) {
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
        execute(board) {
            if (board.stack.length < 1) {
                return board.dieBird();
            }
            board.stack.pop();
        },
        instructionClass: "F",
    },
    "CLER": {
        symbol: "⌀",
        description: "Clear the stack",
        execute(board) {
            board.stack = [];
        },
        instructionClass: "G",
    },
    "SIZE": {
        symbol: "⍗",
        description: "Return the amount of items on the stack",
        execute(board) {
            board.stack.push(board.stack.length);
        },
        instructionClass: "G",
    },
    "PLUS": {
        symbol: "⊕",
        description: "Add the top two numbers on the stack",
        execute(board) {
            if (board.stack.length < 2) {
                return board.dieBird();
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
        execute(board) {
            if (board.stack.length < 2) {
                return board.dieBird();
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
        execute(board) {
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
        execute(board) {
            return board.dieBird();
        },
        instructionClass: "Z",
    },
    "GEQ1": {
        symbol: "⌥",
        description: "Go right if the number is 1 or greater, if not, go down",
        execute(board) {
            if (board.stack.length < 1) {
                return board.dieBird();
            }
            let x = board.stack.pop();
            if (x <= 0) {
                board.bird.direction = "down";
            } else {
                board.bird.direction = "right";
            }
        },
        instructionClass: "C",
    },
    "JMP1": {
        symbol: "⤼",
        description: "Jump over the next block",
        execute(board) {
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
};
