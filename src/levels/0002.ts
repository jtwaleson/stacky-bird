import instructions from '../instructions'

export default {
    displayName: 'And It Goes Down',
    hint: 'true',
    description: 'In this level we have to place one arrow',
    unlocksLevels: ['0003'],
    unlocksInstructions: ['LEFT'],
    bestStats: {
        cycles: 7,
        blocksUsed: 1,
        maxConcurrency: 1,
    },
    levelTiles: [
        { x: 3, y: 3, ...instructions['STRT'] },
        { x: 7, y: 5, ...instructions['FINI'] },
    ],
}
