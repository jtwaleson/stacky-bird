import instructions from '../instructions'

export default {
    displayName: 'Logic',
    hint: 'true',
    description:
        "Pick up a number, if it is less than 1, drop it. If it's higher, bring it to the finish line.",
    unlocksLevels: ['2008'],
    unlocksInstructions: ['VOID'],
    bestStats: {
        cycles: 104,
        blocksUsed: 5,
        maxConcurrency: 1,
    },
    levelTiles: [
        { x: 1, y: 1, ...instructions['STRT'] },
        { x: 3, y: 2, ...instructions['DUP1'] },
        { x: 3, y: 3, ...instructions['GEQ1'] },
        { x: 5, y: 5, ...instructions['VOID'] },
        { x: 7, y: 7, ...instructions['FINI'] },
    ],
    validation: [
        {
            input: [1],
            finalStack: [1],
        },
        {
            input: [0],
            finalStack: [],
        },
        {
            input: [8],
            finalStack: [8],
        },
        {
            input: [-5],
            finalStack: [],
        },
        {
            input: [99],
            finalStack: [99],
        },
        {
            input: [1],
            finalStack: [1],
        },
        {
            input: [-10],
            finalStack: [],
        },
        {
            input: [-20],
            finalStack: [],
        },
        {
            input: [20],
            finalStack: [20],
        },
    ],
}
