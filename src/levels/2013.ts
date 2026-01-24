import instructions from '../instructions'

export default {
    displayName: 'Count',
    hint: 'true',
    description:
        'Read all the numbers in the input, and just return the total amount of numbers read.',
    unlocksLevels: ['2014'],
    unlocksInstructions: ['GEQ1'],
    bestStats: {
        cycles: 117,
        blocksUsed: 3,
        maxConcurrency: 1,
    },
    levelTiles: [
        { x: 1, y: 1, ...instructions['STRT'] },
        { x: 7, y: 7, ...instructions['FINI'] },
    ],
    validation: [
        {
            input: [1, 2, 3, 4, 5, 6],
            finalStack: [6],
        },
        {
            input: [0],
            finalStack: [1],
        },
        {
            input: [8],
            finalStack: [1],
        },
        {
            input: [],
            finalStack: [0],
        },
        {
            input: [15, -1, 2, 3],
            finalStack: [4],
        },
        {
            input: [43, 4, 1, 5, 7],
            finalStack: [5],
        },
        {
            input: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            finalStack: [10],
        },
        {
            input: [2, 2, 2, 2, 2],
            finalStack: [5],
        },
        {
            input: [100, 100],
            finalStack: [2],
        },
    ],
}
