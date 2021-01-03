<template>
    <div>
        <div class="instruction-grid-container fixedwidth">
            <h2>These are the instructions</h2>
            <InstructionList/>
            <h2>These are the levels</h2>
            <ul class="levels">
                <template v-for="(level, levelName) in levels" :key="levelName">
                    <li class="level" @click='$store.commit("openLevel", levelName)'>
                        <div class="code">{{ level.component.name.replace(/Level/, "") }}</div>
                        <div class="description">
                            <b>{{ level.component.displayName }}</b>
                            <br/>
                            {{ level.component.description }}
                        </div>
                        <div class="unlocks">
                            <template v-for="instructionName in level.component.unlocksInstructions" :key="instructionName">
                                <Instruction v-bind="$store.state.instructions[instructionName]" unlocked/>
                            </template>
                        </div>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import Instruction from "./Instruction.vue"
import InstructionList from "./InstructionList.vue"

export default {
    name: 'MainMenu',
    components: {
        Instruction,
        InstructionList,
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
ul.levels {
    padding: 0;
    margin: 0;
}
.level {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    background-color: #ccc;
    padding: 10px;
    border-radius: 7px;
    margin-bottom: 7px;
}
.level:hover {
    background-color: #ddd;
    cursor: pointer;
}
.level>.code {
    border: 1px solid black;
    font-size: 24px;
    background-color: #999;
    border-radius: 3px;
    padding: 10px 30px;
    text-align: center;
    margin-right: 10px;
    align-self: center;
}
.level .description {
    flex-grow: 1;
    padding: 10px;
}
.level .unlocks {
    margin-left: 10px;
    display: grid;
    grid-gap: 15px;
}
</style>
