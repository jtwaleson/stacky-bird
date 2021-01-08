import instructions from '../instructions.js';

export default {
    displayName: "Maze 107",
    description: "Just another Ellers Maze",
    unlocksLevels: ['0108'],
    rows: 7,
    cols: 7,
    unlocksInstructions: [],
    gridObjects: [
        { x: 1, y: 1, ...instructions["BLCK"] },
        { x: 2, y: 1, ...instructions["BLCK"] },
        { x: 3, y: 1, ...instructions["BLCK"] },
        { x: 4, y: 1, ...instructions["BLCK"] },
        { x: 5, y: 1, ...instructions["BLCK"] },
        { x: 6, y: 1, ...instructions["BLCK"] },
        { x: 7, y: 1, ...instructions["BLCK"] },
        { x: 1, y: 2, ...instructions["STRT"] },
        { x: 7, y: 2, ...instructions["BLCK"] },
        { x: 1, y: 3, ...instructions["BLCK"] },
        { x: 3, y: 3, ...instructions["BLCK"] },
        { x: 4, y: 3, ...instructions["BLCK"] },
        { x: 5, y: 3, ...instructions["BLCK"] },
        { x: 7, y: 3, ...instructions["BLCK"] },
        { x: 1, y: 4, ...instructions["BLCK"] },
        { x: 5, y: 4, ...instructions["BLCK"] },
        { x: 7, y: 4, ...instructions["FINI"] },
        { x: 1, y: 5, ...instructions["BLCK"] },
        { x: 3, y: 5, ...instructions["BLCK"] },
        { x: 5, y: 5, ...instructions["BLCK"] },
        { x: 6, y: 5, ...instructions["BLCK"] },
        { x: 7, y: 5, ...instructions["BLCK"] },
        { x: 1, y: 6, ...instructions["BLCK"] },
        { x: 3, y: 6, ...instructions["BLCK"] },
        { x: 7, y: 6, ...instructions["BLCK"] },
        { x: 1, y: 7, ...instructions["BLCK"] },
        { x: 2, y: 7, ...instructions["BLCK"] },
        { x: 3, y: 7, ...instructions["BLCK"] },
        { x: 4, y: 7, ...instructions["BLCK"] },
        { x: 5, y: 7, ...instructions["BLCK"] },
        { x: 6, y: 7, ...instructions["BLCK"] },
        { x: 7, y: 7, ...instructions["BLCK"] },
    ],
}
