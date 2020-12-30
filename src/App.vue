<template>
    <MainMenu v-if="appMode === 'menu'"/>
    <component v-else :is="level"/>
</template>

<script>
import { mapState } from 'vuex'
import MainMenu from './components/MainMenu.vue'

export default {
    name: 'App',
    components: {
        MainMenu,
    },
    computed: mapState(['appMode', 'level']),
}
</script>

<style>
</style>
