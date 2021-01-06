import { createStore } from 'vuex'

let languageCode = localStorage.getItem("language") || "en";

export default createStore({
    state: {
        appMode: 'menu',
        instructions: {},
        levels: {},
        level: null,
        locale: languageCode,
    },
    mutations: {
        registerInstruction(state, instruction) {
            if (instruction.name in state.instructions) {
                throw new Error(`instruction ${instruction.name} is already registered`);
            }

            let unlockedInstructions = localStorage.getItem("unlockedInstructions") || [];

            instruction.unlocked = unlockedInstructions.indexOf(instruction.name) > -1;
            state.instructions[instruction.name] = instruction;
        },
        unlockInstruction(state, instructionName) {
            if (!(instructionName in state.instructions)) {
                throw new Error(`instruction ${instructionName} not found, can not unlock`);
            }
            state.instructions[instructionName].unlocked = true;
            let unlockedInstructions = [];
            for (let instruction of Object.values(state.instructions)) {
                if (instruction.unlocked) {
                    unlockedInstructions.push(instruction.name);
                }
            }
            localStorage.setItem("unlockedInstructions", unlockedInstructions);
        },
        openLevel(state, levelName) {
            state.appMode = 'level';
            state.level = state.levels[levelName];
        },
        openMenu(state) {
            state.appMode = 'menu';
            state.level = null;
        },
        setLanguage(state, languageCode) {
            state.locale = languageCode;
            localStorage.setItem("language", languageCode);
        },
        registerLevel (state, level) {
            if (level.name in state.levels) {
                throw new Error(`level ${level.name} is already registered`);
            }

            let unlockedLevels = localStorage.getItem("unlockedLevels") || ["0001"];
            let completedLevels = localStorage.getItem("completedLevels") || [];

            state.levels[level.name] = {
                ...level,
                unlocked: unlockedLevels.indexOf(level.name) > -1,
                completed: completedLevels.indexOf(level.name) > -1,
            };
        },
        unlockLevel(state, levelName) {
            if (!(levelName in state.levels)) {
                throw new Error(`level ${levelName} not found, can not unlock`);
            }
            state.levels[levelName].unlocked = true;
            let unlockedLevels = [];
            for (let level of Object.values(state.levels)) {
                if (level.unlocked) {
                    unlockedLevels.push(level.name);
                }
            }
            localStorage.setItem("unlockedLevels", unlockedLevels);
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
        availableLevels(state) {
            let result = [];
            for (const level of Object.values(state.levels)) {
                if (!level.completed && level.unlocked) {
                    result.push(level);
                }
            }
            return result;
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
        availableInstructions(state) {
            let result = [];
            for (const instruction of Object.values(state.instructions)) {
                if (instruction.unlocked) {
                    result.push(instruction)
                }
            }
            return result;
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
