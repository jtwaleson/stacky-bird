// 8-bit sound effects system using Tone.js
import * as Tone from 'tone'

let initialized = false
let synth: Tone.Synth | null = null
let noiseSynth: Tone.NoiseSynth | null = null
let membraneSynth: Tone.MembraneSynth | null = null

// Initialize audio context and synthesizers
async function initAudio() {
    if (initialized) return

    // Resume audio context if suspended (browser requirement)
    if (Tone.context.state === 'suspended') {
        await Tone.context.resume()
    }

    // Create synthesizers for different sound types
    synth = new Tone.Synth({
        oscillator: { type: 'square' }, // 8-bit square wave
        envelope: {
            attack: 0.005,
            decay: 0.1,
            sustain: 0.3,
            release: 0.1,
        },
    }).toDestination()

    noiseSynth = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: {
            attack: 0.001,
            decay: 0.1,
            sustain: 0,
        },
    }).toDestination()

    membraneSynth = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 4,
        oscillator: { type: 'square' },
        envelope: {
            attack: 0.001,
            decay: 0.2,
            sustain: 0,
        },
    }).toDestination()

    initialized = true
}

// Ensure audio is initialized before playing
async function ensureAudio() {
    if (!initialized) {
        await initAudio()
    }
}

// Stack operations
export async function playSoundStackPush() {
    await ensureAudio()
    synth?.triggerAttackRelease('C5', '0.1', Tone.now())
}

export async function playSoundStackPop() {
    await ensureAudio()
    synth?.triggerAttackRelease('G4', '0.1', Tone.now())
}

export async function playSoundStackSwap() {
    await ensureAudio()
    synth?.triggerAttackRelease('D5', '0.05', Tone.now())
    synth?.triggerAttackRelease('A4', '0.05', Tone.now() + 0.05)
}

export async function playSoundStackDuplicate() {
    await ensureAudio()
    synth?.triggerAttackRelease('E5', '0.08', Tone.now())
    synth?.triggerAttackRelease('E5', '0.08', Tone.now() + 0.08)
}

export async function playSoundStackClear() {
    await ensureAudio()
    // Descending sweep
    synth?.triggerAttackRelease('G5', '0.05', Tone.now())
    synth?.triggerAttackRelease('E5', '0.05', Tone.now() + 0.05)
    synth?.triggerAttackRelease('C5', '0.05', Tone.now() + 0.1)
    synth?.triggerAttackRelease('G4', '0.1', Tone.now() + 0.15)
}

// Block/tile operations
export async function playSoundBlockPlace() {
    await ensureAudio()
    // Play a happy upward arpeggio (C major chord)
    synth?.triggerAttackRelease('C5', '0.08', Tone.now())
    synth?.triggerAttackRelease('E5', '0.08', Tone.now() + 0.04)
    synth?.triggerAttackRelease('G5', '0.12', Tone.now() + 0.08)
}

export async function playSoundBlockRemove() {
    await ensureAudio()
    synth?.triggerAttackRelease('F4', '0.06', Tone.now())
}

export async function playSoundBlockMove() {
    await ensureAudio()
    noiseSynth?.triggerAttackRelease('0.03')
}

// Direction changes
export async function playSoundDirection() {
    await ensureAudio()
    synth?.triggerAttackRelease('A4', '0.05', Tone.now())
}

// YOLO - chaotic whirlwind sound
export async function playSoundYolo() {
    await ensureAudio()
    // Random chaotic sequence - fast ascending and descending
    synth?.triggerAttackRelease('E5', '0.03', Tone.now())
    synth?.triggerAttackRelease('C4', '0.03', Tone.now() + 0.03)
    synth?.triggerAttackRelease('G5', '0.03', Tone.now() + 0.06)
    synth?.triggerAttackRelease('D4', '0.03', Tone.now() + 0.09)
    synth?.triggerAttackRelease('A5', '0.03', Tone.now() + 0.12)
    synth?.triggerAttackRelease('F4', '0.04', Tone.now() + 0.15)
    noiseSynth?.triggerAttackRelease('0.05', Tone.now() + 0.19)
}

// Math operations
export async function playSoundMath() {
    await ensureAudio()
    synth?.triggerAttackRelease('D5', '0.08', Tone.now())
    synth?.triggerAttackRelease('F5', '0.08', Tone.now() + 0.08)
}

// Read operation
export async function playSoundRead() {
    await ensureAudio()
    synth?.triggerAttackRelease('A5', '0.12', Tone.now())
}

// Portal/teleport
export async function playSoundPortal() {
    await ensureAudio()
    synth?.triggerAttackRelease('C6', '0.05', Tone.now())
    synth?.triggerAttackRelease('G5', '0.05', Tone.now() + 0.05)
    synth?.triggerAttackRelease('E5', '0.1', Tone.now() + 0.1)
}

// Jump
export async function playSoundJump() {
    await ensureAudio()
    // Upward sweep
    synth?.triggerAttackRelease('C4', '0.08', Tone.now())
    synth?.triggerAttackRelease('G4', '0.12', Tone.now() + 0.08)
}

// Conditional (branch)
export async function playSoundConditional() {
    await ensureAudio()
    synth?.triggerAttackRelease('E4', '0.05', Tone.now())
    synth?.triggerAttackRelease('B4', '0.05', Tone.now() + 0.05)
}

