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

export interface Level {
    name: string
    completed?: boolean
    displayName?: string
    description?: string
    unlocksInstructions?: string[]
    unlocksLevels?: string[]
    [key: string]: unknown
}

export const useStore = defineStore('main', {
    state: () => ({
        instructions: {} as Record<string, Instruction>,
        levels: {} as Record<string, Level>,
        locale: languageCode,
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

            const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]')

            this.levels[level.name] = {
                ...level,
                completed: completedLevels.indexOf(level.name) > -1,
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
    },
})
