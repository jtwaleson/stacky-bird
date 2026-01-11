import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useStore } from './store'
import instructions from './instructions'
import './assets/theme.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import VueFinalModal from 'vue-final-modal'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import type { Level } from './store'

import T from './components/T.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

app.use(VueFinalModal())

const storeInstance = useStore()

for (const [instructionName, instruction] of Object.entries(instructions)) {
    ;(instruction as { name?: string }).name = instructionName
    storeInstance.registerInstruction(instruction)
}

const levelModules = import.meta.glob('./levels/*.ts', { eager: true })

Object.keys(levelModules).forEach((fileName) => {
    const level = (
        levelModules[fileName] as {
            default: { name?: string; levelTiles?: unknown[]; [key: string]: unknown }
        }
    ).default
    const levelName = fileName
        .replace(/\.\//, '')
        .replace(/levels\//, '')
        .replace(/\.ts/, '')
    level.name = levelName

    // Process levelTiles to add name property to each tile
    if (level.levelTiles) {
        level.levelTiles = level.levelTiles.map((tile: unknown) => {
            const tileObj = tile as {
                name?: string
                symbol?: string
                execute?: unknown
                description?: string
                [key: string]: unknown
            }
            // If tile already has a name, keep it
            if (tileObj.name) {
                return tileObj
            }
            // Find which instruction this tile matches by comparing properties
            // First try to match by symbol (most unique identifier)
            for (const [instructionName, instruction] of Object.entries(
                storeInstance.instructions,
            )) {
                const inst = instruction as {
                    symbol?: string
                    execute?: unknown
                    description?: string
                    [key: string]: unknown
                }
                if (tileObj.symbol && tileObj.symbol === inst.symbol) {
                    return { ...tileObj, name: instructionName }
                }
            }
            // If symbol matching fails, try to match by checking if tile properties match instruction properties
            // This handles cases where the tile was created by spreading an instruction object
            for (const [instructionName, instruction] of Object.entries(
                storeInstance.instructions,
            )) {
                const inst = instruction as {
                    symbol?: string
                    execute?: unknown
                    description?: string
                    [key: string]: unknown
                }
                // Check if tile has the same execute function reference or same description
                if (
                    tileObj.execute === inst.execute ||
                    (tileObj.description && tileObj.description === inst.description)
                ) {
                    return { ...tileObj, name: instructionName }
                }
            }
            // If no match found, return tile as-is (might cause issues but at least won't crash)
            console.warn(`Could not find instruction name for tile with symbol: ${tileObj.symbol}`)
            return tileObj
        })
    }

    if (level.name) {
        storeInstance.registerLevel(markRaw(level) as Level)
    }
})

const localeTranslations: Record<string, Record<string, string>> = {}

const translationModules = import.meta.glob('./translations/*.json', { eager: true })

Object.keys(translationModules).forEach((fileName) => {
    const locale = fileName
        .replace(/\.json/, '')
        .replace(/\.\//, '')
        .replace(/translations\//, '')
    localeTranslations[locale] = (
        translationModules[fileName] as { default: Record<string, string> }
    ).default
})

app.component('T', T)
app.use(Toast, {})

function applyReplacements(text: string, replacements?: Record<string, string | number>) {
    let result = text
    for (const [key, value] of Object.entries(replacements || {})) {
        result = result.replace(new RegExp(`{${key}}`), String(value))
    }
    return result
}

app.mixin({
    methods: {
        $tr: function (key: string, replacements?: Record<string, string | number>) {
            const store = storeInstance
            if (store.locale == 'en') {
                return applyReplacements(key, replacements)
            }
            const localeDict = localeTranslations[store.locale]
            const found = localeDict?.[key]
            if (found) {
                return applyReplacements(found, replacements)
            }
            if (import.meta.env.PROD) {
                return applyReplacements(key, replacements)
            }
            const translation = prompt(`How do you translate "${key}" into ${store.locale}?`, key)
            if (translation && localeDict) {
                localeDict[key] = translation
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
