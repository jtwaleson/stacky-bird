import instructions from '../instructions'

export default {
    displayName: 'Swap',
    hint: 'true',
    description: 'There will be two numbers in the input. Return them in reverse order.',
    unlocksLevels: ['2015'],
    unlocksInstructions: ['DUMP'],
    bestStats: {
        cycles: 155,
        blocksUsed: 19,
        maxConcurrency: 1,
    },
    levelTiles: [
        { x: 1, y: 1, ...instructions['STRT'] },
        { x: 4, y: 4, ...instructions['ROT1'] },
        { x: 7, y: 7, ...instructions['FINI'] },
    ],
    validation: [
        {
            input: [1, 2],
            finalStack: [1, 2],
        },
        {
            input: [2, 4],
            finalStack: [2, 4],
        },
        {
            input: [8, 10],
            finalStack: [8, 10],
        },
        {
            input: [20, 1],
            finalStack: [20, 1],
        },
        {
            input: [15, -1],
            finalStack: [15, -1],
        },
    ],
}
