import instructions from '../instructions.js';

export default {
    displayName: "Maze 140",
    description: "Just another Sidewinder Maze",
    unlocksLevels: ['0141'],
    rows: 11,
    cols: 11,
    unlocksInstructions: [],
    gridObjects: [
        { x: 2, y: 2, ...instructions["BLCK"] },
        { x: 3, y: 2, ...instructions["BLCK"] },
        { x: 4, y: 2, ...instructions["BLCK"] },
        { x: 6, y: 2, ...instructions["BLCK"] },
        { x: 7, y: 2, ...instructions["BLCK"] },
        { x: 8, y: 2, ...instructions["BLCK"] },
        { x: 9, y: 2, ...instructions["BLCK"] },
        { x: 10, y: 2, ...instructions["BLCK"] },
        { x: 11, y: 2, ...instructions["BLCK"] },
        { x: 4, y: 3, ...instructions["BLCK"] },
        { x: 2, y: 4, ...instructions["BLCK"] },
        { x: 3, y: 4, ...instructions["BLCK"] },
        { x: 4, y: 4, ...instructions["BLCK"] },
        { x: 5, y: 4, ...instructions["BLCK"] },
        { x: 6, y: 4, ...instructions["BLCK"] },
        { x: 8, y: 4, ...instructions["BLCK"] },
        { x: 9, y: 4, ...instructions["BLCK"] },
        { x: 10, y: 4, ...instructions["BLCK"] },
        { x: 11, y: 4, ...instructions["BLCK"] },
        { x: 2, y: 5, ...instructions["BLCK"] },
        { x: 1, y: 6, ...instructions["BLCK"] },
        { x: 2, y: 6, ...instructions["BLCK"] },
        { x: 4, y: 6, ...instructions["BLCK"] },
        { x: 6, y: 6, ...instructions["BLCK"] },
        { x: 8, y: 6, ...instructions["BLCK"] },
        { x: 9, y: 6, ...instructions["BLCK"] },
        { x: 10, y: 6, ...instructions["BLCK"] },
        { x: 11, y: 6, ...instructions["BLCK"] },
        { x: 4, y: 7, ...instructions["BLCK"] },
        { x: 6, y: 7, ...instructions["BLCK"] },
        { x: 9, y: 7, ...instructions["FINI"] },
        { x: 2, y: 8, ...instructions["BLCK"] },
        { x: 4, y: 8, ...instructions["BLCK"] },
        { x: 6, y: 8, ...instructions["BLCK"] },
        { x: 8, y: 8, ...instructions["BLCK"] },
        { x: 9, y: 8, ...instructions["BLCK"] },
        { x: 10, y: 8, ...instructions["BLCK"] },
        { x: 2, y: 9, ...instructions["BLCK"] },
        { x: 4, y: 9, ...instructions["BLCK"] },
        { x: 6, y: 9, ...instructions["BLCK"] },
        { x: 8, y: 9, ...instructions["BLCK"] },
        { x: 9, y: 9, ...instructions["STRT"] },
        { x: 2, y: 10, ...instructions["BLCK"] },
        { x: 4, y: 10, ...instructions["BLCK"] },
        { x: 6, y: 10, ...instructions["BLCK"] },
        { x: 7, y: 10, ...instructions["BLCK"] },
        { x: 8, y: 10, ...instructions["BLCK"] },
        { x: 9, y: 10, ...instructions["BLCK"] },
        { x: 10, y: 10, ...instructions["BLCK"] },
        { x: 2, y: 11, ...instructions["BLCK"] },
        { x: 4, y: 11, ...instructions["BLCK"] },
        { x: 8, y: 11, ...instructions["BLCK"] },
    ],
}
