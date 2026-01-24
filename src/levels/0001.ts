import instructions from '../instructions'

export default {
    displayName: 'And So It Begins',
    hint: 'true',
    description: "In this level we don't have to build anything yet",
    unlocksLevels: ['0002'],
    unlocksInstructions: ['DOWN'],
    bestStats: {
        cycles: 5,
        blocksUsed: 0,
        maxConcurrency: 1,
    },
    levelTiles: [
        { x: 3, y: 3, ...instructions['STRT'] },
        { x: 7, y: 3, ...instructions['FINI'] },
    ],
}
