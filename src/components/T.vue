<template>
    <span :class="{ fallbackUsed }" @click="promptTranslation">{{ text }}</span>
</template>
<script>
import { useStore } from '../store'

/* The idea of this component is to visualize needed
translations, can be added in dev mode via the UI */

export default {
    name: 'T',
    props: {
        textKey: String,
        replacements: {
            type: Object,
            default: () => {},
        },
    },
    setup() {
        const store = useStore()
        return { store }
    },
    computed: {
        rawText() {
            return this.$t(this.textKey)
        },
        text() {
            let result = this.rawText || this.textKey
            for (const [key, value] of Object.entries(this.replacements || {})) {
                result = result.replace(new RegExp(`{${key}}`), value)
            }
            return result
        },
        fallbackUsed() {
            if (import.meta.env.PROD) {
                return false
            }
            return !this.rawText
        },
    },
    methods: {
        promptTranslation(event) {
            if (!this.fallbackUsed) {
                return
            }
            if (import.meta.env.PROD) {
                return
            }
            event.preventDefault()
            event.stopPropagation()
            let translation = prompt(
                `How do you translate "${this.textKey}" into ${this.store.locale}?`,
                this.textKey,
            )
            if (translation) {
                fetch('http://localhost:5000/translate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        language: this.store.locale,
                        key: this.textKey,
                        value: translation,
                    }),
                })
            }
        },
    },
}
</script>
<style scoped>
span.fallbackUsed {
    background-color: red;
}
</style>
