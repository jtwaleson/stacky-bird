/*
 * Miscellaneous Technical
 * Geometric Shapes
 * Number Forms -> ↂ and ↈ for DUP2 and DUP3
 * Ornamental Dingbats
 * Transport and Map Symbols 🚩
 * Supplemental Arrows-C
 * Geometric Shapes Extended
 * Alchemical Symbols 🜹
 * Miscellaneous Symbols and Pictographs 🏲 🗑
 * Enclosed Alphanumeric Supplement
 * Mende Kikakui
 * Byzantine Musical Symbols
 * Supplemental Punctuation
 * https://www.fileformat.info/info/unicode/block/miscellaneous_symbols_and_arrows/utf8test.htm
 * https://www.fileformat.info/info/unicode/block/supplemental_mathematical_operators/utf8test.htm
 * https://www.fileformat.info/info/unicode/block/miscellaneous_mathematical_symbols_b/utf8test.htm
 * https://www.fileformat.info/info/unicode/block/miscellaneous_mathematical_symbols_a/utf8test.htm
 * https://www.fileformat.info/info/unicode/block/miscellaneous_symbols/utf8test.htm
 * */

interface ToneSynth {
    triggerAttackRelease: (note: string, duration: string) => void
    toDestination: () => ToneSynth
}

interface ToneContext {
    state: string
    resume: () => Promise<void>
}

interface ToneModule {
    Synth: new () => { toDestination: () => ToneSynth }
    context: ToneContext
}

let synth: ToneSynth | null = null
let Tone: ToneModule | null = null

async function getSynth(): Promise<ToneSynth> {
    if (!Tone) {
        // Lazy import Tone.js only when needed (after user gesture)
        Tone = await import('tone')
    }
    if (!synth) {
        synth = new Tone.Synth().toDestination()
        // Resume AudioContext if it's suspended (required after user gesture)
        if (Tone.context.state === 'suspended') {
            await Tone.context.resume()
        }
    }
    return synth
}

import { toRaw } from 'vue'
import isEqual from 'lodash.isequal'
import { sleep } from './util'

type Direction = 'up' | 'down' | 'left' | 'right'

interface Bird {
    x: number | null
    y: number | null
    flappingImage: boolean
    direction: Direction
    stack: number[]
    birdClasses: string[]
}

interface TestCase {
    input: number[]
    finalStack: number[]
}

interface BoardObject {
    name: string
    x: number
    y: number
    [key: string]: unknown
}

interface Board {
    selectedTestCase?: TestCase
    input: number[]
    speed: number
    boardObjects: BoardObject[]
    finish: () => Promise<void>
    dieBird: (message: string, bird: Bird) => Promise<void>
    spawnBird: () => void
    [key: string]: unknown
}

interface Tile {
    x: number
    y: number
    name: string
    state?: number | null
    initialWait?: number
    [key: string]: unknown
}

interface RevMap {
    up: 'down'
    left: 'right'
    right: 'left'
    down: 'up'
}

