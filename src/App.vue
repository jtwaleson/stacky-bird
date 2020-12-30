<template>
    <MainMenu v-if="appMode === 'menu'"/>
    <Board v-else :cols="7" :rows="7"/>
</template>

<script>
import { mapState } from 'vuex'
import Board from './components/Board.vue'
import MainMenu from './components/MainMenu.vue'

export default {
    name: 'App',
    components: {
        Board,
        MainMenu,
    },
    computed: mapState(['appMode']),
}
</script>

<style>
</style>
