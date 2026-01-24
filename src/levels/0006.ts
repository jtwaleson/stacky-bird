import instructions from '../instructions'

export default {
    displayName: 'The Stairway',
    hint: 'true',
    description: 'In this level we have to go all the way round',
    unlocksLevels: ['0007'],
    unlocksInstructions: [],
    unlocksSpeed: 'play' as const,
    bestStats: {
        cycles: 13,
        blocksUsed: 11,
        maxConcurrency: 1,
    },
    levelTiles: [
        { x: 1, y: 1, ...instructions['STRT'] },
        { x: 3, y: 1, ...instructions['BLCK'] },
        { x: 4, y: 2, ...instructions['BLCK'] },
        { x: 5, y: 3, ...instructions['BLCK'] },
        { x: 6, y: 4, ...instructions['BLCK'] },
        { x: 7, y: 5, ...instructions['BLCK'] },
        { x: 1, y: 2, ...instructions['BLCK'] },
        { x: 2, y: 3, ...instructions['BLCK'] },
        { x: 3, y: 4, ...instructions['BLCK'] },
        { x: 4, y: 5, ...instructions['BLCK'] },
        { x: 5, y: 6, ...instructions['BLCK'] },
        { x: 6, y: 7, ...instructions['BLCK'] },
        { x: 7, y: 7, ...instructions['FINI'] },
    ],
}