export default {
    STRT: {
        symbol: '○', // maybe ⌂
        description: 'instructions.STRT',
        async execute() {},
    },
    FINI: {
        symbol: '◍',
        description: 'instructions.FINI',
        async execute(bird: Bird, board: Board) {
            if (board.selectedTestCase) {
                const expected = toRaw(board.selectedTestCase.finalStack || [])
                const stack = toRaw(bird.stack).slice().reverse()
                if (isEqual(expected, stack)) {
                    await board.finish()
                    return 'NOMOVE'
                } else {
                    await board.dieBird('errors.unexpectedResult', bird)
                }
            } else {
                await board.finish()
                return 'NOMOVE'
            }
        },
    },
    UPWD: {
        symbol: '▲',
        description: 'instructions.UPWD',
        async execute(bird: Bird) {
            bird.direction = 'up'
        },
    },
    DOWN: {
        symbol: '▼',
        description: 'instructions.DOWN',
        async execute(bird: Bird) {
            bird.direction = 'down'
        },
    },
    LEFT: {
        symbol: '◀',
        description: 'instructions.LEFT',
        async execute(bird: Bird) {
            bird.direction = 'left'
        },
    },
    RGHT: {
        symbol: '▶',
        description: 'instructions.RGHT',
        async execute(bird: Bird) {
            bird.direction = 'right'
        },
    },
    REVR: {
        symbol: '↺',
        description: 'instructions.REVR',
        async execute(bird: Bird) {
            const rev: RevMap = {
                up: 'down',
                left: 'right',
                right: 'left',
                down: 'up',
            }
            bird.direction = rev[bird.direction] as Direction
        },
        instructionClass: 'B',
    },
    READ: {
        symbol: '⌬',
        description: 'instructions.READ',
        async execute(bird: Bird, board: Board) {
            if (board.input.length == 0) {
                return await board.dieBird('errors.noMoreNumbers', bird)
            }
            const input = toRaw(board.input.shift())
            if (input !== undefined) {
                bird.stack.push(input)
            }
            await sleep(board.speed)
        },
        instructionClass: 'C',
    },
    DUP1: {
        symbol: 'ↀ',
        description: 'instructions.DUP1',
        async execute(bird: Bird, board: Board) {
            if (bird.stack.length < 1) {
                return await board.dieBird('errors.stackEmptyCannotDuplicate', bird)
            }
            const x = bird.stack.pop()
            if (x === undefined) {
                return await board.dieBird('errors.stackEmptyCannotDuplicate', bird)
            }
            await sleep(board.speed)
            bird.stack.push(x)
            await sleep(board.speed)
            bird.stack.push(x)
            await sleep(board.speed)
        },
        instructionClass: 'D',
    },
    SWAP: {
        symbol: '⎌',
        description: 'instructions.SWAP',
        async execute(bird: Bird, board: Board) {
            if (bird.stack.length < 2) {
                return await board.dieBird('errors.lessThanTwoNumbers', bird)
            }
            const x = bird.stack.pop()
            const y = bird.stack.pop()
            if (x === undefined || y === undefined) {
                return await board.dieBird('errors.lessThanTwoNumbers', bird)
            }
            await sleep(board.speed)
            bird.stack.push(x)
            await sleep(board.speed)
            bird.stack.push(y)
        },
        instructionClass: 'B',
    },
    YOLO: {
        symbol: '※',
        description: 'instructions.YOLO',
        async execute(bird: Bird) {
            const directions: Direction[] = ['up', 'down', 'left', 'right']
            bird.direction = directions[Math.floor(Math.random() * 4)] as Direction
        },
        instructionClass: 'D',
    },
    EMPT: {
        symbol: '⌿',
        description: 'instructions.EMPT',
        async execute(bird: Bird, board: Board) {
            if (bird.stack.length > 0) {
                bird.stack.push(0)
            } else {
                bird.stack.push(1)
            }
            await sleep(board.speed)
        },
        instructionClass: 'F',
    },
    VOID: {
        symbol: '⌽',
        description: 'instructions.VOID',
        async execute(bird: Bird, board: Board) {
            if (bird.stack.length < 1) {
                return await board.dieBird('errors.stackEmpty', bird)
            }
            bird.stack.pop()
            await sleep(board.speed)
        },
        instructionClass: 'F',
    },
    CLER: {
        symbol: '⌀',
        description: 'instructions.CLER',
        async execute(bird: Bird) {
            bird.stack = []
        },
        instructionClass: 'G',
    },
    SIZE: {
        symbol: '⍗',
        description: 'instructions.SIZE',
        async execute(bird: Bird, board: Board) {
            bird.stack.push(bird.stack.length)
            await sleep(board.speed)
        },
        instructionClass: 'G',
    },
    PLUS: {
        symbol: '⊕',
        description: 'instructions.PLUS',
        async execute(bird: Bird, board: Board) {
            if (bird.stack.length < 2) {
                return await board.dieBird('errors.lessThanTwoNumbers', bird)
            }
            const x = bird.stack.pop()
            const y = bird.stack.pop()
            if (x === undefined || y === undefined) {
                return await board.dieBird('errors.lessThanTwoNumbers', bird)
            }
            await sleep(board.speed)
            bird.stack.push(y + x)
            await sleep(board.speed)
        },
        instructionClass: 'B',
    },
    MINU: {
        symbol: '⊖',
        description: 'instructions.MINU',
        async execute(bird: Bird, board: Board) {
            if (bird.stack.length < 2) {
                return await board.dieBird('errors.lessThanTwoNumbers', bird)
            }
            const x = bird.stack.pop()
            const y = bird.stack.pop()
            if (x === undefined || y === undefined) {
                return await board.dieBird('errors.lessThanTwoNumbers', bird)
            }
            await sleep(board.speed)
            bird.stack.push(y - x)
            await sleep(board.speed)
        },
        instructionClass: 'B',
    },
    SUMA: {
        symbol: '∑',
        description: 'instructions.SUMA',
        async execute(bird: Bird, board: Board) {
            let sum = 0
            while (bird.stack.length > 0) {
                const popped = bird.stack.pop()
                if (popped !== undefined) {
                    sum += popped
                }
                await sleep(board.speed)
            }
            bird.stack.push(sum)
            await sleep(board.speed)
        },
        instructionClass: 'G',
    },
    BLCK: {
        symbol: '█',
        description: 'instructions.BLCK',
        async execute(bird: Bird, board: Board) {
            return await board.dieBird('errors.hitWall', bird)
        },
        instructionClass: 'Z',
    },
    GEQ1: {
        symbol: '⌥',
        description: 'instructions.GEQ1',
        async execute(bird: Bird, board: Board) {
            if (bird.stack.length < 1) {
                return await board.dieBird('errors.atLeastOneNumber', bird)
            }
            const x = bird.stack.pop()
            if (x === undefined) {
                return await board.dieBird('errors.atLeastOneNumber', bird)
            }
            await sleep(board.speed)
            if (x <= 0) {
                bird.direction = 'down'
            } else {
                bird.direction = 'right'
            }
        },
        instructionClass: 'D',
    },
    JMP1: {
        symbol: '⤼',
        description: 'instructions.JMP1',
        async execute(bird: Bird) {
            if (bird.x === null || bird.y === null) {
                return
            }
            if (bird.direction === 'down') {
                bird.y += 1
            } else if (bird.direction === 'up') {
                bird.y -= 1
            } else if (bird.direction === 'left') {
                bird.x -= 1
            } else if (bird.direction === 'right') {
                bird.x += 1
            }
        },
        instructionClass: 'C',
    },
    ADD1: {
        symbol: '++',
        description: 'instructions.ADD1',
        async execute(bird: Bird, board: Board) {
            if (bird.stack.length < 1) {
                return await board.dieBird('errors.atLeastOneNumber', bird)
            }
            const x = bird.stack.pop()
            if (x === undefined) {
                return await board.dieBird('errors.atLeastOneNumber', bird)
            }
            await sleep(board.speed)
            bird.stack.push(x + 1)
            await sleep(board.speed)
        },
        instructionClass: 'C',
    },
    SUB1: {
        symbol: '--',
        description: 'instructions.SUB1',
        async execute(bird: Bird, board: Board) {
            if (bird.stack.length < 1) {
                return await board.dieBird('errors.atLeastOneNumber', bird)
            }
            const x = bird.stack.pop()
            if (x === undefined) {
                return await board.dieBird('errors.atLeastOneNumber', bird)
            }
            await sleep(board.speed)
            bird.stack.push(x - 1)
            await sleep(board.speed)
        },
        instructionClass: 'C',
    },
    INSZ: {
        symbol: '⍗',
        description: 'instructions.INSZ',
        async execute(bird: Bird, board: Board) {
            bird.stack.push(board.input.length)
            await sleep(board.speed)
        },
        instructionClass: 'C',
    },
    DUP2: {
        symbol: 'ↂ',
        description: 'instructions.DUP2',
        async execute(bird: Bird, board: Board) {
            if (bird.stack.length < 2) {
                return await board.dieBird('errors.lessThanTwoNumbers', bird)
            }
            const x = bird.stack.pop()
            const y = bird.stack.pop()
            if (x === undefined || y === undefined) {
                return await board.dieBird('errors.lessThanTwoNumbers', bird)
            }
            await sleep(board.speed)
            bird.stack.push(y)
            await sleep(board.speed)
            bird.stack.push(x)
            await sleep(board.speed)
            bird.stack.push(y)
            await sleep(board.speed)
            bird.stack.push(x)
            await sleep(board.speed)
        },
        instructionClass: 'D',
    },
    ROT1: {
        symbol: '⮃',
        description: 'instructions.ROT1',
        async execute(bird: Bird, board: Board) {
            if (bird.stack.length < 2) {
                return await board.dieBird('errors.lessThanTwoNumbers', bird)
            }
            const x = bird.stack.pop()
            const y = bird.stack.pop()
            if (x === undefined || y === undefined) {
                return await board.dieBird('errors.lessThanTwoNumbers', bird)
            }
            await sleep(board.speed)
            bird.stack.push(x)
            await sleep(board.speed)
            bird.stack.push(y)
            await sleep(board.speed)
        },
        instructionClass: 'C',
    },
    PRTI: {
        symbol: '⬯',
        description: 'instructions.PRTI',
        async execute(bird: Bird, board: Board) {
            const foundPortals = board.boardObjects.filter((bo) => bo.name === 'PRTO')
            if (foundPortals.length > 1) {
                return await board.dieBird('errors.multipleBluePortals', bird)
            }
            if (foundPortals.length < 1) {
                return await board.dieBird('errors.noBluePortal', bird)
            }
            const portal = foundPortals[0]
            if (portal) {
                bird.x = portal.x
                bird.y = portal.y
            }
            return 'SKIP'
        },
        instructionClass: 'A2',
    },
    PRTO: {
        symbol: '⬯',
        description: 'instructions.PRTO',
        async execute(bird: Bird, board: Board) {
            const foundPortals = board.boardObjects.filter((bo) => bo.name === 'PRTI')
            if (foundPortals.length > 1) {
                return await board.dieBird('errors.multipleOrangePortals', bird)
            }
            if (foundPortals.length < 1) {
                return await board.dieBird('errors.noOrangePortal', bird)
            }
            const portal = foundPortals[0]
            if (portal) {
                bird.x = portal.x
                bird.y = portal.y
            }
            return 'SKIP'
        },
        instructionClass: 'A1',
    },
    DUMP: {
        symbol: '⬚', // bootstrap icons mailbox
        description: 'instructions.DUMP',
        async execute(bird: Bird, board: Board, boardObject: Tile) {
            if (boardObject.state === null || typeof boardObject.state === 'undefined') {
                if (bird.stack.length === 0) {
                    return await board.dieBird('errors.atLeastOneNumber', bird)
                }
                const popped = bird.stack.pop()
                if (popped !== undefined) {
                    boardObject.state = popped
                }
            } else {
                bird.stack.push(boardObject.state)
                boardObject.state = null
            }
        },
        instructionClass: 'D',
    },
    SPWN: {
        symbol: 'x',
        description: 'instructions.SPWN',
        async execute(bird: Bird, board: Board) {
            board.spawnBird()
        },
        instructionClass: 'D',
    },
    WAIT: {
        symbol: 'bi-stopwatch',
        description: 'instructions.WAIT',
        async execute(bird: Bird, board: Board, boardObject: Tile) {
            if (!Object.prototype.hasOwnProperty.call(boardObject, 'state')) {
                throw new Error('Wait needs state to be defined')
            }
            if (
                !boardObject.initialWait &&
                boardObject.state !== null &&
                boardObject.state !== undefined
            ) {
                boardObject.initialWait = boardObject.state
            }
            if (
                boardObject.state === null ||
                boardObject.state === undefined ||
                boardObject.state <= 0
            ) {
                if (boardObject.initialWait !== undefined) {
                    boardObject.state = boardObject.initialWait
                }
            } else {
                boardObject.state -= 1
                return 'NOMOVE'
            }
        },
        instructionClass: 'D',
    },
    NOTE: {
        symbol: 'bi-bell',
        description: 'instructions.NOTE',
        async execute() {
            //play a middle 'C' for the duration of an 8th note
            const synthInstance = await getSynth()
            synthInstance.triggerAttackRelease('C4', '8n')
        },
        instructionClass: 'D',
    },
}
