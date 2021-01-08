import instructions from '../instructions.js';

export default {
    displayName: "Maze 123",
    description: "Just another HuntAndKill Maze",
    unlocksLevels: ['0124'],
    rows: 9,
    cols: 9,
    unlocksInstructions: [],
    gridObjects: [
        { x: 2, y: 1, ...instructions["BLCK"] },
        { x: 6, y: 1, ...instructions["BLCK"] },
        { x: 2, y: 2, ...instructions["BLCK"] },
        { x: 4, y: 2, ...instructions["BLCK"] },
        { x: 6, y: 2, ...instructions["BLCK"] },
        { x: 8, y: 2, ...instructions["BLCK"] },
        { x: 1, y: 3, ...instructions["FINI"] },
        { x: 2, y: 3, ...instructions["BLCK"] },
        { x: 4, y: 3, ...instructions["BLCK"] },
        { x: 5, y: 3, ...instructions["STRT"] },
        { x: 8, y: 3, ...instructions["BLCK"] },
        { x: 2, y: 4, ...instructions["BLCK"] },
        { x: 4, y: 4, ...instructions["BLCK"] },
        { x: 6, y: 4, ...instructions["BLCK"] },
        { x: 8, y: 4, ...instructions["BLCK"] },
        { x: 9, y: 4, ...instructions["BLCK"] },
        { x: 4, y: 5, ...instructions["BLCK"] },
        { x: 6, y: 5, ...instructions["BLCK"] },
        { x: 1, y: 6, ...instructions["BLCK"] },
        { x: 2, y: 6, ...instructions["BLCK"] },
        { x: 4, y: 6, ...instructions["BLCK"] },
        { x: 5, y: 6, ...instructions["BLCK"] },
        { x: 6, y: 6, ...instructions["BLCK"] },
        { x: 7, y: 6, ...instructions["BLCK"] },
        { x: 8, y: 6, ...instructions["BLCK"] },
        { x: 4, y: 7, ...instructions["BLCK"] },
        { x: 8, y: 7, ...instructions["BLCK"] },
        { x: 2, y: 8, ...instructions["BLCK"] },
        { x: 3, y: 8, ...instructions["BLCK"] },
        { x: 4, y: 8, ...instructions["BLCK"] },
        { x: 6, y: 8, ...instructions["BLCK"] },
        { x: 8, y: 8, ...instructions["BLCK"] },
        { x: 6, y: 9, ...instructions["BLCK"] },
        { x: 8, y: 9, ...instructions["BLCK"] },
    ],
}
