<template>
    <div>
        <div>
            <h2>These are the instructions</h2>
            <component v-for="(instruction, instructionName) in instructions" :key="instructionName" :is="instruction"></component>

        </div>
        <div>
            <h2>These are the levels</h2>
            <ul>
                <li>Level 1</li>
            </ul>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
    name: 'MainMenu',
    computed: mapState(['instructions']),
}
</script>
<style>
</style>
