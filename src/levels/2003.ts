import instructions from '../instructions'

export default {
    displayName: 'Pick up two numbers II',
    hint: 'true',
    description: 'Pick up two numbers and deliver them to the finish line',
    unlocksLevels: ['2004'],
    unlocksInstructions: [],
    unlocksSpeed: 'turbo' as const,
    levelTiles: [
        { x: 1, y: 4, ...instructions['STRT'] },
        { x: 4, y: 4, ...instructions['READ'] },
        { x: 7, y: 7, ...instructions['FINI'] },
    ],
    validation: [
        {
            input: [9, 1],
            finalStack: [1, 9],
        },
        {
            input: [4, 99],
            finalStack: [99, 4],
        },
        {
            input: [-10, 15],
            finalStack: [15, -10],
        },
        {
            input: [99, 11],
            finalStack: [11, 99],
        },
        {
            input: [-99, -1],
            finalStack: [-1, -99],
        },
        {
            input: [8, 8],
            finalStack: [8, 8],
        },
        {
            input: [3, 4],
            finalStack: [4, 3],
        },
    ],
}
