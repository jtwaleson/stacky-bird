import instructions from '../instructions.js';

export default {
    displayName: "Min",
    description: "There will be two numbers in the input. Return only the smallest number.",
    unlocksLevels: ["2017"],
    unlocksInstructions: [],
    levelTiles: [
        {x: 1, y: 1, ...instructions["STRT"]},
        {x: 7, y: 7, ...instructions["FINI"]},
    ],
    validation: [
        {
            "input": [1, 2],
            "finalStack": [1],
        },
        {
            "input": [2, 4],
            "finalStack": [2],
        },
        {
            "input": [-8, 10],
            "finalStack": [-8],
        },
        {
            "input": [20, 1],
            "finalStack": [1],
        },
        {
            "input": [15, -1],
            "finalStack": [-1],
        },
    ],
}
