<template>
    <Board :cols="7" :rows="7" :birdX="4" :birdY="4" :gridObjects="gridObjects"/>
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
            gridObjects: [{x: 3, y: 3}],
        }
    },
    components: {
        Board
    },
}
</script>
<style>
</style>
