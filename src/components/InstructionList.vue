<template>
    <div v-if="filteredInstructions.length > 0" class="instruction-grid" :style="boardStyle">
        <Instruction v-for="instruction in filteredInstructions" :key="instruction.name" v-bind="instruction" :draggable="draggable" :unlocked="instruction.name in unlockedInstructionCodes"/>
    </div>
    <p v-else><em><T textKey="There are no instructions available."/></em></p>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import Instruction from "./Instruction.vue"

export default {
    name: 'InstructionList',
    components: {
        Instruction,
    },
    props: {
        draggable: Boolean,
        unlockedOnly: Boolean,
        showAll: Boolean,
        locked: Boolean,
        cols: {
            type: Number,
            default: 5,
        },
    },
    computed: {
        ...mapState(['instructions']),
        ...mapGetters(['unavailableButReachableInstructions', 'availableInstructions']),
        filteredInstructions() {
            if (this.showAll) {
                return Object.values(this.instructions);
            } else if (this.unlockedOnly) {
                return this.availableInstructions;
            } else {
                return this.availableInstructions.concat(this.unavailableButReachableInstructions);
            }
        },
        unlockedInstructionCodes() {
            let result = {};
            for (let instruction of this.availableInstructions) {
                result[instruction.name] = true;
            }
            return result;
        },
        boardStyle() {
            return {
                "grid-template-columns": `repeat(${this.cols}, 107px)`,
                "opacity": this.locked ? 0.2 : 1.0,
            }
        },
    },
}
</script>
<style>
.instruction-grid, .board {
    display:  grid;
    border-radius: 6px;
    grid-gap: 15px;
    background-color: #bbada0;
    padding: 15px;
}
</style>
