import instructions from '../instructions.js';

export default {
    name: 'Level0004',
    displayName: "Level 0004 - Do The Work",
    description: "In this level we have to pick up some numbers and deliver them to the finish line",
    unlocksLevels: ["Level0005"],
    unlocksInstructions: ["READ"],
    gridObjects: [
        {x: 1, y: 3, ...instructions["STRT"]},
        {x: 2, y: 3, ...instructions["READ"]},
        {x: 7, y: 7, ...instructions["FINI"]},
    ],
}
