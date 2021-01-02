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
};
