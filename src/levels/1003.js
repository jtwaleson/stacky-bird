import instructions from '../instructions.js';

export default {
    displayName: "Sit monster, sit",
    description: "Avoid the monsters",
    unlocksLevels: ["1004"],
    unlocksInstructions: [],
    gridObjects: [
        {x: 1, y: 1, ...instructions["STRT"]},
        {x: 7, y: 4, ...instructions["FINI"]},
    ],
    creeps: [
        {x: 3, y: 5, direction: "up"},
        {x: 4, y: 5, direction: "up"},
        {x: 5, y: 5, direction: "up"},
        {x: 3, y: 6, direction: "up"},
        {x: 4, y: 6, direction: "up"},
        {x: 5, y: 6, direction: "up"},
        {x: 3, y: 3, direction: "down"},
        {x: 4, y: 3, direction: "down"},
        {x: 5, y: 3, direction: "down"},
        {x: 3, y: 2, direction: "down"},
        {x: 4, y: 2, direction: "down"},
        {x: 5, y: 2, direction: "down"},
    ],
}
