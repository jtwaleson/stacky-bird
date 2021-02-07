import instructions from '../instructions.js';

export default {
    displayName: "And So It Begins",
    description: "In this level we don't have to build anything yet",
    unlocksLevels: ["0002"],
    unlocksInstructions: ["DOWN"],
    levelTiles: [
        {x: 3, y: 3, ...instructions["STRT"]},
        {x: 7, y: 3, ...instructions["FINI"]},
    ],
}
