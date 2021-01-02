<template>
    <Board :cols="7" :rows="7" :gridObjects="gridObjects" :finishLevel="finishLevel"/>
</template>
<script>
import Board from '@/components/Board.vue'

export default {
    name: 'Level0001',
    displayName: "Level 0001 - And So It Begins",
    description: "In this level we don't have to build anything yet",
    unlocksLevels: ["Level0002"],
    unlocksInstructions: ["DOWN"],
    data() {
        return {
            gridObjects: [
                {x: 3, y: 3, ...this.$store.state.instructions["STRT"]},
                {x: 7, y: 3, ...this.$store.state.instructions["FINI"]},
            ],
        }
    },
    components: {
        Board
    },
    methods: {
        finishLevel() {
            this.$store.commit("unlockInstruction", "DOWN");
            this.$store.commit("completeLevel", "Level0001");
            this.$store.commit("unlockLevel", "Level0002");
            this.$store.commit("openMenu");
            alert("you won");
        }
    },
}
</script>
<style>
</style>
