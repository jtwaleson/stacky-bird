<template>
    <ul class="levels">
        <template v-for="(level, levelName) in filteredLevels" :key="levelName">
            <li class="level" :class="{completed: level.completed}" @click='$store.commit("openLevel", levelName)'>
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
</template>
<script>
import { mapState } from 'vuex'
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
    },
    computed: {
        ...mapState(['levels']),
        filteredLevels() {
            let result = {};
            for (const [levelName, level] of Object.entries(this.levels)) {
                if (this.hideFinished && level.completed) {
                    continue;
                } else if (!level.completed && this.hideUnfinished) {
                    continue;
                } else if (!level.unlocked && this.hideNotReachable) {
                    continue;
                } else {
                    // TODO: implement hideNotReachable
                    result[levelName] = level;
                }
            }
            return result
        },
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
    padding: 10px;
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
}
</style>
