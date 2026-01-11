import instructions from '../instructions.js'

export default {
    displayName: 'Add one',
    description: 'Pick up a number, make it one larger and bring it to the finish.',
    unlocksLevels: ['2009'],
    unlocksInstructions: ['ADD1'],
    levelTiles: [
        { x: 1, y: 1, ...instructions['STRT'] },
        { x: 4, y: 4, ...instructions['ADD1'] },
        { x: 7, y: 7, ...instructions['FINI'] },
    ],
    validation: [
        {
            input: [1],
            finalStack: [2],
        },
        {
            input: [0],
            finalStack: [1],
        },
        {
            input: [8],
            finalStack: [9],
        },
        {
            input: [-5],
            finalStack: [-4],
        },
        {
            input: [99],
            finalStack: [100],
        },
        {
            input: [1],
            finalStack: [2],
        },
        {
            input: [-10],
            finalStack: [-9],
        },
        {
            input: [-20],
            finalStack: [-19],
        },
        {
            input: [20],
            finalStack: [21],
        },
    ],
}
