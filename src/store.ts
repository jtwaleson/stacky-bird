import { defineStore } from 'pinia';
import { toRaw } from 'vue';

let languageCode = localStorage.getItem("language") || "en";

export const useStore = defineStore('main', {
    state: () => ({
        instructions: {} as Record<string, any>,
        levels: {} as Record<string, any>,
        locale: languageCode,
    }),
    getters: {
        languages() {
            return {
                en: "English",
                nl: "Nederlands",
            };
        },
        completedLevels(state) {
            let result = [];
            for (const level of Object.values(state.levels)) {
                if (level.completed) {
                    result.push(level);
                }
            }
            return result;
        },
        availableInstructionsMap(): Record<string, any> {
            let result: Record<string, any> = {};
            const completedLevels = this.completedLevels;
            for (let level of completedLevels) {
                for (let instructionCode of level.unlocksInstructions || []) {
                    result[instructionCode] = this.instructions[instructionCode];
                }
            }
            return result;
        },
        availableInstructions(): any[] {
            return Object.values(this.availableInstructionsMap);
        },
        availableLevels(): any[] {
            let result: Record<string, any> = {};
            if (!this.levels["0001"]?.completed) {
                result["0001"] = this.levels["0001"];
            }
            const completedLevels = this.completedLevels;
            for (let level of completedLevels) {
                for (let unlocksLevelCode of level.unlocksLevels) {
                    let unlocksLevel = this.levels[unlocksLevelCode];
                    if (unlocksLevel && !unlocksLevel.completed) {
                        result[unlocksLevelCode] = unlocksLevel;
                    }
                }
            }
            return Object.values(result);
        },
        unavailableButReachableInstructions(): any[] {
            let result: any[] = [];
            const availableLevels = this.availableLevels;
            for (const level of availableLevels) {
                for (const instructionName of level.unlocksInstructions) {
                    const instruction = this.instructions[instructionName];
                    if (!(instruction.name in this.availableInstructionsMap)) {
                        result.push(instruction);
                    }
                }
            }
            return result;
        },
    },
    actions: {
        registerInstruction(instruction: any) {
            if (instruction.name in this.instructions) {
                throw new Error(`instruction ${instruction.name} is already registered`);
            }
            this.instructions[instruction.name] = instruction;
        },
        setLanguage(languageCode: string) {
            this.locale = languageCode;
            localStorage.setItem("language", languageCode);
        },
        registerLevel(level: any) {
            if (level.name in this.levels) {
                throw new Error(`level ${level.name} is already registered`);
            }

            let completedLevels = JSON.parse(localStorage.getItem("completedLevels") || "[]");

            this.levels[level.name] = {
                ...level,
                completed: completedLevels.indexOf(level.name) > -1,
            };
        },
        completeLevel({levelName, isCompleted}: {levelName: string, isCompleted: boolean}) {
            if (!(levelName in this.levels)) {
                throw new Error(`level ${levelName} not found, can not unlock`);
            }
            this.levels[levelName].completed = toRaw(isCompleted);
            let completedLevels = [];
            for (let level of Object.values(this.levels)) {
                if (level.completed) {
                    completedLevels.push(level.name);
                }
            }
            localStorage.setItem("completedLevels", JSON.stringify(completedLevels));
        },
    },
})
