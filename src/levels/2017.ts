import instructions from '../instructions'

export default {
    displayName: 'Doubling down twice',
    hint: 'true',
    description: 'Take two numbers in the input, say 5 and 1. Return four numbers, 1 5 1 5',
    unlocksLevels: ['2018'],
    unlocksInstructions: ['DUP2'],
    levelTiles: [
        { x: 1, y: 1, ...instructions['STRT'] },
        { x: 7, y: 7, ...instructions['FINI'] },
    ],
    validation: [
        {
            input: [1, 2],
            finalStack: [2, 1, 2, 1],
        },
        {
            input: [2, 4],
            finalStack: [4, 2, 4, 2],
        },
        {
            input: [-8, 10],
            finalStack: [10, -8, 10, -8],
        },
        {
            input: [20, 1],
            finalStack: [1, 20, 1, 20],
        },
        {
            input: [15, -1],
            finalStack: [-1, 15, -1, 15],
        },
    ],
}
