import instructions from '../instructions.js';

export default {
    displayName: "Maze 114",
    description: "Just another Wilsons Maze",
    unlocksLevels: ['0115'],
    rows: 7,
    cols: 7,
    unlocksInstructions: [],
    levelTiles: [
        { x: 2, y: 1, ...instructions["BLCK"] },
        { x: 3, y: 1, ...instructions["FINI"] },
        { x: 2, y: 2, ...instructions["BLCK"] },
        { x: 3, y: 2, ...instructions["BLCK"] },
        { x: 4, y: 2, ...instructions["BLCK"] },
        { x: 6, y: 2, ...instructions["BLCK"] },
        { x: 7, y: 2, ...instructions["BLCK"] },
        { x: 4, y: 3, ...instructions["BLCK"] },
        { x: 2, y: 4, ...instructions["BLCK"] },
        { x: 4, y: 4, ...instructions["BLCK"] },
        { x: 6, y: 4, ...instructions["BLCK"] },
        { x: 7, y: 4, ...instructions["BLCK"] },
        { x: 2, y: 5, ...instructions["BLCK"] },
        { x: 1, y: 6, ...instructions["BLCK"] },
        { x: 2, y: 6, ...instructions["BLCK"] },
        { x: 3, y: 6, ...instructions["BLCK"] },
        { x: 4, y: 6, ...instructions["BLCK"] },
        { x: 6, y: 6, ...instructions["BLCK"] },
        { x: 7, y: 6, ...instructions["BLCK"] },
        { x: 1, y: 7, ...instructions["STRT"] },
    ],
}
