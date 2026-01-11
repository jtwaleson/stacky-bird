<template>
    <Board v-bind="store.levels[levelName]" />
</template>
<script setup lang="ts">
import { useStore } from '../store'
import Board from './Board.vue'

defineProps<{
    levelName: string
}>()

const store = useStore()
</script>
<style></style>
