import instructions from '../instructions.js';

export default {
    displayName: "1 + 1 + 1 = 3",
    description: "Pick up three numbers and add them together",
    unlocksLevels: ["2006"],
    unlocksInstructions: ["PLUS"],
    gridObjects: [
        {x: 1, y: 1, ...instructions["STRT"]},
        {x: 7, y: 3, ...instructions["PLUS"]},
        {x: 7, y: 5, ...instructions["PLUS"]},
        {x: 7, y: 7, ...instructions["FINI"]},
    ],
    validation: [
        {
            "input": [1, 1, 1],
            "finalStack": [3],
        }
    ],
}
