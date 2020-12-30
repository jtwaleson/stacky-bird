<template>
    <div>
        <div>
            <h2>These are the instructions</h2>
            <template v-for="(instruction, instructionName) in instructions" :key="instructionName">
                <div v-if="instruction.unlocked" style="color: #000">
                    <component :is="instruction.component"/>
                </div>
                <div v-else style="color: #555">
                    <component :is="instruction.component"/>
                </div>
            </template>

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
</style>
