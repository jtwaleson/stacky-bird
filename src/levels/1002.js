import instructions from '../instructions.js';

export default {
    displayName: "Sit monster, sit",
    description: "Avoid the monsters",
    unlocksLevels: ["1003"],
    unlocksInstructions: [],
    levelTiles: [
        {x: 1, y: 4, ...instructions["STRT"]},
        {x: 7, y: 4, ...instructions["FINI"]},
    ],
    creeps: [
        {x: 4, y: 7, direction: "up"},
        {x: 3, y: 6, direction: "up"},
    ],
}
