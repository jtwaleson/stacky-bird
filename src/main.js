import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context(
    // The relative path of the components folder
    './components/instructions',
    // Whether or not to look in subfolders
    false,
    // The regular expression used to match base component filenames
    /[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
    // Get component config
    const componentConfig = requireComponent(fileName)

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
        componentName,
        componentConfig: componentConfig.default || componentConfig,
    });
})

createApp(App).use(store).mount('#app')
