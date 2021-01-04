<template>
    <Board :cols="7" :rows="7" :gridObjects="gridObjects" :finishLevel="finishLevel" :levelCode="$options.name"/>
</template>
<script>
import Board from '@/components/Board.vue'

export default {
    name: 'Level0002',
    displayName: "Level 0002 - And It Goes Down",
    description: "In this level we have to place one arrow",
    unlocksLevels: ["Level0003"],
    unlocksInstructions: ["LEFT"],
    data() {
        return {
            gridObjects: [
                {x: 3, y: 3, ...this.$store.state.instructions["STRT"]},
                {x: 7, y: 3, ...this.$store.state.instructions["DOWN"]},
                {x: 7, y: 5, ...this.$store.state.instructions["FINI"]},
            ],
        }
    },
    components: {
        Board
    },
    methods: {
        finishLevel() {
            this.$store.commit("unlockInstruction", "LEFT");
            this.$store.commit("completeLevel", "Level0002");
            this.$store.commit("unlockLevel", "Level0003");
            this.$store.commit("openMenu");
            alert("you won");
        }
    },
}
</script>
<style>
</style>
