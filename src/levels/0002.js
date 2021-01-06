import instructions from '../instructions.js';

export default {
    displayName: "And It Goes Down",
    description: "In this level we have to place one arrow",
    unlocksLevels: ["0003"],
    unlocksInstructions: ["LEFT"],
    gridObjects: [
        {x: 3, y: 3, ...instructions["STRT"]},
        {x: 7, y: 5, ...instructions["FINI"]},
    ],
}
