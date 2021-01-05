import instructions from '../instructions.js';

export default {
    name: 'Level0005',
    displayName: "You Only Live Once",
    description: "In this level we introduce randomness, you have to escape it!",
    unlocksLevels: ["Level0006"],
    unlocksInstructions: ["YOLO"],
    gridObjects: [
        {x: 1, y: 4, ...instructions["STRT"]},
        {x: 4, y: 4, ...instructions["YOLO"]},
        {x: 2, y: 4, ...instructions["RGHT"]},
        {x: 6, y: 4, ...instructions["LEFT"]},
        {x: 4, y: 6, ...instructions["UPWD"]},
        {x: 4, y: 2, ...instructions["DOWN"]},
        {x: 7, y: 4, ...instructions["FINI"]},
    ],
}
