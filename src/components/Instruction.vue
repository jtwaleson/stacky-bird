<template>
    <div class="instruction" :class="classObject" :style="boardLocationStyle" :draggable="draggable"
        @dragstart="dragstart" :title="translatedDescription" @dragend="dragend">
        <button @click="deleteMe" v-if="userPlaced" class="delete" title="Remove">✖</button>
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

    // Create a smaller drag image
    const dragImage = (e.currentTarget as HTMLElement).cloneNode(true) as HTMLElement
    dragImage.style.width = '80px'
    dragImage.style.height = '80px'
    dragImage.style.position = 'absolute'
    dragImage.style.top = '-9999px'
    dragImage.style.left = '-9999px'
    dragImage.style.opacity = '1'
    document.body.appendChild(dragImage)

    // Set the drag image
    e.dataTransfer.setDragImage(dragImage, 40, 40)

    // Clean up the clone after a small delay
    setTimeout(() => {
        document.body.removeChild(dragImage)
    }, 0)

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
    border-radius: 4px;
    /* Slightly nicer radius */
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;
    /* Prevent content overflow */
    border: 1px solid #d4cbbd;
    /* Subtle border */

    text-align: center;
    justify-content: center;
    align-items: center;
    background-color: #e6e0d8;
    /* Default placeholder color */
    color: var(--text-color);
    font-family: var(--font-main);

    /* Responsive font size based on container width if possible,
       otherwise fallback to viewport or calc.
       Using container queries would be ideal but simple clamp might suffice for now */
    font-size: clamp(12px, 4vw, 40px);
    container-type: inline-size;

    z-index: 10;
    opacity: 0.3;
    user-select: none;
    transition: all 0.2s ease;
}

.instruction .state {
    position: absolute;
    top: 25%;
    left: 10%;
    background-color: #ffffff;
    border-radius: 5px;
    width: 80%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 50cqw;
    color: black;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.board .instruction.hide-dragging {
    opacity: 0.1;
}

.instruction.unlocked {
    opacity: 1;
    background-color: #eee4da;
    cursor: grab;
}

.instruction.unlocked:active {
    cursor: grabbing;
}

/* Hover effects */
.instruction.draggable:hover,
.instruction.userPlaced:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.instruction.userPlaced {
    background-color: #f2e8de;
    /* Slightly different to indicate placed */
    border: 2px solid #dcb;
}

.instruction .symbol {
    font-size: clamp(14px, 35cqw, 50px);
    /* Lowered minimum to allow smaller blocks */
    color: #555;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding-bottom: 50%;
    /* Increased padding to move the symbol even further up */
    box-sizing: border-box;
}

.instruction .code {
    position: absolute;
    bottom: 5%;
    width: 100%;
    text-align: center;
    font-size: clamp(8px, 12cqw, 14px);
    /* Lowered minimum to 8px */
    font-weight: bold;
    letter-spacing: 0.5px;
    color: #776e65;
    font-family: var(--font-mono);
    text-transform: uppercase;
    pointer-events: none;
    padding: 0 2px;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

button.delete {
    background: white;
    color: var(--danger-color);
    border: 1px solid #ccc;
    border-radius: 50%;
    padding: 0;
    font: inherit;
    outline: inherit;
    width: 20cqw;
    height: 20cqw;
    max-width: 24px;
    max-height: 24px;
    position: absolute;
    right: -5%;
    top: -5%;
    left: auto;
    /* Reset left */
    font-size: 12cqw;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    z-index: 20;
}

button.delete:hover {
    background: var(--danger-color);
    color: white;
    border-color: var(--danger-color);
}
</style>
