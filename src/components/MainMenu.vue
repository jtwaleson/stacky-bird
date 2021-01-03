<template>
    <div>
        <div class="instruction-grid-container fixedwidth">
            <h1>Stacky Bird</h1>
            <p>This is Stacky Bird, a game to learn programming as well as a revolutionary programming language by itself.</p>
            <h2>Levels</h2>
            <p>Complete these levels to unlock new instructions. Later on, you can come back and improve your solutions! Click a level to start playing.</p>
            <LevelList hideFinished hideNotReachable/>
            <h2>Instruction Blocks</h2>
            <p>The following blocks are available in your solutions. If they are greyed out, you still have to unlock them. Hover over the instructions to see what they do.</p>
            <InstructionList/>
            <h2>Completed Levels</h2>
            <LevelList hideUnfinished hideNotReachable/>
        </div>
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
    computed: mapState(['instructions', 'levels']),
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
