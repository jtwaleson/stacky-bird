import instructions from '../instructions'

export default {
    displayName: 'Doubling Down',
    hint: 'true',
    description: 'Pick up a number, copy it and finish with two numbers',
    unlocksLevels: ['2007'],
    unlocksInstructions: ['DUP1'],
    levelTiles: [
        { x: 1, y: 1, ...instructions['STRT'] },
        { x: 4, y: 4, ...instructions['DUP1'] },
        { x: 7, y: 7, ...instructions['FINI'] },
    ],
    validation: [
        {
            input: [1],
            finalStack: [1, 1],
        },
        {
            input: [5],
            finalStack: [5, 5],
        },
        {
            input: [-5],
            finalStack: [-5, -5],
        },
        {
            input: [99],
            finalStack: [99, 99],
        },
        {
            input: [0],
            finalStack: [0, 0],
        },
        {
            input: [12],
            finalStack: [12, 12],
        },
        {
            input: [100],
            finalStack: [100, 100],
        },
        {
            input: [-10],
            finalStack: [-10, -10],
        },
        {
            input: [999],
            finalStack: [999, 999],
        },
    ],
}
