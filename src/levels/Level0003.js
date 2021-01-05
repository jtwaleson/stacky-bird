import instructions from '../instructions.js';

export default {
    name: 'Level0003',
    displayName: "Level 0003 - Round And Round",
    description: "In this level we have to go all the way round",
    unlocksLevels: ["Level0004"],
    unlocksInstructions: ["UPWD", "RGHT"],
    gridObjects: [
        {x: 3, y: 3, ...instructions["STRT"]},
        {x: 1, y: 7, ...instructions["FINI"]},
    ],
}
