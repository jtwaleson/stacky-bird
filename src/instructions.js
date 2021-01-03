/*
 * Miscellaneous Technical
 * Geometric Shapes
 * Number Forms -> ↂ and ↈ for DUP2 and DUP3
 * */


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
            board.finish();
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
    },
    "READ": {
        symbol: "⌬",
        description: "Read a number input onto the stack",
        execute(board) {
            board.stack.push(Math.floor(Math.random() * 10));
        },
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
    },
    "YOLO": {
        symbol: "※",
        description: "Go into a random direction",
        execute(board) {
            const directions = ["up", "down", "left", "right"];
            board.bird.direction = directions[Math.floor(Math.random() * 4)];
        },
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
    },
    "CLER": {
        symbol: "⌀",
        description: "Clear the stack",
        execute(board) {
            board.stack = [];
        },
    },
    "SIZE": {
        symbol: "⍗",
        description: "Return the amount of items on the stack",
        execute(board) {
            board.stack.push(board.stack.length);
        },
    },
};
