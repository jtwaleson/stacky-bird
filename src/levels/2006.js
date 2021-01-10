import instructions from '../instructions.js';

export default {
    displayName: "Doubling Down",
    description: "Pick up a number, copy it and finish with two numbers",
    unlocksLevels: ["2007"],
    unlocksInstructions: ["DUP1"],
    gridObjects: [
        {x: 1, y: 1, ...instructions["STRT"]},
        {x: 4, y: 4, ...instructions["DUP1"]},
        {x: 7, y: 7, ...instructions["FINI"]},
    ],
    validation: [
        {
            "input": [1],
            "finalStack": [1, 1],
        },
        {
            "input": [5],
            "finalStack": [5, 5],
        },
    ],
}
