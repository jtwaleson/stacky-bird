import instructions from '../instructions'

export default {
    displayName: 'All the way',
    hint: 'true',
    description: 'In this level we have to go all the way round',
    unlocksLevels: ['0006'],
    unlocksInstructions: [],
    levelTiles: [
        { x: 4, y: 2, ...instructions['STRT'] },
        { x: 5, y: 1, ...instructions['BLCK'] },
        { x: 4, y: 1, ...instructions['FINI'] },
    ],
}
