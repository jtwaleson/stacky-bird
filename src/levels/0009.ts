import instructions from '../instructions'

export default {
    displayName: 'The Wall',
    description: 'This might seem impossible, maybe you have to finish another level first',
    unlocksLevels: ['2001', '1001'],
    unlocksInstructions: [],
    levelTiles: [
        { x: 1, y: 1, ...instructions['STRT'] },
        { x: 3, y: 1, ...instructions['BLCK'] },
        { x: 3, y: 2, ...instructions['BLCK'] },
        { x: 2, y: 2, ...instructions['BLCK'] },
        { x: 1, y: 2, ...instructions['BLCK'] },
        { x: 7, y: 7, ...instructions['FINI'] },
    ],
}
