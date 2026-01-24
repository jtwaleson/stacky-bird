<template>
    <div class="level-grid">
        <template v-for="level in levels" :key="level?.name">
            <div
                v-if="level && level.name"
                class="level-card"
                :class="{ completed: level.completed }"
                @click="$router.push({ name: 'Level Player', params: { levelName: level.name } })"
            >
                <div class="level-header">
                    <span class="level-code">{{ level.name }}</span>
                    <span v-if="level.completed" class="completed-badge"
                        ><i class="bi-check-lg"></i
                    ></span>
                </div>

                <div class="level-body">
                    <h3 class="level-title">
                        <T :textKey="level.displayName ? `levels.${level.name}.displayName` : ''" />
                    </h3>
                    <p class="level-desc">
                        <T :textKey="level.description ? `levels.${level.name}.description` : ''" />
                    </p>
                </div>

                <div
                    class="level-unlocks"
                    v-if="
                        (level.unlocksInstructions && level.unlocksInstructions.length > 0) ||
                        level.unlocksSpeed
                    "
                >
                    <span class="unlock-label"><T textKey="common.unlocks" />:</span>
                    <div class="unlock-icons">
                        <template
                            v-for="instructionName in level.unlocksInstructions || []"
                            :key="instructionName"
                        >
                            <div class="mini-instruction">
                                <Instruction
                                    v-if="
                                        store.instructions[instructionName] &&
                                        store.instructions[instructionName].symbol &&
                                        store.instructions[instructionName].name &&
                                        store.instructions[instructionName].description
                                    "
                                    v-bind="store.instructions[instructionName]"
                                    unlocked
                                />
                            </div>
                        </template>
                        <div v-if="level.unlocksSpeed" class="speed-unlock-mini">
                            <i
                                :class="
                                    level.unlocksSpeed === 'play'
                                        ? 'bi-play-fill'
                                        : level.unlocksSpeed === 'fast'
                                          ? 'bi-skip-forward-fill'
                                          : 'bi-lightning-fill'
                                "
                            />
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
<script setup lang="ts">
import { useStore } from '../store'
import Instruction from './Instruction.vue'

interface Level {
    name: string
    completed?: boolean
    displayName?: string
    description?: string
    unlocksInstructions?: string[]
    unlocksLevels?: string[]
    unlocksSpeed?: 'play' | 'fast' | 'turbo'
    [key: string]: unknown
}

defineProps<{
    hideFinished?: boolean
    hideUnfinished?: boolean
    hideNotReachable?: boolean
    levels: Level[]
}>()

const store = useStore()
</script>
<style scoped>
.level-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
}

.level-card {
    background-color: var(--card-bg);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    padding: 20px;
    cursor: pointer;
    transition:
        transform 0.2s,
        box-shadow 0.2s;
    border: 1px solid transparent;
    display: flex;
    flex-direction: column;
}

.level-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--primary-color);
}

.level-card.completed {
    background-color: #f0fdf4; /* Light green tint */
    border-color: #86efac;
}

.level-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.level-code {
    background-color: var(--secondary-color);
    color: white;
    font-family: var(--font-mono);
    font-weight: bold;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9rem;
}

.level-card.completed .level-code {
    background-color: var(--accent-green);
}

.completed-badge {
    color: var(--accent-green);
    font-size: 1.2rem;
}

.level-body {
    flex-grow: 1;
}

.level-title {
    font-size: 1.1rem;
    margin: 0 0 5px 0;
    color: var(--heading-color);
}

.level-desc {
    font-size: 0.9rem;
    color: var(--text-light);
    margin: 0;
    line-height: 1.4;
}

.level-unlocks {
    margin-top: 15px;
    padding-top: 12px;
    border-top: 1px solid #e2e8f0;
}

.unlock-label {
    font-size: 0.75rem;
    font-weight: bold;
    color: var(--text-light);
    display: block;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.unlock-icons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.mini-instruction {
    width: 50px;
    height: 50px;
    display: flex;
}

.mini-instruction :deep(.instruction) {
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.speed-unlock-mini {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    color: white;
    font-size: 24px;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
    animation: speedBadgePulse 2s ease-in-out infinite;
}

@keyframes speedBadgePulse {
    0%,
    100% {
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
    }
    50% {
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.6);
    }
}
</style>
