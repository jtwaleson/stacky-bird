import instructions from '../instructions.js';

export default {
    displayName: "Do The Work",
    description: "In this level we have to pick up some numbers and deliver them to the finish line",
    unlocksLevels: ["1001"],
    unlocksInstructions: ["READ"],
    gridObjects: [
        {x: 1, y: 3, ...instructions["STRT"]},
        {x: 4, y: 1, ...instructions["READ"]},
        {x: 7, y: 7, ...instructions["FINI"]},
    ],
}
