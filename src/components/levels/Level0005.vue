<template>
    <Board :cols="7" :rows="7" :gridObjects="gridObjects" :finishLevel="finishLevel" :levelCode="$options.name"/>
</template>
<script>
import Board from '@/components/Board.vue'

export default {
    name: 'Level0005',
    displayName: "Level 0005 - You Only Live Once",
    description: "In this level we introduce randomness, you have to escape it!",
    unlocksLevels: ["Level0006"],
    unlocksInstructions: ["YOLO"],
    data() {
        return {
            gridObjects: [
                {x: 1, y: 4, ...this.$store.state.instructions["STRT"]},
                {x: 4, y: 4, ...this.$store.state.instructions["YOLO"]},
                {x: 2, y: 4, ...this.$store.state.instructions["RGHT"]},
                {x: 6, y: 4, ...this.$store.state.instructions["LEFT"]},
                {x: 4, y: 6, ...this.$store.state.instructions["UPWD"]},
                {x: 4, y: 2, ...this.$store.state.instructions["DOWN"]},
                {x: 7, y: 4, ...this.$store.state.instructions["FINI"]},
            ],
        }
    },
    components: {
        Board
    },
    methods: {
        finishLevel() {
            alert("For now, this is the end of stacky bird!");
            this.$store.commit("completeLevel", "Level0005");
            this.$store.commit("unlockLevel", "Level0006");
            this.$store.commit("openMenu");
        }
    },
}
</script>
<style>
</style>
