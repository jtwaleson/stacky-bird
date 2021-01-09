import instructions from '../instructions.js';

export default {
    displayName: "Pick up two numbers",
    description: "Pick up two numbers and deliver them to the finish line",
    unlocksLevels: ["2004"],
    unlocksInstructions: [],
    gridObjects: [
        {x: 1, y: 4, ...instructions["STRT"]},
        {x: 4, y: 4, ...instructions["READ"]},
        {x: 7, y: 7, ...instructions["FINI"]},
    ],
    validation: [
        {
            "input": [9, 1],
            "finalStack": [1, 9],
        }
    ],
}
