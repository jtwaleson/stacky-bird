import instructions from '../instructions.js';

export default {
    name: 'Level0003',
    displayName: "Round And Round",
    description: "In this level we have to go all the way round",
    unlocksLevels: ["Level0004"],
    unlocksInstructions: ["UPWD", "RGHT"],
    gridObjects: [
        {x: 4, y: 2, ...instructions["STRT"]},
        {x: 5, y: 1, ...instructions["BLCK"]},
        {x: 4, y: 1, ...instructions["FINI"]},
    ],
}
