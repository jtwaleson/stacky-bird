import { defineStore } from 'pinia'
import { toRaw } from 'vue'

const languageCode = localStorage.getItem('language') || 'en'

type Direction = 'up' | 'down' | 'left' | 'right'

interface Instruction {
    name?: string
    symbol: string
    description: string
    execute?: unknown
    instructionClass?: string
    outgoingDirections?: Direction[]
    [key: string]: unknown
}

export type Speed = 'play' | 'fast' | 'turbo'

export interface LevelStats {
    cycles: number
    blocksUsed: number
    maxConcurrency: number
}

export interface Level {
    name: string
    completed?: boolean
    displayName?: string
    description?: string
    hint?: string
    unlocksInstructions?: string[]
    unlocksLevels?: string[]
    unlocksSpeed?: Speed
    stats?: LevelStats
    [key: string]: unknown
}

export const useStore = defineStore('main', {
    state: () => ({
        instructions: {} as Record<string, Instruction>,
        levels: {} as Record<string, Level>,
        locale: languageCode,
        levelStats: {} as Record<string, LevelStats>,
    }),
    getters: {
        languages() {
            return {
                en: 'English',
                nl: 'Nederlands',
                es: 'Español',
            }
        },
        completedLevels(state): Level[] {
            const result: Level[] = []
            for (const level of Object.values(state.levels)) {
                if (level.completed) {
                    result.push(level)
                }
            }
            return result
        },
        availableInstructionsMap(): Record<string, Instruction> {
            const result: Record<string, Instruction> = {}
            const completedLevels = this.completedLevels
            for (const level of completedLevels) {
                for (const instructionCode of level.unlocksInstructions || []) {
                    const instruction = this.instructions[instructionCode]
                    if (instruction) {
                        result[instructionCode] = instruction
                    }
                }
            }
            return result
        },
        availableInstructions(): Instruction[] {
            return Object.values(this.availableInstructionsMap)
        },
        availableLevels(): Level[] {
            const result: Record<string, Level> = {}
            if (this.levels['0001'] && !this.levels['0001']?.completed) {
                result['0001'] = this.levels['0001']
            }
            const completedLevels = this.completedLevels
            for (const level of completedLevels) {
                if (level && level.unlocksLevels) {
                    for (const unlocksLevelCode of level.unlocksLevels) {
                        const unlocksLevel = this.levels[unlocksLevelCode]
                        if (unlocksLevel && !unlocksLevel.completed) {
                            result[unlocksLevelCode] = unlocksLevel
                        }
                    }
                }
            }
            return Object.values(result).filter((level) => level !== undefined && level !== null)
        },
        unavailableButReachableInstructions(): Instruction[] {
            const result: Instruction[] = []
            const availableLevels = this.availableLevels
            for (const level of availableLevels) {
                for (const instructionName of level.unlocksInstructions || []) {
                    const instruction = this.instructions[instructionName]
                    if (
                        instruction &&
                        instruction.name &&
                        !(instruction.name in this.availableInstructionsMap)
                    ) {
                        result.push(instruction)
                    }
                }
            }
            return result
        },
        availableSpeeds(): Speed[] {
            const speeds: Speed[] = []
            const completedLevels = this.completedLevels
            for (const level of completedLevels) {
                if (level.unlocksSpeed && !speeds.includes(level.unlocksSpeed)) {
                    speeds.push(level.unlocksSpeed)
                }
            }
            return speeds
        },
        unavailableButReachableSpeed(): Speed | null {
            const availableLevels = this.availableLevels
            const availableSpeeds = this.availableSpeeds
            for (const level of availableLevels) {
                if (level.unlocksSpeed && !availableSpeeds.includes(level.unlocksSpeed)) {
                    return level.unlocksSpeed
                }
            }
            return null
        },
    },
    actions: {
        registerInstruction(instruction: Instruction) {
            if (!instruction.name) {
                throw new Error('Instruction must have a name')
            }
            if (instruction.name in this.instructions) {
                throw new Error(`instruction ${instruction.name} is already registered`)
            }
            this.instructions[instruction.name] = instruction
        },
        setLanguage(languageCode: string) {
            this.locale = languageCode
            localStorage.setItem('language', languageCode)
        },
        registerLevel(level: Level) {
            if (level.name in this.levels) {
                throw new Error(`level ${level.name} is already registered`)
            }

            let completedLevels: string[] = []
            try {
                const stored = localStorage.getItem('completedLevels')
                if (stored) {
                    completedLevels = JSON.parse(stored)
                }
            } catch (e) {
                // If localStorage is corrupted, clear it and start fresh
                console.warn('Failed to parse completedLevels from localStorage, clearing it', e)
                localStorage.removeItem('completedLevels')
            }

            // Load level stats
            try {
                const stored = localStorage.getItem('levelStats')
                if (stored) {
                    this.levelStats = JSON.parse(stored)
                }
            } catch (e) {
                console.warn('Failed to parse levelStats from localStorage, clearing it', e)
                localStorage.removeItem('levelStats')
            }

            this.levels[level.name] = {
                ...level,
                completed: completedLevels.indexOf(level.name) > -1,
                stats: this.levelStats[level.name],
            }
        },
        completeLevel({ levelName, isCompleted }: { levelName: string; isCompleted: boolean }) {
            if (!(levelName in this.levels)) {
                throw new Error(`level ${levelName} not found, can not unlock`)
            }
            const level = this.levels[levelName]
            if (level) {
                level.completed = toRaw(isCompleted)
            }
            const completedLevels: string[] = []
            for (const level of Object.values(this.levels)) {
                if (level.completed && level.name) {
                    completedLevels.push(level.name)
                }
            }
            localStorage.setItem('completedLevels', JSON.stringify(completedLevels))
        },
        saveLevelStats({ levelName, stats }: { levelName: string; stats: LevelStats }) {
            if (!(levelName in this.levels)) {
                throw new Error(`level ${levelName} not found, can not save stats`)
            }

            // Only save if this is better than existing stats or first time
            const existingStats = this.levelStats[levelName]
            if (
                !existingStats ||
                stats.cycles < existingStats.cycles ||
                stats.blocksUsed < existingStats.blocksUsed
            ) {
                this.levelStats[levelName] = stats
                const level = this.levels[levelName]
                if (level) {
                    level.stats = stats
                }
                localStorage.setItem('levelStats', JSON.stringify(this.levelStats))
            }
        },
    },
})
