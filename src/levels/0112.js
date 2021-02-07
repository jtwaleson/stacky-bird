import instructions from '../instructions.js';

export default {
    displayName: "Maze 112",
    description: "Just another Sidewinder Maze",
    unlocksLevels: ['0113'],
    rows: 7,
    cols: 7,
    unlocksInstructions: [],
    levelTiles: [
        { x: 2, y: 2, ...instructions["BLCK"] },
        { x: 3, y: 2, ...instructions["BLCK"] },
        { x: 4, y: 2, ...instructions["BLCK"] },
        { x: 5, y: 2, ...instructions["BLCK"] },
        { x: 6, y: 2, ...instructions["BLCK"] },
        { x: 2, y: 3, ...instructions["BLCK"] },
        { x: 7, y: 3, ...instructions["FINI"] },
        { x: 2, y: 4, ...instructions["BLCK"] },
        { x: 4, y: 4, ...instructions["BLCK"] },
        { x: 5, y: 4, ...instructions["BLCK"] },
        { x: 6, y: 4, ...instructions["BLCK"] },
        { x: 2, y: 5, ...instructions["BLCK"] },
        { x: 4, y: 5, ...instructions["BLCK"] },
        { x: 5, y: 5, ...instructions["STRT"] },
        { x: 1, y: 6, ...instructions["BLCK"] },
        { x: 2, y: 6, ...instructions["BLCK"] },
        { x: 4, y: 6, ...instructions["BLCK"] },
        { x: 6, y: 6, ...instructions["BLCK"] },
        { x: 4, y: 7, ...instructions["BLCK"] },
        { x: 6, y: 7, ...instructions["BLCK"] },
    ],
}
