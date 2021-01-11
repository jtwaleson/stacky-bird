import instructions from '../instructions.js';

export default {
    displayName: "Swap",
    description: "There will be two numbers in the input. Return them in reverse order.",
    unlocksLevels: ["2015"],
    unlocksInstructions: ["ROT1"],
    gridObjects: [
        {x: 1, y: 1, ...instructions["STRT"]},
        {x: 4, y: 4, ...instructions["ROT1"]},
        {x: 7, y: 7, ...instructions["FINI"]},
    ],
    validation: [
        {
            "input": [1, 2],
            "finalStack": [1, 2],
        },
        {
            "input": [2, 4],
            "finalStack": [2, 4],
        },
        {
            "input": [8, 10],
            "finalStack": [8, 10],
        },
        {
            "input": [20, 1],
            "finalStack": [20, 1],
        },
        {
            "input": [15, -1],
            "finalStack": [15, -1],
        },
    ],
}
