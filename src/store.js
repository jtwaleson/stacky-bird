import { createStore } from 'vuex'

export default createStore({
    state: {
        appMode: 'menu',
        instructions: {},
    },
    mutations: {
        registerInstructionComponent (state, {componentName, componentConfig}) {
            if (componentName in state.instructions) {
                throw new Error("component already registered");
            }
            state.instructions[componentName] = componentConfig;
        },
        openLevel(state) {
            state.appMode = 'level';
        },
        openMenu(state) {
            state.appMode = 'menu';
        },
    },
    getters: {
    },
    actions: {
    },
    modules: {
    }
})
