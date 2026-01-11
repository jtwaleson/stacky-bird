<template>
    <span>{{ text }}</span>
</template>
<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'
import { useStore } from '../store'

defineOptions({
    name: 'TranslationText',
})

const props = defineProps<{
    textKey: string
    replacements?: Record<string, string | number>
}>()

const store = useStore()
const instance = getCurrentInstance()

const rawText = computed(() => {
    // Access store.locale to make this computed reactive to locale changes
    void store.locale

    if (!props.textKey) {
        return ''
    }

    const $t = instance?.proxy?.$t
    if ($t && typeof props.textKey === 'string') {
        return $t(props.textKey)
    }
    return props.textKey
})

const text = computed(() => {
    let result = rawText.value || props.textKey
    for (const [key, value] of Object.entries(props.replacements || {})) {
        result = result.replace(new RegExp(`{${key}}`), String(value))
    }
    return result
})
</script>
<style scoped></style>
