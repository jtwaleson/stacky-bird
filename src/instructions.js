/*
 * Miscellaneous Technical
 * Geometric Shapes
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
        description: "Read a number input onto the stack",
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
        description: "Read a number input onto the stack",
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
};
