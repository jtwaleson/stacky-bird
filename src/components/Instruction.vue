<template>
    <div class="instruction" :class="classObject" :style="boardLocationStyle" :draggable="draggable"
        @dragstart="dragstart" :title="translatedDescription" @dragend="dragend">
        <button @click="deleteMe" v-if="userPlaced" class="delete">✖</button>
        <div v-if="symbol.indexOf('bi-') === -1" class="symbol">{{ symbol }}</div>
        <div v-else class="symbol"><i :class="symbol" /></div>
        <div class="code">{{ name }}</div>
        <div class="state" v-if="state !== null">{{ state }}</div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, getCurrentInstance } from 'vue'
import { useStore } from '../store'

const props = withDefaults(
    defineProps<{
        symbol: string
        name: string
        description: string
        unlocked?: boolean
        x?: number | null
        y?: number | null
        draggable?: boolean
        userPlaced?: boolean
        canBeDeleted?: boolean
        deleteMethod?: () => void
        instructionClass?: string
        state?: number | null
    }>(),
    {
        x: null,
        y: null,
        instructionClass: 'A',
        state: null,
    },
)

const instance = getCurrentInstance()
const store = useStore()

const translatedDescription = computed(() => {
    // Access store.locale to make this computed reactive to locale changes
    const locale = store.locale

    // @ts-ignore - $tr is added by mixin
    const $tr = instance?.proxy?.$tr as ((key: string, replacements?: Record<string, any>) => string) | undefined
    return $tr ? $tr(props.description) : props.description
})

const draggingAway = ref(false)

const dragstart = (e: DragEvent) => {
    if (!e.dataTransfer) return
    e.dataTransfer.setData('text', props.name)
    if (props.userPlaced && !e.ctrlKey) {
        e.dataTransfer.setData('deleteX', String(props.x ?? ''))
        e.dataTransfer.setData('deleteY', String(props.y ?? ''))
        draggingAway.value = true
    }
}

const dragend = () => {
    draggingAway.value = false
}

const deleteMe = () => {
    if (props.deleteMethod) {
        props.deleteMethod()
    }
}

const boardLocationStyle = computed(() => {
    if (props.x !== null && props.y !== null) {
        return {
            'grid-column': props.x,
            'grid-row': props.y,
        }
    }
    return {}
})

const classObject = computed(() => {
    const result: Record<string, boolean> = {
        unlocked: props.unlocked ?? false,
        draggable: props.draggable ?? false,
        userPlaced: props.userPlaced ?? false,
        'hide-dragging': draggingAway.value,
    }
    result[`field-style-${props.instructionClass}`] = true
    return result
})
</script>
<style scoped>
.instruction {
    display: grid;
    position: relative;
    border-radius: 3px;
    width: 107px;
    height: 107px;

    text-align: center;
    justify-content: center;
    align-items: center;
    /*    background-color: #eee4da;
    color: #776e65; */
    font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
    font-size: 55px;
    z-index: 10;
    opacity: 0.3;
    user-select: none;
}

.instruction .state {
    position: absolute;
    top: 30px;
    left: 10px;
    background-color: #ddd;
    border-radius: 5px;
    width: 87px;
    height: 47px;
    line-height: 100%;
    font-size: 40px;
    color: black;
}

.board .instruction.hide-dragging {
    opacity: 0.1;
}

.instruction.unlocked {
    opacity: 1;
}

.board .instruction {
    box-shadow: 0px 0px 7px 0px black;
}

.instruction-grid .instruction:hover {
    box-shadow: 0px 0px 7px 0px blue;
}

.instruction-grid .instruction.draggable:hover {
    box-shadow: 0px 0px 7px 0px blue;
}

.instruction.userPlaced {
    box-shadow: 0px 0px 7px 0px blue;
}

.instruction .symbol {
    line-height: 70px;
}

.instruction .code {
    line-height: 37px;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 1.5px;
    color: #555;
    font-family: 'Lucida Sans Typewriter', 'Lucida Console', monospace;
}

button.delete {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    outline: inherit;
    width: 17px;
    height: 17px;
    position: absolute;
    left: 10px;
    top: 10px;
    font-size: 14px;
    display: inline-block;
}

button.delete:hover {
    box-shadow: 0px 0px 7px 0px black;
}
</style>
