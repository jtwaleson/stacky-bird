import instructions from '../instructions.js';

export default {
    displayName: "1 + 1 = 2",
    description: "Pick up two numbers and add them together",
    unlocksLevels: ["2005"],
    unlocksInstructions: ["READ"],
    gridObjects: [
        {x: 1, y: 4, ...instructions["STRT"]},
        {x: 4, y: 4, ...instructions["READ"]},
        {x: 5, y: 7, ...instructions["PLUS"]},
        {x: 7, y: 7, ...instructions["FINI"]},
    ],
    validation: [
        {
            "input": [1, 1],
            "finalStack": [2],
        }
    ],
}
