<template>
    <Board :cols="7" :rows="7" :gridObjects="gridObjects" :finishLevel="finishLevel" :levelCode="$options.name"/>
</template>
<script>
import Board from '@/components/Board.vue'

export default {
    name: 'Level0006',
    displayName: "Level 0006 - Survive The Maze",
    description: "Get your way around the maze",
    unlocksLevels: ["Level0007"],
    unlocksInstructions: [],
    data() {
        return {
            gridObjects: [
                {x: 1, y: 1, ...this.$store.state.instructions["STRT"]},
                {x: 1, y: 2, ...this.$store.state.instructions["BLCK"]},
                {x: 3, y: 1, ...this.$store.state.instructions["BLCK"]},
                {x: 3, y: 2, ...this.$store.state.instructions["BLCK"]},
                {x: 2, y: 4, ...this.$store.state.instructions["BLCK"]},
                {x: 3, y: 4, ...this.$store.state.instructions["BLCK"]},
                {x: 4, y: 4, ...this.$store.state.instructions["BLCK"]},
                {x: 5, y: 4, ...this.$store.state.instructions["BLCK"]},
                {x: 5, y: 3, ...this.$store.state.instructions["BLCK"]},
                {x: 5, y: 2, ...this.$store.state.instructions["BLCK"]},
                {x: 6, y: 2, ...this.$store.state.instructions["BLCK"]},
                {x: 7, y: 4, ...this.$store.state.instructions["BLCK"]},
                {x: 7, y: 6, ...this.$store.state.instructions["BLCK"]},
                {x: 6, y: 6, ...this.$store.state.instructions["BLCK"]},
                {x: 2, y: 5, ...this.$store.state.instructions["BLCK"]},
                {x: 4, y: 7, ...this.$store.state.instructions["BLCK"]},
                {x: 2, y: 6, ...this.$store.state.instructions["BLCK"]},
                {x: 5, y: 5, ...this.$store.state.instructions["BLCK"]},
                {x: 7, y: 7, ...this.$store.state.instructions["FINI"]},
            ],
        }
    },
    components: {
        Board,
    },
    methods: {
        finishLevel() {
            alert("For now, this is the end of stacky bird!");
        }
    },
}
</script>
<style>
</style>
