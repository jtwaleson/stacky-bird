<template>
    <div class="instruction-grid-container fixedwidth">
        <h1>Stacky Bird</h1>
        <p>This is Stacky Bird, a game to learn programming as well as a revolutionary programming language by itself.</p>
        <h2>Levels</h2>
        <p v-if="$store.getters.availableLevels.length > 0">Complete these levels to unlock new instructions. Later on, you can come back and improve your solutions! Click a level to start playing.</p>
        <p v-else>You finished all the levels!</p>
        <LevelList :levels="$store.getters.availableLevels"/>
        <p v-if="hiddenLevelCount > 0"><i>There are {{ hiddenLevelCount }} more levels still hidden</i></p>
        <h2>Instruction Blocks</h2>
        <p>The following blocks are available in your solutions. If they are greyed out, you still have to unlock them. Hover over the instructions to see what they do.</p>
        <InstructionList/>
        <p>There are {{ hiddenInstructionCount }} more instruction blocks to be discovered. Finish levels to unlock them.</p>
        <h2>Completed Levels ({{$store.getters.completedLevels.length}} / {{Object.keys($store.state.levels).length}} total)</h2>
        <p v-if="$store.getters.completedLevels.length === 0">You have not finished any levels yet!</p>
        <LevelList v-else :levels="$store.getters.completedLevels"/>
        <a href="#" style="text-decoration: underline; display: block; margin-top: 200px; color: black;" @click="factoryReset">{{ $t("factory-reset-link") }}</a>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import InstructionList from "./InstructionList.vue"
import LevelList from "./LevelList.vue"

export default {
    name: 'MainMenu',
    components: {
        InstructionList,
        LevelList,
    },
    computed: {
        ...mapState(['instructions', 'levels']),
        hiddenLevelCount() {
            return Object.keys(this.levels).length - (this.$store.getters.completedLevels.length + Object.keys(this.$store.getters.availableLevels).length);
        },
        hiddenInstructionCount() {
            return Object.keys(this.instructions).length - (this.$store.getters.availableInstructions.length + this.$store.getters.completedLevels.length);
        },
    },
    methods: {
        factoryReset() {
            if (confirm(this.$t("factory-reset-alert"))) {
                alert(this.$t("factory-reset-done"));
                localStorage.clear();
                window.location.reload();
            }
        },
    },
}
</script>
<style>
.instruction-grid-container {
    width: fit-content;
    margin: 0 auto;
}
.instruction-grid-container.fixedwidth {
    width: 625px;
}
</style>
