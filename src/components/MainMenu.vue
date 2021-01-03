<template>
    <div>
        <div class="instruction-grid-container">
            <h2>These are the instructions</h2>
            <div class="instruction-grid">
                <Instruction v-for="(instruction, instructionName) in instructions" :key="instructionName" v-bind="instruction"/>
            </div>
        </div>
        <div>
            <h2>These are the levels</h2>
            <ul>
                <template v-for="(level, levelName) in levels" :key="levelName">
                    <li><a @click='$store.commit("openLevel", levelName)'>{{ level.component.displayName }} - {{ level.component.description }}</a></li>
                </template>
            </ul>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import Instruction from "./Instruction.vue"

export default {
    name: 'MainMenu',
    components: {
        Instruction,
    },
    computed: mapState(['instructions', 'levels']),
}
</script>
<style>
.instruction-grid-container {
    width: fit-content;
    margin: 0 auto;
}
.instruction-grid {
    display:  grid;
    margin-top: 20px;
    border-radius: 6px;
    grid-gap: 15px;
    background-color: #bbada0;
    padding: 15px;
    grid-template-columns: repeat(5, 107px);
}
</style>
