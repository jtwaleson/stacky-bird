import instructions from '../instructions.js'

export default {
    displayName: 'Pick up a number',
    description: 'In this level we have to pick up a number and deliver it to the finish line',
    unlocksLevels: ['2002'],
    unlocksInstructions: [],
    levelTiles: [
        { x: 1, y: 3, ...instructions['STRT'] },
        { x: 4, y: 1, ...instructions['READ'] },
        { x: 7, y: 7, ...instructions['FINI'] },
    ],
    validation: [
        {
            input: [10],
            finalStack: [10],
        },
        {
            input: [1],
            finalStack: [1],
        },
        {
            input: [9],
            finalStack: [9],
        },
        {
            input: [-9],
            finalStack: [-9],
        },
        {
            input: [0],
            finalStack: [0],
        },
        {
            input: [100],
            finalStack: [100],
        },
        {
            input: [-103],
            finalStack: [-103],
        },
        {
            input: [4],
            finalStack: [4],
        },
        {
            input: [-99],
            finalStack: [-99],
        },
    ],
}
