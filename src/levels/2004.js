import instructions from '../instructions.js'

export default {
    displayName: '1 + 1 = 2',
    description: 'Pick up two numbers and add them together',
    unlocksLevels: ['2005'],
    unlocksInstructions: ['READ'],
    levelTiles: [
        { x: 1, y: 4, ...instructions['STRT'] },
        { x: 4, y: 4, ...instructions['READ'] },
        { x: 5, y: 7, ...instructions['PLUS'] },
        { x: 7, y: 7, ...instructions['FINI'] },
    ],
    validation: [
        {
            input: [1, 1],
            finalStack: [2],
        },
        {
            input: [3, 1],
            finalStack: [4],
        },
        {
            input: [20, 15],
            finalStack: [35],
        },
        {
            input: [-10, 10],
            finalStack: [0],
        },
        {
            input: [-10, -10],
            finalStack: [-20],
        },
        {
            input: [0, 0],
            finalStack: [0],
        },
        {
            input: [3, 9],
            finalStack: [12],
        },
        {
            input: [3232, 1],
            finalStack: [3233],
        },
        {
            input: [44, 56],
            finalStack: [100],
        },
    ],
}
