<template>
    <div class="instruction-grid">
        <Instruction v-for="(instruction, instructionName) in filteredInstructions" :key="instructionName" v-bind="instruction" :draggable="draggable"/>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import Instruction from "./Instruction.vue"

export default {
    name: 'InstructionList',
    components: {
        Instruction,
    },
    props: {
        draggable: Boolean,
        unlockedOnly: Boolean,
    },
    computed: {
        ...mapState(['instructions']),
        filteredInstructions() {
            let result = {}
            for (const [instructionName, instruction] of Object.entries(this.instructions)) {
                if (!this.unlockedOnly || instruction.unlocked) {
                    result[instructionName] = instruction;
                }
            }
            return result;
        },
    },
}
</script>
<style>
.instruction-grid, .board {
    display:  grid;
    margin-top: 20px;
    border-radius: 6px;
    grid-gap: 15px;
    background-color: #bbada0;
    padding: 15px;
    grid-template-columns: repeat(5, 107px);
}
</style>