// Dump (storage)
export async function playSoundDump() {
    await ensureAudio()
    membraneSynth?.triggerAttackRelease('C3', '0.15', Tone.now())
}

// Spawn
export async function playSoundSpawn() {
    await ensureAudio()
    synth?.triggerAttackRelease('C5', '0.05', Tone.now())
    synth?.triggerAttackRelease('E5', '0.05', Tone.now() + 0.05)
    synth?.triggerAttackRelease('G5', '0.1', Tone.now() + 0.1)
}

// Speed button clicks
export async function playSoundSpeedStep() {
    await ensureAudio()
    synth?.triggerAttackRelease('C4', '0.08', Tone.now())
}

export async function playSoundSpeedPlay() {
    await ensureAudio()
    synth?.triggerAttackRelease('E4', '0.05', Tone.now())
    synth?.triggerAttackRelease('G4', '0.08', Tone.now() + 0.05)
}

export async function playSoundSpeedFast() {
    await ensureAudio()
    synth?.triggerAttackRelease('G4', '0.04', Tone.now())
    synth?.triggerAttackRelease('C5', '0.08', Tone.now() + 0.04)
}

export async function playSoundSpeedTurbo() {
    await ensureAudio()
    synth?.triggerAttackRelease('C5', '0.03', Tone.now())
    synth?.triggerAttackRelease('E5', '0.03', Tone.now() + 0.03)
    synth?.triggerAttackRelease('G5', '0.06', Tone.now() + 0.06)
}

// Death/error
export async function playSoundDeath() {
    await ensureAudio()
    // Descending dramatic sound
    synth?.triggerAttackRelease('E5', '0.1', Tone.now())
    synth?.triggerAttackRelease('D5', '0.1', Tone.now() + 0.1)
    synth?.triggerAttackRelease('C5', '0.1', Tone.now() + 0.2)
    synth?.triggerAttackRelease('B4', '0.1', Tone.now() + 0.3)
    synth?.triggerAttackRelease('A4', '0.15', Tone.now() + 0.4)
    noiseSynth?.triggerAttackRelease('0.2', Tone.now() + 0.5)
}

// Level completion
export async function playSoundLevelComplete() {
    await ensureAudio()
    // Victory fanfare
    synth?.triggerAttackRelease('C5', '0.15', Tone.now())
    synth?.triggerAttackRelease('E5', '0.15', Tone.now() + 0.15)
    synth?.triggerAttackRelease('G5', '0.15', Tone.now() + 0.3)
    synth?.triggerAttackRelease('C6', '0.3', Tone.now() + 0.45)
}

// Start/finish tiles
export async function playSoundStart() {
    await ensureAudio()
    // Exciting startup fanfare - ascending arpeggio
    synth?.triggerAttackRelease('C4', '0.08', Tone.now())
    synth?.triggerAttackRelease('E4', '0.08', Tone.now() + 0.08)
    synth?.triggerAttackRelease('G4', '0.08', Tone.now() + 0.16)
    synth?.triggerAttackRelease('C5', '0.12', Tone.now() + 0.24)
    synth?.triggerAttackRelease('E5', '0.12', Tone.now() + 0.36)
    synth?.triggerAttackRelease('G5', '0.2', Tone.now() + 0.48)
}

export async function playSoundFinish() {
    await ensureAudio()
    synth?.triggerAttackRelease('G5', '0.1', Tone.now())
    synth?.triggerAttackRelease('C6', '0.2', Tone.now() + 0.1)
}

// Utility to get sound for specific instruction
export async function playSoundForInstruction(instructionName: string) {
    switch (instructionName) {
        // Stack operations
        case 'DUP1':
        case 'DUP2':
            await playSoundStackDuplicate()
            break
        case 'SWAP':
        case 'ROT1':
            await playSoundStackSwap()
            break
        case 'VOID':
            await playSoundStackPop()
            break
        case 'CLER':
            await playSoundStackClear()
            break

        // Math operations
        case 'PLUS':
        case 'MINU':
        case 'ADD1':
        case 'SUB1':
        case 'SUMA':
        case 'SUMN':
            await playSoundMath()
            break

        // Direction changes
        case 'UPWD':
        case 'DOWN':
        case 'LEFT':
        case 'RGHT':
        case 'REVR':
            await playSoundDirection()
            break
        case 'YOLO':
            await playSoundYolo()
            break

        // I/O
        case 'READ':
            await playSoundRead()
            break

        // Special operations
        case 'PRTI':
        case 'PRTO':
            await playSoundPortal()
            break
        case 'JMP1':
            await playSoundJump()
            break
        case 'GEQ1':
        case 'FLP2':
        case 'FLP3':
        case 'FLP4':
            await playSoundConditional()
            break
        case 'DUMP':
            await playSoundDump()
            break
        case 'SPWN':
            await playSoundSpawn()
            break
        case 'STRT':
            await playSoundStart()
            break
        case 'FINI':
            await playSoundFinish()
            break

        // Sorting/reversing
        case 'SRT2':
        case 'SRTN':
        case 'SRTA':
        case 'REVA':
        case 'REVN':
            await playSoundStackSwap()
            break

        // Checks
        case 'EMPT':
        case 'SIZE':
        case 'INSZ':
            await playSoundRead()
            break

        default:
            // Generic beep for unknown instructions
            await playSoundBlockPlace()
            break
    }
}
