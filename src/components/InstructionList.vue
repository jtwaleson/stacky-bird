<template>
    <div v-if="filteredInstructions.length > 0" class="instruction-grid">
        <Instruction v-for="instruction in filteredInstructions" :key="instruction.name" v-bind="instruction" :draggable="draggable"/>
    </div>
    <p v-else><em>{{ $t("no-instructions-available") }}</em></p>
</template>
<script>
import { mapGetters } from 'vuex'
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
        ...mapGetters(['unavailableButReachableInstructions', 'availableInstructions']),
        filteredInstructions() {
            if (this.unlockedOnly) {
                return this.availableInstructions;
            } else {
                return this.availableInstructions.concat(this.unavailableButReachableInstructions);
            }
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
