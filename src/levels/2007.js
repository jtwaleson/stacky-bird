import instructions from '../instructions.js';

export default {
    displayName: "Logic",
    description: "Pick up a number, if it is less than 1, drop it. If it's higher, bring it to the finish line.",
    unlocksLevels: ["2007"],
    unlocksInstructions: ["VOID"],
    gridObjects: [
        {x: 1, y: 1, ...instructions["STRT"]},
        {x: 3, y: 2, ...instructions["DUP1"]},
        {x: 3, y: 3, ...instructions["GEQ1"]},
        {x: 5, y: 5, ...instructions["VOID"]},
        {x: 7, y: 7, ...instructions["FINI"]},
    ],
    validation: [
        {
            "input": [1],
            "finalStack": [1],
        }
    ],
}
