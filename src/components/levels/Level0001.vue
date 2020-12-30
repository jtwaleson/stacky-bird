<template>
    <Board :cols="7" :rows="7" :birdX="4" :birdY="4" :grid-objects="gridObjects"/>
</template>
<script>
import Board from '@/components/Board.vue'

export default {
    name: 'Level0001',
    data() {
        return {
            gridObjects: [],
        }
    },
    components: {
        Board
    },
}
</script>
<style>
</style>
