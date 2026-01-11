import instructions from '../instructions.js'

export default {
    displayName: 'Round And Round',
    description: 'In this level we have to go all the way round',
    unlocksLevels: ['0004'],
    unlocksInstructions: ['UPWD'],
    levelTiles: [
        { x: 4, y: 1, ...instructions['STRT'] },
        { x: 4, y: 2, ...instructions['FINI'] },
    ],
}
