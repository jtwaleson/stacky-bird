import instructions from '../instructions.js'

export default {
    displayName: '1 + 1 + 1 = 3',
    description: 'Pick up three numbers and add them together',
    unlocksLevels: ['2006'],
    unlocksInstructions: ['PLUS'],
    levelTiles: [
        { x: 1, y: 1, ...instructions['STRT'] },
        { x: 7, y: 3, ...instructions['PLUS'] },
        { x: 7, y: 5, ...instructions['PLUS'] },
        { x: 7, y: 7, ...instructions['FINI'] },
    ],
    validation: [
        {
            input: [1, 1, 1],
            finalStack: [3],
        },
        {
            input: [3, 1, 5],
            finalStack: [9],
        },
        {
            input: [20, 15, 1],
            finalStack: [36],
        },
        {
            input: [-10, 10, 99],
            finalStack: [99],
        },
        {
            input: [-3, -3, 6],
            finalStack: [0],
        },
        {
            input: [0, 0, 0],
            finalStack: [0],
        },
        {
            input: [3, 9, 10],
            finalStack: [22],
        },
        {
            input: [3232, 1, 4000],
            finalStack: [7233],
        },
        {
            input: [44, 56, 100],
            finalStack: [200],
        },
    ],
}
