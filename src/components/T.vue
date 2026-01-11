<template>
    <span :class="{ fallbackUsed }" @click="promptTranslation">{{ text }}</span>
</template>
<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'
import { useStore } from '../store'

defineOptions({
    name: 'TranslationText',
})

/* The idea of this component is to visualize needed
translations, can be added in dev mode via the UI */

const props = defineProps<{
    textKey: string
    replacements?: Record<string, string | number>
}>()

const store = useStore()
const instance = getCurrentInstance()

const rawText = computed(() => {
    // Access store.locale to make this computed reactive to locale changes
    void store.locale

    // @ts-expect-error - $t is added by mixin
    const $t = instance?.proxy?.$t as ((key: string) => string) | undefined
    return $t ? $t(props.textKey) : props.textKey
})

const text = computed(() => {
    let result = rawText.value || props.textKey
    for (const [key, value] of Object.entries(props.replacements || {})) {
        result = result.replace(new RegExp(`{${key}}`), String(value))
    }
    return result
})

const fallbackUsed = computed(() => {
    if (import.meta.env.PROD) {
        return false
    }
    return !rawText.value
})

const promptTranslation = (event: MouseEvent) => {
    if (!fallbackUsed.value) {
        return
    }
    if (import.meta.env.PROD) {
        return
    }
    event.preventDefault()
    event.stopPropagation()
    const translation = prompt(
        `How do you translate "${props.textKey}" into ${store.locale}?`,
        props.textKey,
    )
    if (translation) {
        fetch('http://localhost:5000/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                language: store.locale,
                key: props.textKey,
                value: translation,
            }),
        })
    }
}
</script>
<style scoped>
span.fallbackUsed {
    background-color: red;
}
</style>
