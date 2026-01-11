// @ts-nocheck
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

let synth: any = null
let Tone: any = null

async function getSynth(): Promise<any> {
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

export default {
    STRT: {
        symbol: '○', // maybe ⌂
        description: 'Initial position of the bird, bird starts going to the right.',
        async execute() {},
    },
    FINI: {
        symbol: '◍',
        description: 'Finishes this round',
        async execute(bird: any, board: any) {
            if (board.selectedTestCase) {
                const expected = toRaw(board.selectedTestCase.finalStack || [])
                const stack = toRaw(bird.stack).slice().reverse()
                if (isEqual(expected, stack)) {
                    await board.finish()
                    return 'NOMOVE'
                } else {
                    await board.dieBird(
                        'You did not finish with the expected result on the stack',
                        bird,
                    )
                }
            } else {
                await board.finish()
                return 'NOMOVE'
            }
        },
    },
    UPWD: {
        symbol: '▲',
        description: 'Go UP',
        async execute(bird: any) {
            bird.direction = 'up'
        },
    },
    DOWN: {
        symbol: '▼',
        description: 'Go DOWN',
        async execute(bird: any) {
            bird.direction = 'down'
        },
    },
    LEFT: {
        symbol: '◀',
        description: 'Go LEFT',
        async execute(bird: any) {
            bird.direction = 'left'
        },
    },
    RGHT: {
        symbol: '▶',
        description: 'Go RIGHT',
        async execute(bird: any) {
            bird.direction = 'right'
        },
    },
    REVR: {
        symbol: '↺',
        description: 'Revert the direction of the bird',
        async execute(bird: any) {
            const rev: Record<string, string> = {
                up: 'down',
                left: 'right',
                right: 'left',
                down: 'up',
            }
            bird.direction = rev[bird.direction]
        },
        instructionClass: 'B',
    },
    READ: {
        symbol: '⌬',
        description: 'Read a number input onto the stack',
        async execute(bird: any, board) {
            if (board.input.length == 0) {
                return await board.dieBird('There are no more numbers to read', bird)
            }
            const input = toRaw(board.input.shift())
            bird.stack.push(input)
            await sleep(board.speed)
        },
        instructionClass: 'C',
    },
    DUP1: {
        symbol: 'ↀ',
        description: 'Duplicate the last number on the stack',
        async execute(bird: any, board) {
            if (bird.stack.length < 1) {
                return await board.dieBird(
                    'The stack is empty, can not duplicate the last number.',
                    bird,
                )
            }
            const x = bird.stack.pop()
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
        description: 'Swap the top two numbers on the stack',
        async execute(bird: any, board) {
            if (bird.stack.length < 2) {
                return await board.dieBird('There are less than two numbers on the stack', bird)
            }
            const x = bird.stack.pop()
            await sleep(board.speed)
            const y = bird.stack.pop()
            await sleep(board.speed)
            bird.stack.push(x)
            await sleep(board.speed)
            bird.stack.push(y)
        },
        instructionClass: 'B',
    },
    YOLO: {
        symbol: '※',
        description: 'Go into a random direction',
        async execute(bird: any) {
            const directions = ['up', 'down', 'left', 'right']
            bird.direction = directions[Math.floor(Math.random() * 4)]
        },
        instructionClass: 'D',
    },
    EMPT: {
        symbol: '⌿',
        description: 'Check if the stack is empty',
        async execute(bird: any, board) {
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
        description: 'Clear the top item on the stack',
        async execute(bird: any, board) {
            if (bird.stack.length < 1) {
                return await board.dieBird('The stack is empty', bird)
            }
            bird.stack.pop()
            await sleep(board.speed)
        },
        instructionClass: 'F',
    },
    CLER: {
        symbol: '⌀',
        description: 'Clear the stack',
        async execute(bird: any) {
            bird.stack = []
        },
        instructionClass: 'G',
    },
    SIZE: {
        symbol: '⍗',
        description: 'Return the amount of items on the stack',
        async execute(bird: any, board) {
            bird.stack.push(bird.stack.length)
            await sleep(board.speed)
        },
        instructionClass: 'G',
    },
    PLUS: {
        symbol: '⊕',
        description: 'Add the top two numbers on the stack',
        async execute(bird: any, board) {
            if (bird.stack.length < 2) {
                return await board.dieBird('There are less than two numbers on the stack', bird)
            }
            const x = bird.stack.pop()
            await sleep(board.speed)
            const y = bird.stack.pop()
            await sleep(board.speed)
            bird.stack.push(y + x)
            await sleep(board.speed)
        },
        instructionClass: 'B',
    },
    MINU: {
        symbol: '⊖',
        description: 'Subtract the top item from the stack from the number below',
        async execute(bird: any, board) {
            if (bird.stack.length < 2) {
                return await board.dieBird('There are less than two numbers on the stack', bird)
            }
            const x = bird.stack.pop()
            await sleep(board.speed)
            const y = bird.stack.pop()
            await sleep(board.speed)
            bird.stack.push(y - x)
            await sleep(board.speed)
        },
        instructionClass: 'B',
    },
    SUMA: {
        symbol: '∑',
        description: 'Sum all the items on the stack',
        async execute(bird: any, board) {
            let sum = 0
            while (bird.stack.length > 0) {
                sum += bird.stack.pop()
                await sleep(board.speed)
            }
            bird.stack.push(sum)
            await sleep(board.speed)
        },
        instructionClass: 'G',
    },
    BLCK: {
        symbol: '█',
        description: "Don't hit this block, it will kill you",
        async execute(bird: any, board) {
            return await board.dieBird('You hit a wall', bird)
        },
        instructionClass: 'Z',
    },
    GEQ1: {
        symbol: '⌥',
        description: 'Go right if the number is 1 or greater, if not, go down',
        async execute(bird: any, board) {
            if (bird.stack.length < 1) {
                return await board.dieBird('There should be at least one number on the stack', bird)
            }
            const x = bird.stack.pop()
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
        description: 'Jump over the next block',
        async execute(bird: any) {
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
        description: 'Add 1 to the first number on the stack',
        async execute(bird: any, board) {
            if (bird.stack.length < 1) {
                return await board.dieBird('There should be at least one number on the stack', bird)
            }
            let x = bird.stack.pop()
            await sleep(board.speed)
            x += 1
            bird.stack.push(x)
            await sleep(board.speed)
        },
        instructionClass: 'C',
    },
    SUB1: {
        symbol: '--',
        description: 'Reduce the first number on the stack by one',
        async execute(bird: any, board) {
            if (bird.stack.length < 1) {
                return await board.dieBird('There should be at least one number on the stack', bird)
            }
            let x = bird.stack.pop()
            await sleep(board.speed)
            x -= 1
            bird.stack.push(x)
            await sleep(board.speed)
        },
        instructionClass: 'C',
    },
    INSZ: {
        symbol: '⍗',
        description: 'Get the amount of items still in the input queue.',
        async execute(bird: any, board) {
            bird.stack.push(board.input.length)
            await sleep(board.speed)
        },
        instructionClass: 'C',
    },
    DUP2: {
        symbol: 'ↂ',
        description: 'Copy the last two numbers on the stack again.',
        async execute(bird: any, board) {
            if (bird.stack.length < 2) {
                return await board.dieBird('There are less than two numbers on the stack', bird)
            }
            const x = bird.stack.pop()
            await sleep(board.speed)
            const y = bird.stack.pop()
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
        description: 'Swap the top two numbers in the stack.',
        async execute(bird: any, board) {
            if (bird.stack.length < 2) {
                return await board.dieBird('There are less than two numbers on the stack', bird)
            }
            const x = bird.stack.pop()
            await sleep(board.speed)
            const y = bird.stack.pop()
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
        description: 'Teleport to the blue portal',
        async execute(bird: any, board) {
            const foundPortals = board.boardObjects.filter((bo) => bo.name === 'PRTO')
            if (foundPortals.length > 1) {
                return await board.dieBird('Found more than one blue portal.', bird)
            }
            if (foundPortals.length < 1) {
                return await board.dieBird('Did not find a blue portal.', bird)
            }
            bird.x = foundPortals[0].x
            bird.y = foundPortals[0].y
            return 'SKIP'
        },
        instructionClass: 'A2',
    },
    PRTO: {
        symbol: '⬯',
        description: 'Teleport to the orange portal',
        async execute(bird: any, board) {
            const foundPortals = board.boardObjects.filter((bo) => bo.name === 'PRTI')
            if (foundPortals.length > 1) {
                return await board.dieBird('Found more than one orange portal.', bird)
            }
            if (foundPortals.length < 1) {
                return await board.dieBird('Did not find a orange portal.', bird)
            }
            bird.x = foundPortals[0].x
            bird.y = foundPortals[0].y
            return 'SKIP'
        },
        instructionClass: 'A1',
    },
    DUMP: {
        symbol: '⬚', // bootstrap icons mailbox
        description: 'Dump an item from the stack, or pick it up.',
        async execute(bird: any, board, boardObject) {
            if (boardObject.state === null || typeof boardObject.state === 'undefined') {
                if (bird.stack.length === 0) {
                    return await board.dieBird(
                        'There should be at least one number on the stack',
                        bird,
                    )
                }
                boardObject.state = bird.stack.pop()
            } else {
                bird.stack.push(boardObject.state)
                boardObject.state = null
            }
        },
        instructionClass: 'D',
    },
    SPWN: {
        symbol: 'x',
        description: 'Spawn an additional bird',
        async execute(bird: any, board) {
            board.spawnBird()
        },
        instructionClass: 'D',
    },
    WAIT: {
        symbol: 'bi-stopwatch',
        description: 'Wait for some time',
        async execute(bird: any, board, boardObject) {
            if (!Object.prototype.hasOwnProperty.call(boardObject, 'state')) {
                throw new Error('Wait needs state to be defined')
            }
            if (!boardObject.initialWait) {
                boardObject.initialWait = boardObject.state
            }
            if (boardObject.state <= 0) {
                boardObject.state = boardObject.initialWait
            } else {
                boardObject.state -= 1
                return 'NOMOVE'
            }
        },
        instructionClass: 'D',
    },
    NOTE: {
        symbol: 'bi-bell',
        description: 'Make a sound',
        async execute() {
            //play a middle 'C' for the duration of an 8th note
            const synthInstance = await getSynth()
            synthInstance.triggerAttackRelease('C4', '8n')
        },
        instructionClass: 'D',
    },
}
