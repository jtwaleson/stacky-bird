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
    <p v-else class="empty-message">
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
        'grid-template-columns': `repeat(${props.cols}, 1fr)`,
        opacity: props.locked ? 0.4 : 1.0,
        pointerEvents: props.locked ? 'none' : 'auto',
    }
})
</script>
<style>
.instruction-grid {
    display: grid;
    grid-gap: var(--spacing-sm);
    padding: 5px;
    justify-content: start;
    width: 100%;
    overflow-x: hidden;
}

.instruction-grid .instruction {
    /* No max-width here so they stay big in the sidebar */
}

.empty-message {
    color: var(--text-light);
    text-align: center;
    padding: 20px;
}
</style>