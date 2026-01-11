import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useStore } from './store'
import instructions from './instructions'
import 'bootstrap-icons/font/bootstrap-icons.css'
import VueFinalModal from 'vue-final-modal'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import T from './components/T.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

app.use(VueFinalModal())

const storeInstance = useStore()

for (const [instructionName, instruction] of Object.entries(instructions)) {
    ;(instruction as any).name = instructionName
    storeInstance.registerInstruction(instruction)
}

const levelModules = import.meta.glob('./levels/*.ts', { eager: true })

Object.keys(levelModules).forEach((fileName) => {
    const level = (levelModules[fileName] as any).default
    level.name = fileName
        .replace(/\.\//, '')
        .replace(/levels\//, '')
        .replace(/\.ts/, '')

    // Process levelTiles to add name property to each tile
    if (level.levelTiles) {
        level.levelTiles = level.levelTiles.map((tile: any) => {
            // If tile already has a name, keep it
            if (tile.name) {
                return tile
            }
            // Find which instruction this tile matches by comparing properties
            // First try to match by symbol (most unique identifier)
            for (const [instructionName, instruction] of Object.entries(
                storeInstance.instructions,
            )) {
                const inst = instruction as any
                if (tile.symbol && tile.symbol === inst.symbol) {
                    return { ...tile, name: instructionName }
                }
            }
            // If symbol matching fails, try to match by checking if tile properties match instruction properties
            // This handles cases where the tile was created by spreading an instruction object
            for (const [instructionName, instruction] of Object.entries(
                storeInstance.instructions,
            )) {
                const inst = instruction as any
                // Check if tile has the same execute function reference or same description
                if (
                    tile.execute === inst.execute ||
                    (tile.description && tile.description === inst.description)
                ) {
                    return { ...tile, name: instructionName }
                }
            }
            // If no match found, return tile as-is (might cause issues but at least won't crash)
            console.warn(`Could not find instruction name for tile with symbol: ${tile.symbol}`)
            return tile
        })
    }

    storeInstance.registerLevel(markRaw(level))
})

const localeTranslations: Record<string, any> = {}

const translationModules = import.meta.glob('./translations/*.json', { eager: true })

Object.keys(translationModules).forEach((fileName) => {
    const locale = fileName
        .replace(/\.json/, '')
        .replace(/\.\//, '')
        .replace(/translations\//, '')
    localeTranslations[locale] = (translationModules[fileName] as any).default
})

app.component('T', T)
app.use(Toast, {})

function applyReplacements(text: string, replacements?: Record<string, any>) {
    let result = text
    for (const [key, value] of Object.entries(replacements || {})) {
        result = result.replace(new RegExp(`{${key}}`), value)
    }
    return result
}

app.mixin({
    methods: {
        $tr: function (key: string, replacements?: Record<string, any>) {
            const store = storeInstance
            if (store.locale == 'en') {
                return applyReplacements(key, replacements)
            }
            let found = localeTranslations[store.locale]?.[key]
            if (found) {
                return applyReplacements(found, replacements)
            }
            if (import.meta.env.PROD) {
                return applyReplacements(key, replacements)
            }
            let translation = prompt(`How do you translate "${key}" into ${store.locale}?`, key)
            if (translation && localeTranslations[store.locale]) {
                localeTranslations[store.locale][key] = translation
                fetch('http://localhost:5000/translate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        language: store.locale,
                        key,
                        value: translation,
                    }),
                })
                return applyReplacements(translation, replacements)
            }
            return applyReplacements(key, replacements)
        },
        $t: function (key: string) {
            const store = storeInstance
            if (store.locale == 'en') {
                return key
            }
            return localeTranslations[store.locale]?.[key] || key
        },
    },
})

app.mount('#app')
