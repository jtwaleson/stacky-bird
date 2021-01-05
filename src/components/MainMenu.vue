<template>
    <div class="instruction-grid-container fixedwidth">
        <h1><T textKey="Stacky Bird"/></h1>
        <p><T textKey="This is Stacky Bird, a game to learn programming as well as a revolutionary programming language by itself."/></p>
        <h2><T textKey="Language"/></h2>
        <ul>
            <li v-for="(caption, languageCode) in languages" :key="languageCode" @click="$store.commit('setLanguage', languageCode)" :class="{clickable: $store.state.locale !== languageCode}">{{ caption }}</li>
        </ul>
        <h2><T textKey="Levels"/></h2>
        <p v-if="$store.getters.availableLevels.length > 0"><T textKey="Complete these levels to unlock new instructions. Later on, you can come back and improve your solutions! Click a level to start playing."/></p>
        <p v-else><T textKey="You finished all the levels!"/></p>
        <LevelList :levels="$store.getters.availableLevels"/>
        <p v-if="hiddenLevelCount > 0"><i><T textKey="There are {hiddenLevelCount} more levels still hidden" :replacements="{hiddenLevelCount}"/></i></p>
        <h2><T textKey="Instruction Blocks"/></h2>
        <p><T textKey="The following blocks are available in your solutions. If they are greyed out, you still have to unlock them. Hover over the instructions to see what they do."/></p>
        <InstructionList/>
        <p><T textKey="There are {hiddenInstructionCount} more instruction blocks to be discovered. Finish levels to unlock them." :replacements="{hiddenInstructionCount}"/></p>
        <h2><T textKey="Completed Levels"/> ({{$store.getters.completedLevels.length}} / {{Object.keys($store.state.levels).length}})</h2>
        <p v-if="$store.getters.completedLevels.length === 0"><T textKey="You have not finished any levels yet!"/></p>
        <LevelList v-else :levels="$store.getters.completedLevels"/>
        <a href="#" style="text-decoration: underline; display: block; margin-top: 200px; color: black;" @click="factoryReset"><T textKey="RESET THE GAME - FACTORY RESET"/></a>
    </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
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
        ...mapGetters(['languages']),
        hiddenLevelCount() {
            return Object.keys(this.levels).length - (this.$store.getters.completedLevels.length + Object.keys(this.$store.getters.availableLevels).length);
        },
        hiddenInstructionCount() {
            return Object.keys(this.instructions).length - (this.$store.getters.availableInstructions.length + this.$store.getters.completedLevels.length);
        },
    },
    methods: {
        factoryReset() {
            if (confirm(this.$tr("ARE YOU SURE YOU WANT TO WIPE ALL YOUR PROGRESS?"))) {
                alert(this.$tr("Ok, everything is wiped. Reloading from scratch."));
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
ul li.clickable {
    text-decoration: underline;
    cursor: pointer;
}
</style>
