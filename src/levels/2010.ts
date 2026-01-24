import instructions from '../instructions'

export default {
    displayName: 'Mark it zero',
    hint: 'true',
    description:
        'Pick up a number, while it is larger than 0, make it smaller. Only come to the finish with 0. Note that all numbers are 0 or larger.',
    unlocksLevels: ['2011'],
    unlocksInstructions: ['GEQ1'],
    bestStats: {
        cycles: 337,
        blocksUsed: 7,
        maxConcurrency: 1,
    },
    levelTiles: [
        { x: 1, y: 1, ...instructions['STRT'] },
        { x: 4, y: 4, ...instructions['GEQ1'] },
        { x: 7, y: 7, ...instructions['FINI'] },
    ],
    validation: [
        {
            input: [1],
            finalStack: [0],
        },
        {
            input: [0],
            finalStack: [0],
        },
        {
            input: [8],
            finalStack: [0],
        },
        {
            input: [5],
            finalStack: [0],
        },
        {
            input: [15],
            finalStack: [0],
        },
        {
            input: [1],
            finalStack: [0],
        },
        {
            input: [10],
            finalStack: [0],
        },
        {
            input: [8],
            finalStack: [0],
        },
        {
            input: [2],
            finalStack: [0],
        },
    ],
}
