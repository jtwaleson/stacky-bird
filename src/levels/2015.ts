import instructions from '../instructions'

export default {
    displayName: 'Max',
    hint: 'true',
    description: 'There will be two numbers in the input. Return only the largest number.',
    unlocksLevels: ['2016'],
    unlocksInstructions: ['MINU'],
    levelTiles: [
        { x: 1, y: 1, ...instructions['STRT'] },
        { x: 4, y: 4, ...instructions['MINU'] },
        { x: 7, y: 7, ...instructions['FINI'] },
    ],
    validation: [
        {
            input: [1, 2],
            finalStack: [2],
        },
        {
            input: [2, 4],
            finalStack: [4],
        },
        {
            input: [-8, 10],
            finalStack: [10],
        },
        {
            input: [20, 1],
            finalStack: [20],
        },
        {
            input: [15, -1],
            finalStack: [15],
        },
    ],
}
