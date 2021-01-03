<template>
    <Board :cols="7" :rows="7" :gridObjects="gridObjects" :finishLevel="finishLevel"/>
</template>
<script>
import Board from '@/components/Board.vue'

export default {
    name: 'Level0003',
    displayName: "Level 0003 - Round And Round",
    description: "In this level we have to go all the way round",
    unlocksLevels: ["Level0004"],
    unlocksInstructions: ["UPWD", "RGHT"],
    data() {
        return {
            gridObjects: [
                {x: 3, y: 3, ...this.$store.state.instructions["STRT"]},
                {x: 7, y: 3, ...this.$store.state.instructions["DOWN"]},
                {x: 7, y: 7, ...this.$store.state.instructions["LEFT"]},
                {x: 3, y: 7, ...this.$store.state.instructions["FINI"]},
            ],
        }
    },
    components: {
        Board
    },
    methods: {
        finishLevel() {
            this.$store.commit("unlockInstruction", "UPWD");
            this.$store.commit("unlockInstruction", "RGHT");
            this.$store.commit("completeLevel", "Level0003");
            this.$store.commit("unlockLevel", "Level0004");
            this.$store.commit("openMenu");
            alert("you won");
        }
    },
}
</script>
<style>
</style>
