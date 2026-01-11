import instructions from '../instructions.js'

export default {
    displayName: 'ZigZag',
    description: 'In this level we have to go all the way round',
    unlocksLevels: ['0005'],
    unlocksInstructions: ['RGHT'],
    levelTiles: [
        { x: 4, y: 1, ...instructions['STRT'] },
        { x: 3, y: 1, ...instructions['FINI'] },
    ],
}
