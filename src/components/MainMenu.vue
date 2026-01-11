<template>
    <div class="container main-menu">
        <header class="hero">
            <h1>
                <T textKey="Stacky Bird" />
            </h1>
            <p class="subtitle">
                <T
                    textKey="This is Stacky Bird, a game to learn programming as well as a revolutionary programming language by itself." />
            </p>
            <p class="meta-info">
                <T textKey="I work on this project every couple of years. See" />{{ ' ' }}
                <a href="https://waleson.com">waleson.com</a>{{ ' ' }}
                <T
                    textKey="for more information about the creator. If you have big ideas with Stacky Bird, I'm also happy to hand over the idea." />
            </p>
        </header>

        <section class="languages">
            <h2>
                <T textKey="Language" />
            </h2>
            <div class="language-options">
                <button v-for="(caption, languageCode) in store.languages" :key="languageCode"
                    @click="store.setLanguage(languageCode)" class="lang-btn"
                    :class="{ active: store.locale === languageCode }">
                    {{ caption }}
                </button>
            </div>
        </section>

        <section class="levels-section">
            <h2>
                <T textKey="Levels" />
            </h2>
            <p v-if="store.availableLevels.length > 0">
                <T
                    textKey="Complete these levels to unlock new instructions. Later on, you can come back and improve your solutions! Click a level to start playing." />
            </p>
            <p v-else>
                <T textKey="You finished all the levels!" />
            </p>

            <div class="level-list-container">
                <LevelList :levels="store.availableLevels" />
            </div>

            <p v-if="hiddenLevelCount > 0" class="hidden-count">
                <i>
                    <T textKey="There are {hiddenLevelCount} more levels still hidden"
                        :replacements="{ hiddenLevelCount }" />
                </i>
            </p>
        </section>

        <section class="instructions-section">
            <h2>
                <T textKey="Instruction Blocks" />
            </h2>
            <p>
                <T
                    textKey="The following blocks are available in your solutions. If they are greyed out, you still have to unlock them. Hover over the instructions to see what they do." />
            </p>
            <div class="instruction-list-wrapper">
                <InstructionList />
            </div>
            <p class="hidden-count">
                <T textKey="There are {hiddenInstructionCount} more instruction blocks to be discovered. Finish levels to unlock them."
                    :replacements="{ hiddenInstructionCount }" />
            </p>
        </section>

        <section class="completed-section">
            <h2>
                <T textKey="Completed Levels" /> ({{ store.completedLevels.length }} /
                {{ Object.keys(store.levels).length }})
            </h2>
            <p v-if="store.completedLevels.length === 0">
                <T textKey="You have not finished any levels yet!" />
            </p>
            <LevelList v-else :levels="store.completedLevels" />
        </section>

        <footer class="footer">
            <a href="#" class="reset-link" @click.prevent="factoryReset">
                <T textKey="RESET THE GAME - FACTORY RESET" />
            </a>
        </footer>
    </div>
</template>
<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'
import { useStore } from '../store'
import InstructionList from './InstructionList.vue'
import LevelList from './LevelList.vue'

const store = useStore()
const instance = getCurrentInstance()

const hiddenLevelCount = computed(() => {
    return (
        Object.keys(store.levels).length -
        (store.completedLevels.length + store.availableLevels.length)
    )
})

const hiddenInstructionCount = computed(() => {
    return Object.keys(store.instructions).length - store.availableInstructions.length
})

const factoryReset = () => {
    // @ts-expect-error - $tr is added by mixin
    const $tr = instance?.proxy?.$tr as ((key: string, replacements?: Record<string, unknown>) => string) | undefined
    const confirmMessage = $tr ? $tr('ARE YOU SURE YOU WANT TO WIPE ALL YOUR PROGRESS?') : 'ARE YOU SURE YOU WANT TO WIPE ALL YOUR PROGRESS?'
    if (confirm(confirmMessage)) {
        const alertMessage = $tr ? $tr('Ok, everything is wiped. Reloading from scratch.') : 'Ok, everything is wiped. Reloading from scratch.'
        alert(alertMessage)
        localStorage.clear()
        window.location.reload()
    }
}
</script>
<style scoped>
.main-menu {
    padding-bottom: 50px;
}

.hero {
    margin-bottom: 40px;
    text-align: center;
}

.subtitle {
    font-size: 1.2rem;
    color: var(--heading-color);
}

.meta-info {
    font-size: 0.9rem;
    color: var(--text-light);
}

.language-options {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.lang-btn {
    background: white;
    border: 1px solid var(--border-color);
    color: var(--text-color);
    padding: 8px 16px;
    border-radius: 20px;
    transition: all 0.2s;
}

.lang-btn:hover {
    background: var(--bg-color);
    border-color: var(--primary-color);
}

.lang-btn.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.levels-section,
.instructions-section,
.completed-section {
    margin-bottom: 40px;
}

.instruction-list-wrapper {
    background: #e0d8d0;
    /* Slightly darker than page bg */
    padding: 20px;
    border-radius: var(--radius-md);
    width: 100%;
    overflow: hidden;
    /* Since InstructionList is grid */
}

.hidden-count {
    margin-top: 10px;
    color: var(--text-light);
}

.footer {
    margin-top: 60px;
    text-align: center;
    border-top: 1px solid var(--border-color);
    padding-top: 20px;
}

.reset-link {
    color: var(--danger-color);
    font-size: 0.8rem;
    opacity: 0.7;
}

.reset-link:hover {
    opacity: 1;
}
</style>
