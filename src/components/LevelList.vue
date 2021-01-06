<template>
    <ul class="levels">
        <template v-for="level in levels" :key="level.name">
            <li class="level" :class="{completed: level.completed}" @click='$store.commit("openLevel", level.name)'>
                <div class="code">{{ level.name }}</div>
                <div class="description">
                    <b><T textKey="Level"/> {{level.name}} - <T :textKey="level.displayName"/></b>
                    <br/>
                    <T :textKey="level.description"/>
                </div>
                <div class="unlocks">
                    <template v-for="instructionName in level.unlocksInstructions" :key="instructionName">
                        <Instruction v-bind="$store.state.instructions[instructionName]" unlocked/>
                    </template>
                </div>
            </li>
        </template>
    </ul>
</template>
<script>
import Instruction from "./Instruction.vue"

export default {
    name: 'LevelList',
    components: {
        Instruction,
    },
    props: {
        hideFinished: Boolean,
        hideUnfinished: Boolean,
        hideNotReachable: Boolean,
        levels: Array,
    },
}
</script>
<style>
ul.levels {
    padding: 0;
    margin: 0;
}
.level {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    background-color: #ccc;
    padding: 10px 20px;
    border-radius: 7px;
    margin-bottom: 7px;
}
.level.completed>.code {
    background-color: green;
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
    transform: scale(0.7);
}
.level .unlocks .instruction {
    box-shadow: 0px 0px 7px 0px green;
}
</style>
