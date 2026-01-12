import instructions from '../instructions'

export default {
    displayName: 'Sit monster, sit I',
    hint: 'true',
    description: 'Avoid the monsters',
    unlocksLevels: ['1002'],
    unlocksInstructions: [],
    levelTiles: [
        { x: 1, y: 4, ...instructions['STRT'] },
        { x: 7, y: 4, ...instructions['FINI'] },
    ],
    creeps: [{ x: 4, y: 7, direction: 'up' }],
}
