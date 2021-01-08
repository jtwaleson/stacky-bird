import instructions from '../instructions.js';

export default {
    displayName: "Maze 104",
    description: "Just another CellularAutomaton Maze",
    unlocksLevels: ['0105'],
    rows: 7,
    cols: 7,
    unlocksInstructions: [],
    gridObjects: [
        { x: 1, y: 2, ...instructions["BLCK"] },
        { x: 2, y: 2, ...instructions["BLCK"] },
        { x: 4, y: 2, ...instructions["BLCK"] },
        { x: 5, y: 2, ...instructions["BLCK"] },
        { x: 6, y: 2, ...instructions["BLCK"] },
        { x: 7, y: 2, ...instructions["BLCK"] },
        { x: 2, y: 3, ...instructions["BLCK"] },
        { x: 3, y: 3, ...instructions["STRT"] },
        { x: 2, y: 4, ...instructions["BLCK"] },
        { x: 3, y: 4, ...instructions["BLCK"] },
        { x: 4, y: 4, ...instructions["BLCK"] },
        { x: 5, y: 4, ...instructions["BLCK"] },
        { x: 6, y: 4, ...instructions["BLCK"] },
        { x: 6, y: 5, ...instructions["BLCK"] },
        { x: 2, y: 6, ...instructions["BLCK"] },
        { x: 3, y: 6, ...instructions["BLCK"] },
        { x: 4, y: 6, ...instructions["BLCK"] },
        { x: 5, y: 6, ...instructions["BLCK"] },
        { x: 6, y: 6, ...instructions["BLCK"] },
        { x: 5, y: 5, ...instructions["FINI"] },
    ],
}
