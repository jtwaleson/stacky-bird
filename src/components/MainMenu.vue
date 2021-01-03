<template>
    <div>
        <div class="instruction-grid-container">
            <h2>These are the instructions</h2>
            <InstructionList/>
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
import InstructionList from "./InstructionList.vue"

export default {
    name: 'MainMenu',
    components: {
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
</style>
