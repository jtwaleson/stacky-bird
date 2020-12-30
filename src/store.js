import { createStore } from 'vuex'

export default createStore({
    state: {
        appMode: 'menu',
        instructions: {},
        levels: {},
        level: null,
    },
    mutations: {
        registerInstructionComponent (state, {instructionName, instructionComponent}) {
            if (instructionName in state.instructions) {
                throw new Error(`instruction ${instructionName} is already registered`);
            }

            let unlockedInstructions = localStorage.getItem("unlockedInstructions") || [];

            state.instructions[instructionName] = {
                name: instructionName,
                component: instructionComponent,
                unlocked: unlockedInstructions.indexOf(instructionName) > -1,
            };
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
            state.level = state.levels[levelName].component;
        },
        openMenu(state) {
            state.appMode = 'menu';
            state.level = null;
        },
        registerLevelComponent (state, {levelName, levelComponent}) {
            if (levelName in state.levels) {
                throw new Error(`level ${levelName} is already registered`);
            }

            let unlockedLevels = localStorage.getItem("unlockedLevels") || [];

            state.levels[levelName] = {
                name: levelName,
                component: levelComponent,
                unlocked: unlockedLevels.indexOf(levelName) > -1,
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
    },
    getters: {
    },
    actions: {
    },
    modules: {
    }
})
