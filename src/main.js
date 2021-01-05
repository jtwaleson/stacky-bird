import { createApp, markRaw } from 'vue'
import App from './App.vue'
import store from './store'
import instructions from './instructions'
import translate from './translate'

for (const [instructionName, instruction] of Object.entries(instructions)) {
    instruction.name = instructionName
    store.commit('registerInstruction', instruction);
}

const requireLevel = require.context(
    // The relative path of the components folder
    './levels',
    // Whether or not to look in subfolders
    false,
    // The regular expression used to match base component filenames
    /[A-Z]\w+\.(vue|js)$/
)

requireLevel.keys().forEach(fileName => {
    const level = requireLevel(fileName).default;
    store.commit('registerLevel', markRaw(level));
})

let app = createApp(App)

app.mixin({
    methods: {
        $t: translate
    },
});

app.use(store).mount('#app')
