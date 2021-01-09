<template>
    <Board v-bind="$store.state.levels[levelName]"/>
</template>
<script>
import Board from "./Board.vue"

export default {
    name: 'LevelList',
    components: {
        Board,
    },
    props: {
        levelName: String,
    },
}
</script>
<style>
</style>
