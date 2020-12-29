<template>
    <div>Hello!</div>
    <Board :cols="7" :rows="7"/>
</template>

<script>
import Board from './components/Board.vue'

export default {
    name: 'App',
    components: {
        Board,
    }
}
</script>

<style>

</style>
