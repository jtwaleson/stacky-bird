import instructions from '../instructions.js';

export default {
    displayName: "Slalom",
    description: "Find your way",
    unlocksLevels: ["0008"],
    unlocksInstructions: [],
    gridObjects: [
        {x: 1, y: 1, ...instructions["STRT"]},

        {x: 1, y: 2, ...instructions["BLCK"]},
        {x: 2, y: 2, ...instructions["BLCK"]},
        {x: 3, y: 2, ...instructions["BLCK"]},
        {x: 4, y: 2, ...instructions["BLCK"]},
        {x: 5, y: 2, ...instructions["BLCK"]},
        {x: 6, y: 2, ...instructions["BLCK"]},

        {x: 2, y: 4, ...instructions["BLCK"]},
        {x: 3, y: 4, ...instructions["BLCK"]},
        {x: 4, y: 4, ...instructions["BLCK"]},
        {x: 5, y: 4, ...instructions["BLCK"]},
        {x: 6, y: 4, ...instructions["BLCK"]},
        {x: 7, y: 4, ...instructions["BLCK"]},

        {x: 1, y: 6, ...instructions["BLCK"]},
        {x: 2, y: 6, ...instructions["BLCK"]},
        {x: 3, y: 6, ...instructions["BLCK"]},
        {x: 4, y: 6, ...instructions["BLCK"]},
        {x: 5, y: 6, ...instructions["BLCK"]},
        {x: 6, y: 6, ...instructions["BLCK"]},

        {x: 1, y: 7, ...instructions["FINI"]},
    ],
}
