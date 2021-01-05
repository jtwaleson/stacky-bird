import instructions from '../instructions.js';

export default {
    name: 'Level0001',
    displayName: "Level 0001 - And So It Begins",
    description: "In this level we don't have to build anything yet",
    unlocksLevels: ["Level0002"],
    unlocksInstructions: ["DOWN"],
    gridObjects: [
        {x: 3, y: 3, ...instructions["STRT"]},
        {x: 7, y: 3, ...instructions["FINI"]},
    ],
}
