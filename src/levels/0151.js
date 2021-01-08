import instructions from '../instructions.js';

export default {
    displayName: "Maze 151",
    description: "Just another HuntAndKill Maze",
    unlocksLevels: ['0152'],
    rows: 13,
    cols: 13,
    unlocksInstructions: [],
    gridObjects: [
        { x: 1, y: 1, ...instructions["BLCK"] },
        { x: 2, y: 1, ...instructions["BLCK"] },
        { x: 3, y: 1, ...instructions["BLCK"] },
        { x: 4, y: 1, ...instructions["BLCK"] },
        { x: 5, y: 1, ...instructions["BLCK"] },
        { x: 6, y: 1, ...instructions["BLCK"] },
        { x: 7, y: 1, ...instructions["BLCK"] },
        { x: 8, y: 1, ...instructions["BLCK"] },
        { x: 9, y: 1, ...instructions["BLCK"] },
        { x: 10, y: 1, ...instructions["BLCK"] },
        { x: 11, y: 1, ...instructions["BLCK"] },
        { x: 12, y: 1, ...instructions["BLCK"] },
        { x: 13, y: 1, ...instructions["BLCK"] },
        { x: 1, y: 2, ...instructions["STRT"] },
        { x: 7, y: 2, ...instructions["BLCK"] },
        { x: 13, y: 2, ...instructions["BLCK"] },
        { x: 1, y: 3, ...instructions["BLCK"] },
        { x: 3, y: 3, ...instructions["BLCK"] },
        { x: 4, y: 3, ...instructions["BLCK"] },
        { x: 5, y: 3, ...instructions["BLCK"] },
        { x: 7, y: 3, ...instructions["BLCK"] },
        { x: 9, y: 3, ...instructions["BLCK"] },
        { x: 10, y: 3, ...instructions["BLCK"] },
        { x: 11, y: 3, ...instructions["BLCK"] },
        { x: 12, y: 3, ...instructions["BLCK"] },
        { x: 13, y: 3, ...instructions["BLCK"] },
        { x: 1, y: 4, ...instructions["BLCK"] },
        { x: 3, y: 4, ...instructions["BLCK"] },
        { x: 7, y: 4, ...instructions["BLCK"] },
        { x: 13, y: 4, ...instructions["FINI"] },
        { x: 1, y: 5, ...instructions["BLCK"] },
        { x: 3, y: 5, ...instructions["BLCK"] },
        { x: 4, y: 5, ...instructions["BLCK"] },
        { x: 5, y: 5, ...instructions["BLCK"] },
        { x: 6, y: 5, ...instructions["BLCK"] },
        { x: 7, y: 5, ...instructions["BLCK"] },
        { x: 9, y: 5, ...instructions["BLCK"] },
        { x: 10, y: 5, ...instructions["BLCK"] },
        { x: 11, y: 5, ...instructions["BLCK"] },
        { x: 13, y: 5, ...instructions["BLCK"] },
        { x: 1, y: 6, ...instructions["BLCK"] },
        { x: 9, y: 6, ...instructions["BLCK"] },
        { x: 11, y: 6, ...instructions["BLCK"] },
        { x: 13, y: 6, ...instructions["BLCK"] },
        { x: 1, y: 7, ...instructions["BLCK"] },
        { x: 2, y: 7, ...instructions["BLCK"] },
        { x: 3, y: 7, ...instructions["BLCK"] },
        { x: 4, y: 7, ...instructions["BLCK"] },
        { x: 5, y: 7, ...instructions["BLCK"] },
        { x: 6, y: 7, ...instructions["BLCK"] },
        { x: 7, y: 7, ...instructions["BLCK"] },
        { x: 8, y: 7, ...instructions["BLCK"] },
        { x: 9, y: 7, ...instructions["BLCK"] },
        { x: 11, y: 7, ...instructions["BLCK"] },
        { x: 13, y: 7, ...instructions["BLCK"] },
        { x: 1, y: 8, ...instructions["BLCK"] },
        { x: 5, y: 8, ...instructions["BLCK"] },
        { x: 13, y: 8, ...instructions["BLCK"] },
        { x: 1, y: 9, ...instructions["BLCK"] },
        { x: 3, y: 9, ...instructions["BLCK"] },
        { x: 4, y: 9, ...instructions["BLCK"] },
        { x: 5, y: 9, ...instructions["BLCK"] },
        { x: 7, y: 9, ...instructions["BLCK"] },
        { x: 8, y: 9, ...instructions["BLCK"] },
        { x: 9, y: 9, ...instructions["BLCK"] },
        { x: 10, y: 9, ...instructions["BLCK"] },
        { x: 11, y: 9, ...instructions["BLCK"] },
        { x: 13, y: 9, ...instructions["BLCK"] },
        { x: 1, y: 10, ...instructions["BLCK"] },
        { x: 3, y: 10, ...instructions["BLCK"] },
        { x: 7, y: 10, ...instructions["BLCK"] },
        { x: 9, y: 10, ...instructions["BLCK"] },
        { x: 13, y: 10, ...instructions["BLCK"] },
        { x: 1, y: 11, ...instructions["BLCK"] },
        { x: 3, y: 11, ...instructions["BLCK"] },
        { x: 5, y: 11, ...instructions["BLCK"] },
        { x: 6, y: 11, ...instructions["BLCK"] },
        { x: 7, y: 11, ...instructions["BLCK"] },
        { x: 9, y: 11, ...instructions["BLCK"] },
        { x: 11, y: 11, ...instructions["BLCK"] },
        { x: 12, y: 11, ...instructions["BLCK"] },
        { x: 13, y: 11, ...instructions["BLCK"] },
        { x: 1, y: 12, ...instructions["BLCK"] },
        { x: 9, y: 12, ...instructions["BLCK"] },
        { x: 13, y: 12, ...instructions["BLCK"] },
        { x: 1, y: 13, ...instructions["BLCK"] },
        { x: 2, y: 13, ...instructions["BLCK"] },
        { x: 3, y: 13, ...instructions["BLCK"] },
        { x: 4, y: 13, ...instructions["BLCK"] },
        { x: 5, y: 13, ...instructions["BLCK"] },
        { x: 6, y: 13, ...instructions["BLCK"] },
        { x: 7, y: 13, ...instructions["BLCK"] },
        { x: 8, y: 13, ...instructions["BLCK"] },
        { x: 9, y: 13, ...instructions["BLCK"] },
        { x: 10, y: 13, ...instructions["BLCK"] },
        { x: 11, y: 13, ...instructions["BLCK"] },
        { x: 12, y: 13, ...instructions["BLCK"] },
        { x: 13, y: 13, ...instructions["BLCK"] },
    ],
}
