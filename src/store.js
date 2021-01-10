import { createStore } from 'vuex'

let languageCode = localStorage.getItem("language") || "en";

export default createStore({
    state: {
        instructions: {},
        levels: {},
        locale: languageCode,
    },
    mutations: {
        registerInstruction(state, instruction) {
            if (instruction.name in state.instructions) {
                throw new Error(`instruction ${instruction.name} is already registered`);
            }
            state.instructions[instruction.name] = instruction;
        },
        setLanguage(state, languageCode) {
            state.locale = languageCode;
            localStorage.setItem("language", languageCode);
        },
        registerLevel (state, level) {
            if (level.name in state.levels) {
                throw new Error(`level ${level.name} is already registered`);
            }

            let completedLevels = localStorage.getItem("completedLevels") || [];

            state.levels[level.name] = {
                ...level,
                completed: completedLevels.indexOf(level.name) > -1,
            };
        },
        completeLevel(state, levelName) {
            if (!(levelName in state.levels)) {
                throw new Error(`level ${levelName} not found, can not unlock`);
            }
            state.levels[levelName].completed = true;
            let completedLevels = [];
            for (let level of Object.values(state.levels)) {
                if (level.completed) {
                    completedLevels.push(level.name);
                }
            }
            localStorage.setItem("completedLevels", completedLevels);
        },
    },
    getters: {
        languages() {
            return {
                en: "English",
                nl: "Nederlands",
            };
        },
        availableLevels(state, getters) {
            let result = {};
            for (let level of getters.completedLevels) {
                for (let unlocksLevelCode of level.unlocksLevels) {
                    let unlocksLevel = state.levels[unlocksLevelCode];
                    if (unlocksLevel && !unlocksLevel.completed) {
                        result[unlocksLevelCode] = unlocksLevel;
                    }
                }
            }
            return Object.values(result);
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
        availableInstructions(state, getters) {
            let result = {};
            for (let level of getters.completedLevels) {
                for (let instructionCode of level.unlocksInstructions || []) {
                    result[instructionCode] = state.instructions[instructionCode];
                }
            }
            return Object.values(result);
        },
        unavailableButReachableInstructions(state, getters) {
            let result = [];
            for (const level of getters.availableLevels) {
                for (const instructionName of level.unlocksInstructions) {
                    const instruction = state.instructions[instructionName];
                    if (!instruction.unlocked) {
                        result.push(instruction);
                    }
                }
            }
            return result;
        },
    },
    actions: {
    },
    modules: {
    }
})
