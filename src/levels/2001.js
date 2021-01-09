import instructions from '../instructions.js';

export default {
    displayName: "Pick up a number",
    description: "In this level we have to pick up some numbers and deliver them to the finish line",
    unlocksLevels: ["2002"],
    unlocksInstructions: [],
    gridObjects: [
        {x: 1, y: 3, ...instructions["STRT"]},
        {x: 4, y: 1, ...instructions["READ"]},
        {x: 7, y: 7, ...instructions["FINI"]},
    ],
    validation: [
        {
            "input": [10],
            "finalStack": [10],
        }
    ],
}
