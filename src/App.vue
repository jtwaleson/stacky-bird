<template>
    <div>Hello!</div>
    <MainMenu/>
    <Board :cols="7" :rows="7"/>
</template>

<script>
import Board from './components/Board.vue'
import MainMenu from './components/MainMenu.vue'

export default {
    name: 'App',
    components: {
        Board,
        MainMenu,
    }
}
</script>

<style>

</style>
