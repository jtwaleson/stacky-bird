import { createStore } from 'vuex'

export default createStore({
    state: {
        instructions: {},
    },
    mutations: {
        registerInstructionComponent (state, {componentName, componentConfig}) {
            if (componentName in state.instructions) {
                throw new Error("component already registered");
            }
            state.instructions[componentName] = componentConfig;
        }
    },
    getters: {

    },
    actions: {
    },
    modules: {
    }
})
