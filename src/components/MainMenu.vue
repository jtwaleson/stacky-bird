<template>
    <div>
        <div class="instruction-grid-container">
            <h2>These are the instructions</h2>
            <div class="instruction-grid">
            <template v-for="(instruction, instructionName) in instructions" :key="instructionName">
                <div class="instruction" :class="{unlocked: instruction.unlocked}">
                    <div>{{ instruction.symbol }}</div>
                    <div class="code">{{ instructionName }}</div>
                </div>
            </template>
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

export default {
    name: 'MainMenu',
    computed: mapState(['instructions', 'levels']),
}
</script>
<style>
.instruction-grid-container {
    width: fit-content;
    margin: 0 auto;
    margin-top: 200px;
}
.instruction-grid {
    display:  grid;
    border-radius: 6px;
    grid-gap: 15px;
    background-color: #bbada0;
    padding: 15px;
    grid-template-columns: repeat(5, 107px);
}
.instruction {
    display: grid;
    border-radius: 3px;
    width: 107px;
    height: 107px;

    justify-content: center;
    align-items: center;
    background-color: #eee4da;
    color: #776e65;
    font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
    font-size: 55px;
    z-index: 0;
    opacity: 30%;
    user-select: none;
}
.instruction.unlocked {
    opacity: 100%;
}
.instruction .code {
    font-size: 14px;
    text-align: center;
    font-weight: bold;
    color: #555;
    font-family: "Lucida Sans Typewriter", "Lucida Console", monospace;
}
</style>
