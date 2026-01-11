<template>
    <div v-if="filteredInstructions.length > 0" class="instruction-grid" :style="boardStyle">
        <Instruction
            v-for="instruction in filteredInstructions"
            :key="instruction.name"
            v-bind="instruction"
            :draggable="draggable"
            :unlocked="instruction.name in unlockedInstructionCodes"
        />
    </div>
    <p v-else>
        <em><T textKey="There are no instructions available." /></em>
    </p>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '../store'
import Instruction from './Instruction.vue'

const props = withDefaults(
    defineProps<{
        draggable?: boolean
        unlockedOnly?: boolean
        showAll?: boolean
        locked?: boolean
        cols?: number
    }>(),
    {
        cols: 5,
    },
)

const store = useStore()

const filteredInstructions = computed(() => {
    if (props.showAll) {
        return Object.values(store.instructions)
    } else if (props.unlockedOnly) {
        return store.availableInstructions
    } else {
        return store.availableInstructions.concat(store.unavailableButReachableInstructions)
    }
})

const unlockedInstructionCodes = computed(() => {
    const result: Record<string, boolean> = {}
    for (const instruction of store.availableInstructions) {
        result[instruction.name] = true
    }
    return result
})

const boardStyle = computed(() => {
    return {
        'grid-template-columns': `repeat(${props.cols}, 107px)`,
        opacity: props.locked ? 0.2 : 1.0,
    }
})
</script>
<style>
.instruction-grid,
.board {
    display: grid;
    border-radius: 6px;
    grid-gap: 15px;
    background-color: #bbada0;
    padding: 15px;
}
</style>
