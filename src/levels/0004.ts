import instructions from '../instructions'

export default {
    displayName: 'ZigZag',
    hint: 'true',
    description: 'In this level we have to go all the way round',
    unlocksLevels: ['0005'],
    unlocksInstructions: ['RGHT'],
    bestStats: {
        cycles: 4,
        blocksUsed: 1,
        maxConcurrency: 1,
    },
    levelTiles: [
        { x: 4, y: 1, ...instructions['STRT'] },
        { x: 3, y: 1, ...instructions['FINI'] },
    ],
}
