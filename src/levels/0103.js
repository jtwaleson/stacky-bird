import instructions from '../instructions.js';

export default {
    displayName: "Maze 103",
    description: "Just another BinaryTree Maze",
    unlocksLevels: ['0104'],
    rows: 7,
    cols: 7,
    unlocksInstructions: [],
    gridObjects: [
        { x: 7, y: 1, ...instructions["FINI"] },
        { x: 1, y: 2, ...instructions["BLCK"] },
        { x: 2, y: 2, ...instructions["BLCK"] },
        { x: 3, y: 2, ...instructions["BLCK"] },
        { x: 4, y: 2, ...instructions["BLCK"] },
        { x: 5, y: 2, ...instructions["BLCK"] },
        { x: 6, y: 2, ...instructions["BLCK"] },
        { x: 3, y: 7, ...instructions["STRT"] },
        { x: 1, y: 4, ...instructions["BLCK"] },
        { x: 2, y: 4, ...instructions["BLCK"] },
        { x: 3, y: 4, ...instructions["BLCK"] },
        { x: 4, y: 4, ...instructions["BLCK"] },
        { x: 6, y: 4, ...instructions["BLCK"] },
        { x: 6, y: 5, ...instructions["BLCK"] },
        { x: 2, y: 6, ...instructions["BLCK"] },
        { x: 3, y: 6, ...instructions["BLCK"] },
        { x: 4, y: 6, ...instructions["BLCK"] },
        { x: 5, y: 6, ...instructions["BLCK"] },
        { x: 6, y: 6, ...instructions["BLCK"] },
        { x: 2, y: 7, ...instructions["BLCK"] },
    ],
}
