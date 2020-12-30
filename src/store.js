import { createStore } from 'vuex'

export default createStore({
    state: {
        appMode: 'menu',
        instructions: {},
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
        openLevel(state) {
            state.appMode = 'level';
        },
        openMenu(state) {
            state.appMode = 'menu';
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

    },
    getters: {
    },
    actions: {
    },
    modules: {
    }
})
