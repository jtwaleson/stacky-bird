import { createApp, markRaw } from 'vue'
import App from './App.vue'
import store from './store'
import instructions from './instructions'
import 'bootstrap-icons/font/bootstrap-icons.css';
import VueFinalModal from 'vue-final-modal';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";


import T from './components/T.vue'
import router from './router'


window.dataLayer = window.dataLayer || [];
function gtag(){
    window.dataLayer.push(arguments);
}
window.gtag = gtag;
if (process.env.NODE_ENV === "production") {
    gtag('js', new Date());
    gtag('config', 'G-Y6L1MNNJ5V' , { anonymize_ip: true });
}

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
app.use(VueFinalModal());
app.use(Toast, {});

function applyReplacements(text, replacements) {
    let result = text;
    for (const [key, value] of Object.entries(replacements || {})) {
        result = result.replace(new RegExp(`{${key}}`), value);
    }
    return result;
}

app.mixin({
    methods: {
        $tr: function (key, replacements) {
            if (this.$store.state.locale == "en") {
                return applyReplacements(key, replacements);
            }
            let found = localeTranslations[this.$store.state.locale][key];
            if (found) {
                return applyReplacements(found, replacements);
            }
            if (process.env.NODE_ENV === "production") {
                return applyReplacements(key, replacements);
            }
            let translation = prompt(`How do you translate "${key}" into ${this.$store.state.locale}?`, key);
            localeTranslations[this.$store.state.locale][key] = translation;
            if (translation) {
                fetch("http://localhost:5000/translate", {
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
                return applyReplacements(translation, replacements);
            }
            return applyReplacements(key, replacements);
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
