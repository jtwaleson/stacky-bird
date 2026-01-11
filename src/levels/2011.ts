import instructions from '../instructions'

export default {
    displayName: 'Sum',
    description:
        'Read all the numbers in the input, and sum them all up. Note, there is always at least one item in the input.',
    unlocksLevels: ['2012'],
    unlocksInstructions: ['INSZ'],
    levelTiles: [
        { x: 1, y: 1, ...instructions['STRT'] },
        { x: 3, y: 3, ...instructions['INSZ'] },
        { x: 7, y: 7, ...instructions['FINI'] },
    ],
    validation: [
        {
            input: [1, 2, 3, 4, 5, 6],
            finalStack: [21],
        },
        {
            input: [0],
            finalStack: [0],
        },
        {
            input: [8, 4, 2],
            finalStack: [14],
        },
        {
            input: [-1, 0, 1],
            finalStack: [0],
        },
        {
            input: [1, 1, 1, 1, 1, 1, 1, 1],
            finalStack: [8],
        },
        {
            input: [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1],
            finalStack: [-55],
        },
        {
            input: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
            finalStack: [55],
        },
        {
            input: [8],
            finalStack: [8],
        },
        {
            input: [2, 1],
            finalStack: [3],
        },
    ],
}
