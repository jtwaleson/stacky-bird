import instructions from '../instructions.js';

export default {
    displayName: "Maze 126",
    description: "Just another Sidewinder Maze",
    unlocksLevels: ['0127'],
    rows: 9,
    cols: 9,
    unlocksInstructions: [],
    gridObjects: [
        { x: 7, y: 1, ...instructions["STRT"] },
        { x: 2, y: 2, ...instructions["BLCK"] },
        { x: 4, y: 2, ...instructions["BLCK"] },
        { x: 6, y: 2, ...instructions["BLCK"] },
        { x: 7, y: 2, ...instructions["BLCK"] },
        { x: 8, y: 2, ...instructions["BLCK"] },
        { x: 9, y: 2, ...instructions["BLCK"] },
        { x: 2, y: 3, ...instructions["BLCK"] },
        { x: 4, y: 3, ...instructions["BLCK"] },
        { x: 7, y: 3, ...instructions["FINI"] },
        { x: 2, y: 4, ...instructions["BLCK"] },
        { x: 4, y: 4, ...instructions["BLCK"] },
        { x: 6, y: 4, ...instructions["BLCK"] },
        { x: 8, y: 4, ...instructions["BLCK"] },
        { x: 2, y: 5, ...instructions["BLCK"] },
        { x: 4, y: 5, ...instructions["BLCK"] },
        { x: 6, y: 5, ...instructions["BLCK"] },
        { x: 8, y: 5, ...instructions["BLCK"] },
        { x: 1, y: 6, ...instructions["BLCK"] },
        { x: 2, y: 6, ...instructions["BLCK"] },
        { x: 4, y: 6, ...instructions["BLCK"] },
        { x: 6, y: 6, ...instructions["BLCK"] },
        { x: 7, y: 6, ...instructions["BLCK"] },
        { x: 8, y: 6, ...instructions["BLCK"] },
        { x: 4, y: 7, ...instructions["BLCK"] },
        { x: 6, y: 7, ...instructions["BLCK"] },
        { x: 1, y: 8, ...instructions["BLCK"] },
        { x: 2, y: 8, ...instructions["BLCK"] },
        { x: 4, y: 8, ...instructions["BLCK"] },
        { x: 6, y: 8, ...instructions["BLCK"] },
        { x: 7, y: 8, ...instructions["BLCK"] },
        { x: 8, y: 8, ...instructions["BLCK"] },
        { x: 4, y: 9, ...instructions["BLCK"] },
        { x: 8, y: 9, ...instructions["BLCK"] },
    ],
}
