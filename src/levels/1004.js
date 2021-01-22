import instructions from '../instructions.js';

export default {
    displayName: "Sit monster, sit",
    description: "Avoid the monsters",
    unlocksLevels: ["1003"],
    unlocksInstructions: [],
    gridObjects: [
        {x: 1, y: 1, ...instructions["STRT"]},
        {x: 7, y: 7, ...instructions["FINI"]},
        {x: 1, y: 5, ...instructions["RGHT"]},
        {x: 7, y: 5, ...instructions["LEFT"]},
    ],
    creeps: [
        {x: 1, y: 3, direction: "right"},
        {x: 2, y: 3, direction: "right"},
        {x: 3, y: 3, direction: "right"},
        {x: 4, y: 3, direction: "right"},
        {x: 5, y: 3, direction: "right"},
        {x: 6, y: 3, direction: "right"},
        {x: 7, y: 3, direction: "right"},

        {x: 1, y: 4, direction: "right"},
        {x: 2, y: 4, direction: "right"},
        {x: 3, y: 4, direction: "right"},
        {x: 4, y: 4, direction: "right"},
        {x: 5, y: 4, direction: "right"},
        {x: 6, y: 4, direction: "right"},
        {x: 7, y: 4, direction: "right"},


        {x: 1, y: 6, direction: "right"},
        {x: 2, y: 6, direction: "right"},
        {x: 3, y: 6, direction: "right"},
        {x: 4, y: 6, direction: "right"},
        {x: 5, y: 6, direction: "right"},
        {x: 6, y: 6, direction: "right"},
        {x: 7, y: 6, direction: "right"},
    ],
}
