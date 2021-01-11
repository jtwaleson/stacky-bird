import instructions from '../instructions.js';

export default {
    displayName: "Minus one",
    description: "Pick up a number, make it one smaller and bring it to the finish.",
    unlocksLevels: ["2010"],
    unlocksInstructions: ["SUB1"],
    gridObjects: [
        {x: 1, y: 1, ...instructions["STRT"]},
        {x: 4, y: 4, ...instructions["SUB1"]},
        {x: 7, y: 7, ...instructions["FINI"]},
    ],
    validation: [
        {
            "input": [1],
            "finalStack": [0],
        },
        {
            "input": [0],
            "finalStack": [-1],
        },
        {
            "input": [8],
            "finalStack": [7],
        },
        {
            "input": [-5],
            "finalStack": [-6],
        },
        {
            "input": [99],
            "finalStack": [98],
        },
        {
            "input": [1],
            "finalStack": [0],
        },
        {
            "input": [-10],
            "finalStack": [-11],
        },
        {
            "input": [-20],
            "finalStack": [-21],
        },
        {
            "input": [20],
            "finalStack": [19],
        },
    ],
}
