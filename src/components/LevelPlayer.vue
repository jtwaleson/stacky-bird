<template>
    <Board v-bind="store.levels[levelName]"/>
</template>
<script>
import { useStore } from '../store'
import Board from "./Board.vue"

export default {
    name: 'LevelPlayer',
    components: {
        Board,
    },
    props: {
        levelName: String,
    },
    setup() {
        const store = useStore()
        return { store }
    },
}
</script>
<style>
</style>
