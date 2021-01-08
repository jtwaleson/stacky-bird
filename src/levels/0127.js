import instructions from '../instructions.js';

export default {
    displayName: "Maze 127",
    description: "Just another TrivialMaze Maze",
    unlocksLevels: ['0128'],
    rows: 9,
    cols: 9,
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
        { x: 1, y: 2, ...instructions["BLCK"] },
        { x: 9, y: 2, ...instructions["BLCK"] },
        { x: 1, y: 3, ...instructions["BLCK"] },
        { x: 2, y: 3, ...instructions["BLCK"] },
        { x: 3, y: 3, ...instructions["BLCK"] },
        { x: 4, y: 3, ...instructions["BLCK"] },
        { x: 5, y: 3, ...instructions["BLCK"] },
        { x: 6, y: 3, ...instructions["BLCK"] },
        { x: 7, y: 3, ...instructions["BLCK"] },
        { x: 9, y: 3, ...instructions["BLCK"] },
        { x: 1, y: 4, ...instructions["BLCK"] },
        { x: 7, y: 4, ...instructions["BLCK"] },
        { x: 9, y: 4, ...instructions["BLCK"] },
        { x: 1, y: 5, ...instructions["BLCK"] },
        { x: 3, y: 5, ...instructions["BLCK"] },
        { x: 4, y: 5, ...instructions["BLCK"] },
        { x: 5, y: 5, ...instructions["BLCK"] },
        { x: 7, y: 5, ...instructions["BLCK"] },
        { x: 9, y: 5, ...instructions["BLCK"] },
        { x: 1, y: 6, ...instructions["STRT"] },
        { x: 3, y: 6, ...instructions["BLCK"] },
        { x: 7, y: 6, ...instructions["BLCK"] },
        { x: 9, y: 6, ...instructions["BLCK"] },
        { x: 1, y: 7, ...instructions["BLCK"] },
        { x: 3, y: 7, ...instructions["BLCK"] },
        { x: 4, y: 7, ...instructions["BLCK"] },
        { x: 5, y: 7, ...instructions["BLCK"] },
        { x: 6, y: 7, ...instructions["BLCK"] },
        { x: 7, y: 7, ...instructions["BLCK"] },
        { x: 9, y: 7, ...instructions["BLCK"] },
        { x: 1, y: 8, ...instructions["BLCK"] },
        { x: 9, y: 8, ...instructions["FINI"] },
        { x: 1, y: 9, ...instructions["BLCK"] },
        { x: 2, y: 9, ...instructions["BLCK"] },
        { x: 3, y: 9, ...instructions["BLCK"] },
        { x: 4, y: 9, ...instructions["BLCK"] },
        { x: 5, y: 9, ...instructions["BLCK"] },
        { x: 6, y: 9, ...instructions["BLCK"] },
        { x: 7, y: 9, ...instructions["BLCK"] },
        { x: 8, y: 9, ...instructions["BLCK"] },
        { x: 9, y: 9, ...instructions["BLCK"] },
    ],
}
