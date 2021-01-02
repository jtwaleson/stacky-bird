<template>
    <Board :cols="7" :rows="7" :gridObjects="gridObjects" :finishLevel="finishLevel"/>
</template>
<script>
import Board from '@/components/Board.vue'

export default {
    name: 'Level0003',
    displayName: "Level 0004 - Do The Work",
    description: "In this level we have to pick up some numbers and deliver them to the finish line",
    unlocksLevels: ["Level0005"],
    unlocksInstructions: ["READ"],
    data() {
        return {
            gridObjects: [
                {x: 3, y: 3, ...this.$store.state.instructions["STRT"]},
                {x: 3, y: 7, ...this.$store.state.instructions["FINI"]},
            ],
        }
    },
    components: {
        Board
    },
    methods: {
        finishLevel() {
            this.$store.commit("unlockInstruction", "READ");
            this.$store.commit("completeLevel", "Level0004");
            this.$store.commit("unlockLevel", "Level0005");
            this.$store.commit("openMenu");
            alert("you won");
        }
    },
}
</script>
<style>
</style>
