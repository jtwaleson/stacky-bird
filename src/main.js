import { createApp, markRaw } from 'vue'
import App from './App.vue'
import store from './store'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireInstructionComponent = require.context(
    // The relative path of the components folder
    './components/instructions',
    // Whether or not to look in subfolders
    false,
    // The regular expression used to match base component filenames
    /[A-Z]\w+\.(vue|js)$/
)

requireInstructionComponent.keys().forEach(fileName => {
    // Get component config
    const componentConfig = requireInstructionComponent(fileName)

    // Get PascalCase name of component
    const componentName = upperFirst(
        camelCase(
            // Gets the file name regardless of folder depth
            fileName
                .split('/')
                .pop()
                .replace(/\.\w+$/, '')
        )
    )
    store.commit('registerInstructionComponent', {
        instructionName: componentName,
        instructionComponent: markRaw(componentConfig.default || componentConfig),
    });
})

const requireLevelComponent = require.context(
    // The relative path of the components folder
    './components/levels',
    // Whether or not to look in subfolders
    false,
    // The regular expression used to match base component filenames
    /[A-Z]\w+\.(vue|js)$/
)

requireLevelComponent.keys().forEach(fileName => {
    // Get component config
    const componentConfig = requireLevelComponent(fileName)

    // Get PascalCase name of component
    const componentName = upperFirst(
        camelCase(
            // Gets the file name regardless of folder depth
            fileName
                .split('/')
                .pop()
                .replace(/\.\w+$/, '')
        )
    )
    store.commit('registerLevelComponent', {
        levelName: componentName,
        levelComponent: markRaw(componentConfig.default || componentConfig),
    });
})

createApp(App).use(store).mount('#app')
