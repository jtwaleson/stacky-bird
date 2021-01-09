import { createApp, markRaw } from 'vue'
import App from './App.vue'
import store from './store'
import instructions from './instructions'

import T from './components/T.vue'
import router from './router'

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
    /\w+\.(vue|js)$/
)

requireLevel.keys().forEach(fileName => {
    const level = requireLevel(fileName).default;
    level.name = fileName.replace(/\.\//, "").replace(/\.js/, "");
    store.commit('registerLevel', markRaw(level));
})


const localeTranslations = {};

const translationFiles = require.context('./translations', false, /\w+\.(json)$/);

translationFiles.keys().forEach(fileName => {
    localeTranslations[fileName.replace(/.json/, "").replace(/\.\//, "")] = translationFiles(fileName);
})

let app = createApp(App).use(router);

app.component('T', T);

app.mixin({
    methods: {
        $tr: function (key) {
            if (this.$store.state.locale == "en") {
                return key;
            }
            let found = localeTranslations[this.$store.state.locale][key];
            if (found) {
                return found;
            }
            if (process.env.NODE_ENV === "production") {
                return key;
            }
            let translation = prompt(`How do you translate "${key}" into ${this.$store.state.locale}?`, key);
            localeTranslations[this.$store.state.locale][key] = translation;
            if (translation) {
                fetch("http://192.168.1.69:5000/translate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        language: this.$store.state.locale,
                        key,
                        value: translation,
                    }),
                });
                return translation;
            }
            return key;
        },
        $t: function (key) {
            if (this.$store.state.locale == "en") {
                return key;
            }
            return localeTranslations[this.$store.state.locale][key];
        },
    },
});

app.use(store).mount('#app')
