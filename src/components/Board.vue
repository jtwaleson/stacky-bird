<template>
    <!-- Level Finish Pop-up -->
    <vue-final-modal
        v-model="showLevelCompletedModal"
        classes="modal-container"
        content-class="modal-content"
    >
        <div class="levelfinishpopup">
            <div class="modal-header">
                <h2>
                    <T textKey="board.levelCompleted" />
                </h2>
            </div>
            <div class="modal-body">
                <div v-if="unlocksLevels && unlocksLevels.length > 0" class="unlock-section">
                    <p><T textKey="board.unlockedLevels" />:</p>
                    <div class="unlocked-items">
                        <span class="badge" v-for="level in unlocksLevels" :key="level">{{
                            level
                        }}</span>
                    </div>
                </div>
                <div
                    v-if="unlocksInstructions && unlocksInstructions.length > 0"
                    class="unlock-section"
                >
                    <p><T textKey="board.unlockedBlocks" />:</p>
                    <div class="unlocks-instructions">
                        <template
                            v-for="(instructionCode, index) in unlocksInstructions"
                            :key="index"
                        >
                            <Instruction
                                v-if="
                                    store.instructions[instructionCode] &&
                                    store.instructions[instructionCode].symbol &&
                                    store.instructions[instructionCode].name &&
                                    store.instructions[instructionCode].description
                                "
                                v-bind="store.instructions[instructionCode]"
                                unlocked
                                class="unlocked-instruction"
                            />
                        </template>
                    </div>
                </div>
                <div v-if="unlocksSpeed" class="unlock-section speed-unlock">
                    <p><T textKey="board.unlockedSpeed" />:</p>
                    <div class="speed-unlock-badge">
                        <i
                            :class="
                                unlocksSpeed === 'play'
                                    ? 'bi-play-fill'
                                    : unlocksSpeed === 'fast'
                                      ? 'bi-skip-forward-fill'
                                      : 'bi-lightning-fill'
                            "
                        />
                        <span>{{
                            unlocksSpeed === 'play'
                                ? $t('board.playSpeed')
                                : unlocksSpeed === 'fast'
                                  ? $t('board.fastSpeed')
                                  : $t('board.turboSpeed')
                        }}</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="primary-btn" @click="handleLevelCompletedNavigation">OK</button>
            </div>
        </div>
    </vue-final-modal>

    <!-- Block Selection Pop-up -->
    <vue-final-modal
        v-model="showBlockSelectionModal"
        classes="modal-container"
        content-class="modal-content"
    >
        <div class="block-selection-popup" @keydown="handleModalKeyboard">
            <div class="modal-header">
                <h2>
                    <T textKey="board.selectBlock" />
                </h2>
            </div>
            <div class="modal-body">
                <div class="search-container">
                    <input
                        ref="blockSearchInput"
                        v-model="blockSearchQuery"
                        type="text"
                        class="block-search-input"
                        :placeholder="$t('board.searchBlocks')"
                        @keydown="handleModalInputKeyboard"
                        @input="handleSearchInput"
                    />
                </div>
                <div
                    v-if="filteredInstructionsForSelection.length > 0"
                    ref="blockSelectionGrid"
                    class="block-selection-grid"
                >
                    <div
                        v-for="(instruction, index) in filteredInstructionsForSelection"
                        :key="instruction.name"
                        class="block-selection-item"
                        :class="{ 'highlighted-block': index === highlightedBlockIndex }"
                        @click="selectBlock(instruction)"
                    >
                        <Instruction
                            v-if="instruction.symbol && instruction.name && instruction.description"
                            v-bind="instruction"
                            unlocked
                            class="selection-instruction"
                        />
                    </div>
                </div>
                <p v-else class="empty-message">
                    <T textKey="board.noBlocksAvailable" />
                </p>
            </div>
            <div class="modal-footer">
                <button class="secondary-btn" @click="closeBlockSelectionModal">
                    <T textKey="board.cancel" />
                </button>
            </div>
        </div>
    </vue-final-modal>

    <div class="game-layout" :class="{ 'wiki-mode': wikiMode }">
        <aside v-if="!wikiMode" class="game-sidebar">
            <div class="sidebar-header">
                <button class="back-btn" @click="$router.push({ path: '/' })">
                    <i class="bi-arrow-left"></i>
                </button>
                <h3>
                    <T textKey="board.blocks" />
                </h3>
            </div>

            <p class="instruction-hint">
                <T textKey="board.dragHint" />
            </p>

            <div class="sidebar-content">
                <InstructionList
                    :draggable="!birdIsLoaded && !playing"
                    unlockedOnly
                    :cols="2"
                    :locked="birdIsLoaded || playing"
                />
            </div>

            <div v-if="devMode" class="dev-controls">
                <button @click="toggleLevelCompleteDevMode">
                    {{ completed ? 'Uncomplete [dev]' : 'Complete [dev]' }}
                </button>
            </div>
        </aside>

        <main class="game-main">
            <div v-if="!wikiMode" class="game-header">
                <div class="level-info">
                    <button class="back-btn mobile-only" @click="$router.push({ path: '/' })">
                        <i class="bi-arrow-left"></i>
                    </button>
                    <template v-if="name">
                        <h1>
                            <span class="level-id">{{ name }}</span>
                            <T v-if="displayName" :textKey="`levels.${name}.displayName`" />
                            <button
                                v-if="hint"
                                class="hint-btn"
                                @click="showHint"
                                :title="$t('board.showHint')"
                            >
                                <i class="bi-question-circle-fill"></i>
                            </button>
                        </h1>
                        <p v-if="description" class="level-desc">
                            <T :textKey="`levels.${name}.description`" />
                        </p>
                        <transition name="fade">
                            <div v-if="showHintPanel && hint" class="hint-panel">
                                <div class="hint-content">
                                    <i class="bi-info-circle-fill"></i>
                                    <span>
                                        <T :textKey="`levels.${name}.hint`" />
                                    </span>
                                </div>
                            </div>
                        </transition>
                    </template>
                    <h1 v-else>
                        <T textKey="board.title" />
                    </h1>
                </div>

                <div class="game-controls">
                    <button
                        :disabled="birdIsLoaded || playing"
                        class="control-btn delete-btn"
                        @click="clearWithWarning"
                        title="Clear Board"
                    >
                        <i class="bi-trash" />
                    </button>
                    <div class="playback-controls">
                        <button
                            class="control-btn"
                            @click="resetButton"
                            :disabled="!birdIsLoaded"
                            title="Stop"
                        >
                            <i class="bi-stop-fill" />
                        </button>
                        <button class="control-btn" @click="stepButton" title="Step">
                            <i class="bi-skip-end-fill" />
                        </button>
                        <button
                            v-if="showPlayButton"
                            class="control-btn speed-btn"
                            :class="{ 'locked-button': !playButtonUnlocked }"
                            @click="playButtonUnlocked ? playButton() : null"
                            :disabled="!playButtonUnlocked || (playing && !multiplePlayButtons)"
                            :title="
                                playButtonUnlocked
                                    ? playing && activeMode === 'regular'
                                        ? 'Pause'
                                        : 'Play'
                                    : getSpeedTooltip('play', false)
                            "
                        >
                            <i
                                :class="
                                    playing && activeMode === 'regular'
                                        ? 'bi-pause-fill'
                                        : 'bi-play-fill'
                                "
                            />
                            <i v-if="!playButtonUnlocked" class="lock-icon bi-lock-fill" />
                        </button>
                        <button
                            class="control-btn speed-btn"
                            v-if="showFastButton"
                            :class="{ 'locked-button': !fastButtonUnlocked }"
                            @click="fastButtonUnlocked ? fastButton() : null"
                            :disabled="
                                !fastButtonUnlocked ||
                                (playing && !multiplePlayButtons && activeMode !== 'fast')
                            "
                            :title="
                                fastButtonUnlocked
                                    ? playing && activeMode === 'fast'
                                        ? 'Pause'
                                        : 'Fast Forward'
                                    : getSpeedTooltip('fast', false)
                            "
                        >
                            <i
                                :class="
                                    playing && activeMode === 'fast'
                                        ? 'bi-pause-fill'
                                        : 'bi-skip-forward-fill'
                                "
                            />
                            <i v-if="!fastButtonUnlocked" class="lock-icon bi-lock-fill" />
                        </button>
                        <button
                            class="control-btn speed-btn"
                            v-if="showUltraFastButton"
                            :class="{ 'locked-button': !ultraFastButtonUnlocked }"
                            @click="ultraFastButtonUnlocked ? ultraFastButton() : null"
                            :disabled="
                                !ultraFastButtonUnlocked ||
                                (playing && !multiplePlayButtons && activeMode !== 'lightning')
                            "
                            :title="
                                ultraFastButtonUnlocked
                                    ? playing && activeMode === 'lightning'
                                        ? 'Pause'
                                        : 'Turbo'
                                    : getSpeedTooltip('turbo', false)
                            "
                        >
                            <i
                                :class="
                                    playing && activeMode === 'lightning'
                                        ? 'bi-pause-fill'
                                        : 'bi-lightning-fill'
                                "
                            />
                            <i v-if="!ultraFastButtonUnlocked" class="lock-icon bi-lock-fill" />
                        </button>
                    </div>
                </div>
            </div>

            <div class="validation-panel" v-if="showValidationPanel">
                <div class="test-cases-header" v-if="!wikiMode">
                    <span class="label">
                        <T textKey="board.testCases" />
                    </span>
                    <ul class="test-case-tabs">
                        <li
                            @click="selectedTestCase = testCase"
                            v-for="(testCase, idx) in validation"
                            :key="idx"
                            :class="{
                                selected: testCase === selectedTestCase,
                                completed: idx in completedTestCases,
                            }"
                        >
                            {{ idx + 1 }}
                        </li>
                    </ul>
                </div>

                <div class="test-case-details" v-if="selectedTestCase">
                    <div class="io-group">
                        <span class="label"> <T textKey="board.input" />: </span>
                        <div class="stack-view">
                            <template v-if="birdIsLoaded && originalInput.length > 0">
                                <span
                                    v-for="(val, idx) in originalInput"
                                    :key="'in-orig' + idx"
                                    class="stack-item"
                                    :class="{
                                        consumed: idx < originalInput.length - input.length,
                                        'next-item': idx === originalInput.length - input.length,
                                    }"
                                    >{{ val }}</span
                                >
                            </template>
                            <template v-else>
                                <span
                                    v-for="(val, idx) in selectedTestCase.input"
                                    :key="'in-s' + idx"
                                    class="stack-item"
                                    >{{ val }}</span
                                >
                            </template>
                        </div>
                    </div>
                    <div class="io-group" v-if="!wikiMode">
                        <span class="label"> <T textKey="board.expected" />: </span>
                        <div class="stack-view">
                            <span
                                v-for="(val, idx) in selectedTestCase.finalStack"
                                :key="'out' + idx"
                                class="stack-item"
                                >{{ val }}</span
                            >
                        </div>
                    </div>
                </div>
            </div>

            <div class="board-container">
                <div v-if="showTapHint" class="tap-hint">
                    <T textKey="board.tapHint" />
                </div>
                <div class="board" :style="boardStyle">
                    <template v-for="col in cols" :key="col">
                        <div
                            v-for="row in rows"
                            :key="row"
                            class="field"
                            :class="{
                                highlighted:
                                    highlightedSquareX === col && highlightedSquareY === row,
                            }"
                            :style="{ 'grid-column': col, 'grid-row': row }"
                            @drop="drop(col, row, $event)"
                            @dragover="allowDrop"
                            @dragleave="removeDrop"
                            @click="handleFieldClick(col, row, $event)"
                            @mouseenter="handleMouseEnter(col, row)"
                            @mouseleave="handleMouseLeave"
                        ></div>
                    </template>
                    <template v-if="birdIsLoaded">
                        <div
                            v-for="(bird, index) in birds"
                            :key="index"
                            class="field thebird"
                            :class="bird.birdClasses"
                            :style="birdStyle(bird)"
                        >
                            <transition-group name="stackies" class="stack" tag="ul">
                                <li
                                    v-for="(item, index) in bird.stack"
                                    :key="index"
                                    class="field-style-F"
                                >
                                    {{ item }}
                                </li>
                            </transition-group>
                            <img :src="getBirdImageSource(bird)" />
                        </div>
                    </template>
                    <div
                        v-for="(creep, index) in loadedCreeps"
                        :key="index"
                        class="field creep"
                        :class="creep.direction"
                        :style="birdStyle(creep)"
                    >
                        <img src="@/assets/flappy1.png" />
                    </div>
                    <template v-for="(levelTile, index) in allTiles" :key="index">
                        <Instruction
                            v-if="levelTile.symbol && levelTile.name && levelTile.description"
                            :symbol="levelTile.symbol as string"
                            :name="levelTile.name as string"
                            :description="levelTile.description as string"
                            :x="levelTile.x"
                            :y="levelTile.y"
                            :state="levelTile.state"
                            :instructionClass="(levelTile.instructionClass as string) || 'A'"
                            :outgoingDirections="
                                (levelTile.outgoingDirections as Direction[]) || undefined
                            "
                            unlocked
                            :userPlaced="!birdIsLoaded && levelTile.userPlaced"
                            :draggable="!birdIsLoaded && levelTile.userPlaced"
                            :deleteMethod="() => deletePlacedInstruction(levelTile)"
                            :highlighted="
                                highlightedSquareX === levelTile.x &&
                                highlightedSquareY === levelTile.y
                            "
                        />
                    </template>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, getCurrentInstance, watch, nextTick } from 'vue'
import { sleep, oppositeDirection } from '../util'
import { useStore } from '../store'
import { toRaw } from 'vue'
import { useRouter } from 'vue-router'
import Instruction from './Instruction.vue'
import InstructionList from './InstructionList.vue'
import { useToast } from 'vue-toastification'
import flappy1 from '@/assets/flappy1.png'
import flappy2 from '@/assets/flappy2.png'
import cloneDeep from 'lodash/cloneDeep'

defineOptions({
    name: 'GameBoard',
})

const toast = useToast()
const router = useRouter()
const instance = getCurrentInstance()

type Direction = 'up' | 'down' | 'left' | 'right'

interface Bird {
    x: number | null
    y: number | null
    flappingImage: boolean
    direction: Direction
    stack: number[]
    birdClasses: string[]
}

interface Tile {
    x: number
    y: number
    name: string
    userPlaced?: boolean
    state?: number | null
    execute?: (bird: Bird, board: unknown, tile: Tile) => Promise<string | void>
    [key: string]: unknown
}

interface Creep {
    x: number
    y: number
    direction: Direction
}

interface TestCase {
    input: number[]
    finalStack: number[]
}

function getXYDiff(direction: Direction): [number, number] {
    let xDiff = 0
    let yDiff = 0
    if (direction === 'up') {
        yDiff = -1
    } else if (direction === 'down') {
        yDiff = 1
    } else if (direction === 'left') {
        xDiff = -1
    } else if (direction === 'right') {
        xDiff = 1
    } else {
        throw new Error(`invalid direction ${direction}`)
    }
    return [xDiff, yDiff]
}

const props = withDefaults(
    defineProps<{
        cols?: number
        rows?: number
        levelTiles?: Tile[]
        unlocksLevels?: string[]
        unlocksInstructions?: string[]
        unlocksSpeed?: 'play' | 'fast' | 'turbo'
        description?: string
        displayName?: string
        name?: string
        unlocked?: boolean
        completed?: boolean
        hint?: string
        validation?: TestCase[]
        creeps?: Creep[]
        wikiMode?: boolean
        active?: boolean
    }>(),
    {
        active: true,
        cols: 7,
        rows: 7,
        creeps: () => [],
        unlocksLevels: () => [],
        unlocksInstructions: () => [],
        wikiMode: false,
    },
)

const emit = defineEmits(['finishLevel', 'birdDied'])

const store = useStore()

const selectedTestCase = ref<TestCase | null>(null)
const speed = ref(100)
const stepFunctionMutex = ref(false)
const showLevelCompletedModal = ref(false)
const showBlockSelectionModal = ref(false)
const showHintPanel = ref(false)
const selectedFieldX = ref<number | null>(null)
const selectedFieldY = ref<number | null>(null)
const highlightedSquareX = ref<number | null>(null)
const highlightedSquareY = ref<number | null>(null)
const highlightSource = ref<'mouse' | 'keyboard' | null>(null)
const modalJustClosed = ref(false)
const highlightedBlockIndex = ref(0)
const blockSearchQuery = ref('')
const blockSearchInput = ref<HTMLInputElement | null>(null)
const playing = ref(false)
const shouldStopPlaying = ref(false)
const birds = ref<Bird[]>([])
const input = ref<number[]>([])
const originalInput = ref<number[]>([])
const flappingInterval = ref<ReturnType<typeof setInterval> | null>(null)
const userPlacedTiles = ref<Tile[]>([])
const completedTestCases = ref<Record<number, boolean>>({})
const loadedCreeps = ref<Creep[]>(cloneDeep(props.creeps))
const loadedLevelTiles = ref<Tile[]>(cloneDeep(props.levelTiles || []))
const activeMode = ref<'regular' | 'fast' | 'lightning' | null>(null)

const showTapHint = computed(() => {
    return (
        !props.wikiMode &&
        props.name === '0002' &&
        userPlacedTiles.value.length === 0 &&
        !birdIsLoaded.value &&
        !playing.value
    )
})

const boardStyle = computed(() => {
    const ratio = (props.cols || 7) / (props.rows || 7)

    if (props.wikiMode) {
        return {
            'grid-template-columns': `repeat(${props.cols}, 1fr)`,
            'grid-template-rows': `repeat(${props.rows}, 1fr)`,
            'aspect-ratio': `${props.cols} / ${props.rows}`,
            // Calculate width to maximize size within constraints:
            // Max height is 350px, so max width is 350 * ratio.
            // Also constrained by container width (100%).
            width: `min(100%, ${350 * ratio}px)`,
            'max-width': '100%',
            // We don't strictly need max-height here because width + aspect-ratio controls it,
            // but we keep it for safety.
            'max-height': '350px',
        }
    }

    return {
        'grid-template-columns': `repeat(${props.cols}, minmax(0, 1fr))`,
        'grid-template-rows': `repeat(${props.rows}, minmax(0, 1fr))`,
        'aspect-ratio': `${props.cols} / ${props.rows}`,
        width: '100%',
        'max-width': `min(1000px, 100%, calc((100vh - 250px) * ${ratio}))`, // Increased space by reducing subtracted amount (was 350px)
        'max-height': 'calc(100vh - 250px)', // Increased max-height
    }
})

const ultraFastButtonUnlocked = computed(() => store.availableSpeeds.includes('turbo'))
const fastButtonUnlocked = computed(() => store.availableSpeeds.includes('fast'))
const playButtonUnlocked = computed(() => store.availableSpeeds.includes('play'))
const multiplePlayButtons = computed(
    () => fastButtonUnlocked.value || ultraFastButtonUnlocked.value,
)

// Determine which speed buttons to show
const showPlayButton = computed(() => playButtonUnlocked.value || !fastButtonUnlocked.value)
const showFastButton = computed(
    () => fastButtonUnlocked.value || (playButtonUnlocked.value && !ultraFastButtonUnlocked.value),
)
const showUltraFastButton = computed(
    () => ultraFastButtonUnlocked.value || fastButtonUnlocked.value,
)

// Get the level that unlocks each speed
const speedUnlockLevel = computed(() => {
    const levels: Record<string, string> = {}
    for (const level of Object.values(store.levels)) {
        if (level.unlocksSpeed) {
            levels[level.unlocksSpeed] = level.name || ''
        }
    }
    return levels
})

// Generate tooltip for locked speeds
const getSpeedTooltip = (speed: 'play' | 'fast' | 'turbo', isUnlocked: boolean) => {
    if (isUnlocked) {
        return speed === 'play' ? 'Play' : speed === 'fast' ? 'Fast Forward' : 'Turbo'
    }
    const levelName = speedUnlockLevel.value[speed]
    if (levelName) {
        return `Unlocks at level ${levelName}`
    }
    return 'Locked'
}

const showValidationPanel = computed(() => {
    if (!props.validation || props.validation.length === 0) return false
    if (!props.wikiMode) return true

    // In wiki mode, only show if the current test case has input
    // If selectedTestCase isn't set yet, check the first one from props
    const currentInput = selectedTestCase.value?.input || props.validation[0]?.input
    return currentInput && currentInput.length > 0
})

const birdIsLoaded = computed(() => {
    for (const bird of birds.value) {
        if (bird.x !== null && bird.y !== null) {
            return true
        }
    }
    return false
})

const allTiles = computed(() => {
    return loadedLevelTiles.value.concat(userPlacedTiles.value)
})

const availableInstructionsForSelection = computed(() => {
    return store.availableInstructions
})

const filteredInstructionsForSelection = computed(() => {
    if (!blockSearchQuery.value.trim()) {
        return availableInstructionsForSelection.value
    }
    const query = blockSearchQuery.value.toLowerCase().trim()
    return availableInstructionsForSelection.value.filter((instruction) => {
        if (!instruction.name) return false
        return instruction.name.toLowerCase().includes(query)
    })
})

const isFieldEmpty = (x: number, y: number): boolean => {
    // Check if there's already a tile at this position
    for (const tile of allTiles.value) {
        if (tile.x === x && tile.y === y) {
            return false
        }
    }
    // Check if there's a bird at this position
    for (const bird of birds.value) {
        if (bird.x === x && bird.y === y) {
            return false
        }
    }
    // Check if there's a creep at this position
    for (const creep of loadedCreeps.value) {
        if (creep.x === x && creep.y === y) {
            return false
        }
    }
    return true
}

const handleFieldClick = (x: number, y: number, event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (birdIsLoaded.value) {
        return
    }
    if (isFieldEmpty(x, y)) {
        openBlockSelectionModal(x, y)
    }
}

const openBlockSelectionModal = (x: number, y: number) => {
    selectedFieldX.value = x
    selectedFieldY.value = y
    blockSearchQuery.value = ''
    highlightedBlockIndex.value = 0
    showBlockSelectionModal.value = true
}

const handleMouseEnter = (x: number, y: number) => {
    // Ignore mouse events immediately after closing modal to prevent override
    if (modalJustClosed.value) {
        return
    }
    // Only update highlight if not currently using keyboard navigation
    // Also check if mouse is actually moving to a different square
    if (highlightSource.value !== 'keyboard') {
        // Only update if it's a different square
        if (highlightedSquareX.value !== x || highlightedSquareY.value !== y) {
            highlightedSquareX.value = x
            highlightedSquareY.value = y
            highlightSource.value = 'mouse'
        }
    }
}

const handleMouseLeave = () => {
    // Only clear highlight if it was set by mouse
    if (highlightSource.value === 'mouse') {
        highlightedSquareX.value = null
        highlightedSquareY.value = null
        highlightSource.value = null
    }
}

const moveHighlight = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (birdIsLoaded.value || showBlockSelectionModal.value) {
        return
    }

    let x = highlightedSquareX.value ?? 1
    let y = highlightedSquareY.value ?? 1

    // If no highlight exists, start at 1,1
    if (highlightedSquareX.value === null || highlightedSquareY.value === null) {
        x = 1
        y = 1
    } else {
        // Move in the specified direction
        if (direction === 'up') {
            y = y > 1 ? y - 1 : props.rows || 7
        } else if (direction === 'down') {
            y = y < (props.rows || 7) ? y + 1 : 1
        } else if (direction === 'left') {
            x = x > 1 ? x - 1 : props.cols || 7
        } else if (direction === 'right') {
            x = x < (props.cols || 7) ? x + 1 : 1
        }
    }

    highlightedSquareX.value = x
    highlightedSquareY.value = y
    highlightSource.value = 'keyboard'
}

const handleKeyboardNavigation = (event: KeyboardEvent) => {
    // Don't handle keyboard navigation if modal is open or game is playing
    if (showBlockSelectionModal.value || birdIsLoaded.value) {
        return
    }

    // Don't handle if user is typing in an input field
    const target = event.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
    }

    switch (event.key) {
        case 'ArrowUp':
            event.preventDefault()
            moveHighlight('up')
            break
        case 'ArrowDown':
            event.preventDefault()
            moveHighlight('down')
            break
        case 'ArrowLeft':
            event.preventDefault()
            moveHighlight('left')
            break
        case 'ArrowRight':
            event.preventDefault()
            moveHighlight('right')
            break
        case 'Enter':
            event.preventDefault()
            if (highlightedSquareX.value !== null && highlightedSquareY.value !== null) {
                // Check if there's a deletable block at this position
                const deletableTile = userPlacedTiles.value.find(
                    (tile) =>
                        tile.x === highlightedSquareX.value &&
                        tile.y === highlightedSquareY.value &&
                        tile.userPlaced,
                )
                if (deletableTile) {
                    deletePlacedInstruction(deletableTile)
                } else if (isFieldEmpty(highlightedSquareX.value, highlightedSquareY.value)) {
                    openBlockSelectionModal(highlightedSquareX.value, highlightedSquareY.value)
                }
            }
            break
        case 'Delete':
        case 'Backspace':
            event.preventDefault()
            if (highlightedSquareX.value !== null && highlightedSquareY.value !== null) {
                // Find and delete deletable block at this position
                const deletableTile = userPlacedTiles.value.find(
                    (tile) =>
                        tile.x === highlightedSquareX.value &&
                        tile.y === highlightedSquareY.value &&
                        tile.userPlaced,
                )
                if (deletableTile) {
                    deletePlacedInstruction(deletableTile)
                }
            }
            break
    }
}

// Watch for modal opening and focus the search input immediately
watch(showBlockSelectionModal, (isOpen) => {
    if (isOpen) {
        // Try multiple times with increasing delays to overcome modal library focus management
        nextTick(() => {
            focusSearchInput()
            setTimeout(() => focusSearchInput(), 100)
            setTimeout(() => focusSearchInput(), 250)
            setTimeout(() => focusSearchInput(), 400)
        })
    }
})

const focusSearchInput = () => {
    const input = blockSearchInput.value
    if (input && input.offsetParent !== null) {
        // Check if input is visible before focusing
        try {
            // Use requestAnimationFrame to ensure DOM is ready
            requestAnimationFrame(() => {
                if (input && input.offsetParent !== null) {
                    input.focus({ preventScroll: true })
                    // Select all text for immediate typing
                    if (input.setSelectionRange) {
                        input.setSelectionRange(0, input.value.length)
                    }
                }
            })
        } catch {
            // Ignore focus errors
        }
    }
}

const blockSelectionGrid = ref<HTMLElement | null>(null)

const handleSearchInput = () => {
    // Reset highlight to first block when search changes
    highlightedBlockIndex.value = 0
}

const handleModalInputKeyboard = (event: KeyboardEvent) => {
    // Handle arrow keys and Enter in the input field
    if (
        event.key === 'ArrowUp' ||
        event.key === 'ArrowDown' ||
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight' ||
        event.key === 'Enter'
    ) {
        handleModalKeyboard(event)
    }
}

const handleModalKeyboard = (event: KeyboardEvent) => {
    if (!showBlockSelectionModal.value) {
        return
    }

    const filtered = filteredInstructionsForSelection.value
    if (filtered.length === 0) {
        return
    }

    switch (event.key) {
        case 'Enter':
            event.preventDefault()
            event.stopPropagation()
            // Select the highlighted block
            if (highlightedBlockIndex.value >= 0 && highlightedBlockIndex.value < filtered.length) {
                const block = filtered[highlightedBlockIndex.value]
                if (block) {
                    selectBlock(block)
                }
            }
            break
        case 'ArrowUp':
            event.preventDefault()
            event.stopPropagation()
            moveModalHighlight('up')
            break
        case 'ArrowDown':
            event.preventDefault()
            event.stopPropagation()
            moveModalHighlight('down')
            break
        case 'ArrowLeft':
            event.preventDefault()
            event.stopPropagation()
            moveModalHighlight('left')
            break
        case 'ArrowRight':
            event.preventDefault()
            event.stopPropagation()
            moveModalHighlight('right')
            break
    }
}

const moveModalHighlight = (direction: 'up' | 'down' | 'left' | 'right') => {
    const filtered = filteredInstructionsForSelection.value
    if (filtered.length === 0) {
        return
    }

    // Calculate current number of columns dynamically
    let cols = 2
    if (blockSelectionGrid.value) {
        const computedStyle = window.getComputedStyle(blockSelectionGrid.value)
        const gridTemplateColumns = computedStyle.getPropertyValue('grid-template-columns')
        cols = gridTemplateColumns.split(' ').length
    }

    const rows = Math.ceil(filtered.length / cols)
    const currentRow = Math.floor(highlightedBlockIndex.value / cols)
    const currentCol = highlightedBlockIndex.value % cols

    let newRow = currentRow
    let newCol = currentCol

    switch (direction) {
        case 'up':
            newRow = currentRow > 0 ? currentRow - 1 : rows - 1
            break
        case 'down':
            newRow = currentRow < rows - 1 ? currentRow + 1 : 0
            break
        case 'left':
            newCol = currentCol > 0 ? currentCol - 1 : cols - 1
            break
        case 'right':
            newCol = currentCol < cols - 1 ? currentCol + 1 : 0
            break
    }

    let newIndex = newRow * cols + newCol

    // Handle cases where the new row might have fewer columns than the previous one
    if (newIndex >= filtered.length) {
        newIndex = filtered.length - 1
    }

    highlightedBlockIndex.value = Math.max(0, newIndex)
}

const closeBlockSelectionModal = () => {
    showBlockSelectionModal.value = false
    selectedFieldX.value = null
    selectedFieldY.value = null
    blockSearchQuery.value = ''
    // Restore highlight after closing modal, maintaining keyboard navigation
    if (highlightedSquareX.value === null || highlightedSquareY.value === null) {
        highlightedSquareX.value = 1
        highlightedSquareY.value = 1
        highlightSource.value = 'keyboard'
    } else {
        // Ensure keyboard navigation is maintained
        highlightSource.value = 'keyboard'
    }
    // Prevent mouse events from overriding for a short period
    modalJustClosed.value = true
    setTimeout(() => {
        modalJustClosed.value = false
    }, 100)
}

const selectBlock = (instruction: {
    name?: string
    symbol: string
    description: string
    [key: string]: unknown
}) => {
    if (!instruction.name || selectedFieldX.value === null || selectedFieldY.value === null) {
        return
    }
    if (birdIsLoaded.value) {
        return
    }
    userPlacedTiles.value.push({
        ...instruction,
        x: selectedFieldX.value,
        y: selectedFieldY.value,
        userPlaced: true,
        state: null,
    } as Tile)
    completedTestCases.value = {}
    saveBoardToLocalStorage()
    closeBlockSelectionModal()
}

const handleLevelCompletedNavigation = () => {
    showLevelCompletedModal.value = false
    const availableLevels = store.availableLevels
    if (availableLevels.length === 1 && availableLevels[0]?.name) {
        // Navigate directly to the single available level
        router.push({ path: `/level/${availableLevels[0].name}` })
    } else {
        // Navigate to main page and scroll to levels section
        router.push({ path: '/' }).then(() => {
            nextTick(() => {
                // Use setTimeout to ensure DOM is fully rendered
                setTimeout(() => {
                    const levelsSection = document.querySelector('#levels-section')
                    if (levelsSection) {
                        levelsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                }, 100)
            })
        })
    }
}

const handleEscapeKey = (event: KeyboardEvent) => {
    // Don't handle if user is typing in an input field
    const target = event.target as HTMLElement
    const isInputFocused =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable

    if (event.key === 'Escape') {
        if (showBlockSelectionModal.value) {
            closeBlockSelectionModal()
        }
        if (showLevelCompletedModal.value) {
            handleLevelCompletedNavigation()
        }
        // Clear highlight when pressing Escape
        if (!showBlockSelectionModal.value && !showLevelCompletedModal.value) {
            highlightedSquareX.value = null
            highlightedSquareY.value = null
            highlightSource.value = null
        }
    } else if (event.key === 'Enter') {
        // Handle Enter key for level completed modal
        if (showLevelCompletedModal.value && !isInputFocused) {
            event.preventDefault()
            handleLevelCompletedNavigation()
        } else if (!showLevelCompletedModal.value && !showBlockSelectionModal.value) {
            // Handle Enter for normal navigation (existing behavior)
            handleKeyboardNavigation(event)
        }
    } else if (event.key === ' ') {
        // Spacebar for closing level completed modal or play/pause
        if (showLevelCompletedModal.value && !isInputFocused) {
            event.preventDefault()
            handleLevelCompletedNavigation()
        } else if (
            !showBlockSelectionModal.value &&
            !showLevelCompletedModal.value &&
            !isInputFocused
        ) {
            event.preventDefault()
            playButton()
        }
    } else {
        // Handle other keyboard navigation
        if (!showBlockSelectionModal.value && !showLevelCompletedModal.value) {
            handleKeyboardNavigation(event)
        }
    }
}

const devMode = computed(() => {
    return import.meta.env.DEV
})

const updateFlappingSpeed = () => {
    if (flappingInterval.value) {
        clearInterval(flappingInterval.value)
    }
    if (birdIsLoaded.value) {
        flappingInterval.value = setInterval(() => {
            for (const bird of birds.value) {
                bird.flappingImage = !bird.flappingImage
            }
        }, speed.value)
    }
}

const spawnBird = () => {
    let found = false
    const newBird: Bird = {
        x: null,
        y: null,
        flappingImage: true,
        direction: 'right', // Explicit default, will be overridden
        stack: [],
        birdClasses: [],
    }
    for (const tile of allTiles.value) {
        if (tile.name === 'STRT') {
            newBird.x = tile.x
            newBird.y = tile.y
            // Set initial direction from STRT block if available, otherwise default to right
            const directions = tile.outgoingDirections as Direction[] | undefined
            newBird.direction = (directions && directions[0]) || 'right'
            found = true
        }
    }
    if (!found) {
        throw new Error('no STRT block found!')
    }

    birds.value.push(newBird)
    updateFlappingSpeed()
}

const removeBird = (birdToRemove: Bird) => {
    const index = birds.value.indexOf(birdToRemove)
    if (index > -1) {
        birds.value.splice(index, 1)
        if (birds.value.length === 0) {
            updateFlappingSpeed()
        }
    }
}

const toggleLevelCompleteDevMode = () => {
    if (!props.name) return
    store.completeLevel({
        levelName: props.name,
        isCompleted: !props.completed,
    })
}

const birdStyle = (entity: Bird | Creep) => {
    return {
        'grid-column': entity.x ?? undefined,
        'grid-row': entity.y ?? undefined,
        display: 'grid',
    }
}

const drop = (x: number, y: number, event: DragEvent) => {
    event.preventDefault()
    if (birdIsLoaded.value) {
        return
    }
    const target = event.target as HTMLElement
    target.classList.remove('droppable')
    if (!event.dataTransfer) return

    const deleteX = parseInt(event.dataTransfer.getData('deleteX'))
    const deleteY = parseInt(event.dataTransfer.getData('deleteY'))
    if (deleteX && deleteY) {
        userPlacedTiles.value = userPlacedTiles.value.filter(
            (item) => !(item.x === deleteX && item.y === deleteY),
        )
    }
    const instructionCode = event.dataTransfer.getData('text')
    const instruction = store.instructions[instructionCode]
    if (instruction && instruction.symbol && instruction.name && instruction.description) {
        userPlacedTiles.value.push({
            ...instruction,
            x,
            y,
            userPlaced: true,
            state: null,
        } as Tile)
    }
    completedTestCases.value = {}
    saveBoardToLocalStorage()
}

const getBirdImageSource = (bird: Bird) => {
    if (bird.flappingImage || shouldStopPlaying.value) {
        return flappy1
    }
    return flappy2
}

const allowDrop = (event: DragEvent) => {
    if (birdIsLoaded.value) {
        return
    }
    const target = event.target as HTMLElement
    target.classList.add('droppable')
    event.preventDefault()
}

const removeDrop = (event: DragEvent) => {
    const target = event.target as HTMLElement
    target.classList.remove('droppable')
}

const deletePlacedInstruction = (placedInstruction: Tile) => {
    if (birdIsLoaded.value) {
        return
    }
    userPlacedTiles.value = userPlacedTiles.value.filter((item) => item !== placedInstruction)
    completedTestCases.value = {}
    saveBoardToLocalStorage()
}
const moveBird = (bird: Bird): Promise<void> | void => {
    if (bird.x === null || bird.y === null) return
    const [xDiff, yDiff] = getXYDiff(bird.direction)
    const newX = bird.x + xDiff
    const newY = bird.y + yDiff

    // Check if new position is valid
    if (newX <= 0 || newY <= 0 || newX > props.cols || newY > props.rows) {
        // Bird stays at current position (last valid square before going out of bounds)
        // Clamp position to valid grid bounds to prevent CSS grid issues
        bird.x = Math.max(1, Math.min(bird.x || 1, props.cols || 1))
        bird.y = Math.max(1, Math.min(bird.y || 1, props.rows || 1))
        bird.birdClasses.length = 0
        bird.birdClasses.push(toRaw(bird.direction))
        return dieBird('errors.outOfBoard', bird)
    }

    // Check for wall
    for (const tile of allTiles.value) {
        if (tile.name === 'BLCK' && tile.x === newX && tile.y === newY) {
            // Bird stays at current position (last valid square before wall)
            // Don't move the bird, just update visual state and die
            bird.birdClasses.length = 0
            bird.birdClasses.push(toRaw(bird.direction))
            return dieBird('errors.hitWall', bird)
        }
    }

    // Move bird
    bird.x = newX
    bird.y = newY
    bird.birdClasses.length = 0
    bird.birdClasses.push(toRaw(bird.direction))

    // Check for ghost collision
    for (const creep of loadedCreeps.value) {
        if (creep.x === bird.x && creep.y === bird.y) {
            return dieBird('errors.ghostCaught', bird)
        }
    }
}

const dieBird = async (message: string, bird: Bird, params?: Record<string, string | number>) => {
    shouldStopPlaying.value = true
    await sleep(0.5 * speed.value)
    bird.birdClasses.push('dead')
    await sleep(500)
    if (!props.wikiMode) {
        const $tr = instance?.proxy?.$tr
        const translatedMessage =
            $tr && params ? $tr(message, params) : $tr ? $tr(message) : message
        toast.warning(translatedMessage)
    }
    reset()

    // In wiki mode, emit event and automatically restart after error
    if (props.wikiMode && props.active) {
        emit('birdDied')
        setTimeout(() => {
            playButton()
        }, 1000)
    }
}

const isTestCaseEqual = (a: TestCase | null | undefined, b: TestCase | null | undefined) => {
    if (!a && !b) return true
    if (!a || !b) return false
    // Compare input arrays
    if (a.input.length !== b.input.length) return false
    for (let i = 0; i < a.input.length; i++) {
        if (a.input[i] !== b.input[i]) return false
    }
    // Compare finalStack arrays
    if (a.finalStack.length !== b.finalStack.length) return false
    for (let i = 0; i < a.finalStack.length; i++) {
        if (a.finalStack[i] !== b.finalStack[i]) return false
    }
    return true
}

const finish = () => {
    reset()
    let allLevelsFinished = true
    let nextTestCase: TestCase | null = null

    console.log('finish called', {
        validation: props.validation,
        completedTestCases: completedTestCases.value,
        selectedTestCase: selectedTestCase.value,
    })
    if (props.validation) {
        for (const testCaseIndex in props.validation) {
            console.log(
                'Checking testcase',
                testCaseIndex,
                props.validation[parseInt(testCaseIndex)],
                selectedTestCase.value,
            )
            if (
                isTestCaseEqual(props.validation[parseInt(testCaseIndex)], selectedTestCase.value)
            ) {
                completedTestCases.value[parseInt(testCaseIndex)] = true
                if (!props.wikiMode) {
                    const $tr = instance?.proxy?.$tr
                    const translatedMessage = $tr
                        ? $tr('board.testCaseDone', {
                              testCaseIndex: parseInt(testCaseIndex) + 1,
                          })
                        : `Test case ${parseInt(testCaseIndex) + 1} done!`
                    toast.info(translatedMessage)
                }
            }
        }
        for (const testCaseIndex in props.validation) {
            if (!(parseInt(testCaseIndex) in completedTestCases.value)) {
                allLevelsFinished = false
                const testCase = props.validation[parseInt(testCaseIndex)]
                if (testCase) {
                    nextTestCase = testCase
                }
                break
            }
        }
    }
    if (allLevelsFinished) {
        shouldStopPlaying.value = true
        if (props.wikiMode) {
            console.log('Board finished in wiki mode, emitting finishLevel')
            // In wiki mode, automatically restart after completion
            emit('finishLevel')
            setTimeout(() => {
                completedTestCases.value = {}
                if (props.validation && props.validation.length > 0) {
                    selectedTestCase.value = props.validation[0] || null
                }
                if (props.active) {
                    playButton()
                }
            }, 1500)
        } else {
            if (props.name) {
                store.completeLevel({
                    levelName: props.name,
                    isCompleted: true,
                })
            }
            showLevelCompletedModal.value = true
        }
    } else {
        selectedTestCase.value = nextTestCase
    }
}
const playButton = () => {
    if (playing.value && activeMode.value === 'regular') {
        // Pause
        shouldStopPlaying.value = true
        activeMode.value = null
        return
    }
    speed.value = 200
    updateFlappingSpeed()
    if (playing.value) {
        return
    }
    activeMode.value = 'regular'
    shouldStopPlaying.value = false
    play()
}

const ultraFastButton = () => {
    if (playing.value && activeMode.value === 'lightning') {
        // Pause
        shouldStopPlaying.value = true
        activeMode.value = null
        return
    }
    speed.value = 5
    updateFlappingSpeed()
    if (playing.value) {
        return
    }
    activeMode.value = 'lightning'
    shouldStopPlaying.value = false
    play()
}

const fastButton = () => {
    if (playing.value && activeMode.value === 'fast') {
        // Pause
        shouldStopPlaying.value = true
        activeMode.value = null
        return
    }
    speed.value = 40
    updateFlappingSpeed()
    if (playing.value) {
        return
    }
    activeMode.value = 'fast'
    shouldStopPlaying.value = false
    play()
}

const stepButton = async () => {
    speed.value = 200
    updateFlappingSpeed()
    shouldStopPlaying.value = true
    if (playing.value) {
        return
    }
    await play()
}

const play = async () => {
    if (playing.value) {
        return
    }
    playing.value = true
    while (playing.value) {
        await step()
        if (shouldStopPlaying.value) {
            break
        }
        await sleep(speed.value)
    }
    playing.value = false
    shouldStopPlaying.value = false
    activeMode.value = null
}
const step = async () => {
    if (stepFunctionMutex.value) {
        console.error('can not step while still stepping')
        return
    }
    stepFunctionMutex.value = true
    if (birds.value.length === 0) {
        input.value = []
        originalInput.value = []
        if (selectedTestCase.value) {
            originalInput.value = [...toRaw(selectedTestCase.value.input)]
            input.value = [...toRaw(selectedTestCase.value.input)]
        }
        spawnBird()
        // Wait a bit to show the bird on the start block before moving
        await sleep(speed.value)
    }
    for (const bird of birds.value) {
        let instruction: Tile | null = null
        for (const tile of allTiles.value) {
            if (bird.x !== null && bird.y !== null && tile.x === bird.x && tile.y === bird.y) {
                instruction = tile
                break
            }
        }
        let shouldMove: string | void = undefined
        // If this is the first step (just spawned), don't execute instruction on start tile
        const isFirstStep =
            birds.value.length > 0 &&
            input.value.length === originalInput.value.length &&
            instruction?.name === 'STRT'

        if (!isFirstStep && instruction && instruction.execute) {
            shouldMove = await instruction.execute(
                bird,
                {
                    input: input.value,
                    speed: speed.value,
                    finish,
                    dieBird,
                    spawnBird,
                    allTiles: allTiles.value,
                    selectedTestCase: selectedTestCase.value,
                    birds: birds.value,
                    removeBird,
                },
                instruction,
            )
        }
        if (shouldMove === 'SKIP') {
            // PRTI/PRTO already teleported the bird, so skip moveBird
            await sleep(2 * speed.value)
            // Move bird one step forward to exit the destination portal and prevent infinite loop
            if (birdIsLoaded.value && bird.x !== null && bird.y !== null) {
                const [xDiff, yDiff] = getXYDiff(bird.direction)
                const newX = bird.x + xDiff
                const newY = bird.y + yDiff
                // Only move if the new position is valid and not a wall
                if (newX > 0 && newY > 0 && newX <= props.cols && newY <= props.rows) {
                    let hitBlock = false
                    for (const tile of allTiles.value) {
                        if (tile.name === 'BLCK' && tile.x === newX && tile.y === newY) {
                            hitBlock = true
                            break
                        }
                    }
                    if (!hitBlock) {
                        bird.x = newX
                        bird.y = newY
                    }
                }
            }
        } else if (shouldMove === 'JUMP') {
            // JMP1 already moved the bird and handled animation, so skip moveBird
            // The jump animation delay is handled in the JMP1 instruction itself
        } else if (!birdIsLoaded.value) {
            break
        } else if (birdIsLoaded.value && shouldMove !== 'NOMOVE') {
            await moveBird(bird)
        }
    }
    for (const creep of loadedCreeps.value) {
        if (!birdIsLoaded.value) {
            break
        }
        const [xDiff, yDiff] = getXYDiff(creep.direction)
        const newX = creep.x + xDiff
        const newY = creep.y + yDiff
        if (newY <= 0 || newY > props.rows || newX <= 0 || newX > props.cols) {
            creep.direction = oppositeDirection[creep.direction] as Direction
        } else {
            let hitBlock = false
            for (const tile of allTiles.value) {
                if (newX === tile.x && newY === tile.y && tile.name === 'BLCK') {
                    hitBlock = true
                }
            }
            if (hitBlock) {
                creep.direction = oppositeDirection[creep.direction] as Direction
            } else {
                creep.x = newX
                creep.y = newY
            }
        }
        for (const bird of birds.value) {
            if (bird.x === creep.x && bird.y === creep.y) {
                await dieBird('errors.ghostCaught', bird)
                stepFunctionMutex.value = false
                return
            }
        }
    }

    stepFunctionMutex.value = false
}

const resetButton = async () => {
    shouldStopPlaying.value = true
    activeMode.value = null
    while (playing.value) {
        await sleep(100)
    }
    reset()
}

const reset = () => {
    stepFunctionMutex.value = false
    loadedCreeps.value = cloneDeep(props.creeps)
    for (const tile of userPlacedTiles.value) {
        tile.state = null
    }
    loadedLevelTiles.value = cloneDeep(props.levelTiles || [])
    birds.value = []
    input.value = []
    originalInput.value = []
    if (flappingInterval.value) {
        clearInterval(flappingInterval.value)
    }
}

const clearWithWarning = () => {
    const $tr = instance?.proxy?.$tr
    const message = $tr ? $tr('board.resetConfirm') : 'board.resetConfirm'
    if (confirm(message)) {
        clear()
    }
}

const clear = () => {
    userPlacedTiles.value = []
    reset()
    saveBoardToLocalStorage()
}

const showHint = () => {
    showHintPanel.value = !showHintPanel.value
}

const saveBoardToLocalStorage = () => {
    if (!props.name) {
        return
    }
    const userPlacedTilesData: Array<{ x: number; y: number; code: string }> = []
    for (const tile of userPlacedTiles.value) {
        userPlacedTilesData.push({
            x: tile.x,
            y: tile.y,
            code: tile.name,
        })
    }
    localStorage.setItem(props.name, JSON.stringify(userPlacedTilesData))
}

const initializeLevel = () => {
    // Reset game state
    reset()
    userPlacedTiles.value = []
    completedTestCases.value = {}
    showLevelCompletedModal.value = false
    showBlockSelectionModal.value = false

    // Reload level tiles and creeps from props
    loadedLevelTiles.value = cloneDeep(props.levelTiles || [])
    loadedCreeps.value = cloneDeep(props.creeps)

    if (!props.name) {
        return
    }

    // Set up test cases
    if (props.validation && props.validation.length > 0) {
        selectedTestCase.value = props.validation[0] || null
    } else {
        selectedTestCase.value = null
    }

    // Load user placed tiles from localStorage
    let userPlacedTilesData: Array<{
        x: number
        y: number
        code: string
    }> = []
    try {
        const stored = localStorage.getItem(props.name)
        if (stored) {
            userPlacedTilesData = JSON.parse(stored)
        }
    } catch (e) {
        // If localStorage is corrupted, clear it and start fresh
        console.warn(`Failed to parse ${props.name} from localStorage, clearing it`, e)
        localStorage.removeItem(props.name)
    }
    for (const tile of userPlacedTilesData) {
        const instruction = store.instructions[tile.code]
        if (instruction && instruction.symbol && instruction.name && instruction.description) {
            userPlacedTiles.value.push({
                ...instruction,
                x: tile.x,
                y: tile.y,
                userPlaced: true,
            } as Tile)
        }
    }
}

// Watch for level changes and reload
watch(
    () => props.name,
    () => {
        initializeLevel()
        showHintPanel.value = false
    },
    { immediate: false },
)

watch(
    () => props.levelTiles,
    () => {
        loadedLevelTiles.value = cloneDeep(props.levelTiles || [])
    },
    { deep: true },
)

watch(
    () => props.creeps,
    () => {
        loadedCreeps.value = cloneDeep(props.creeps)
    },
    { deep: true },
)

watch(
    () => props.active,
    (newActive) => {
        if (props.wikiMode) {
            if (newActive) {
                if (!playing.value) {
                    playButton()
                }
            } else {
                if (playing.value) {
                    shouldStopPlaying.value = true
                    activeMode.value = null
                }
            }
        }
    },
)

onMounted(() => {
    initializeLevel()
    if (!props.wikiMode) {
        window.addEventListener('keydown', handleEscapeKey)
    }

    // Auto-start in wiki mode
    if (props.wikiMode && props.active) {
        setTimeout(() => {
            speed.value = 100
            playButton()
        }, 500)
    }
})

onBeforeUnmount(() => {
    if (flappingInterval.value) {
        clearInterval(flappingInterval.value)
    }
    window.removeEventListener('keydown', handleEscapeKey)
})
</script>

<style scoped>
/* Layout */
.game-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    height: 100vh;
    overflow: hidden;
}

.game-layout.wiki-mode {
    grid-template-columns: 1fr;
    height: auto;
    overflow: visible;
    width: 100%;
}

.mobile-only {
    display: none;
}

@media (max-width: 768px) {
    .mobile-only {
        display: block;
    }

    .game-layout {
        grid-template-columns: 1fr;
        height: 100vh;
    }

    .game-sidebar {
        display: none !important;
    }

    .game-main {
        padding: 10px;
        padding-bottom: 90px; /* Space for fixed controls */
    }

    .game-header {
        flex-direction: column;
        gap: 10px;
        padding: 10px;
        margin-bottom: 10px;
    }

    .game-header .level-info {
        width: 100%;
    }

    /* Move controls to bottom */
    .game-controls {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        padding: 8px 16px;
        border-radius: 50px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        z-index: 1000;
        width: auto;
        justify-content: center;
        border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .board-container {
        padding: 5px 0;
        align-items: center;
        height: auto;
        flex-grow: 1;
    }

    /* Clever compact validation panel */
    .validation-panel {
        margin: 0 0 10px 0;
        padding: 8px 12px;
        border-radius: var(--radius-sm);
    }

    .test-cases-header {
        margin-bottom: 5px;
        padding-bottom: 5px;
        overflow-x: auto;
        white-space: nowrap;
    }

    .test-case-tabs li {
        padding: 2px 8px;
        font-size: 0.85rem;
    }

    .test-case-details {
        font-size: 0.85rem;
        gap: 5px;
    }

    .io-group {
        flex-wrap: wrap;
    }

    .io-group .label {
        width: auto;
        margin-right: 5px;
    }

    .stack-item {
        padding: 2px 6px;
        font-size: 0.8rem;
    }

    /* Make delete button larger on mobile */
    :deep(button.delete) {
        width: 30px;
        height: 30px;
        max-width: none;
        max-height: none;
        font-size: 16px;
        right: -10px;
        top: -10px;
        background: white;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    .level-info {
        display: grid;
        grid-template-columns: min-content 1fr;
        grid-template-areas:
            'back title'
            'back desc';
        align-items: center;
        column-gap: 10px;
    }
    .back-btn.mobile-only {
        grid-area: back;
    }
    .level-info h1 {
        grid-area: title;
    }
    .level-desc {
        grid-area: desc;
    }
}

.game-sidebar {
    background-color: #f0ece6;
    border-right: 1px solid #d4cbbd;
    display: flex;
    flex-direction: column;
    padding: 15px;
    overflow-y: auto;
    overflow-x: hidden;
    min-width: 0;
}

.game-main {
    display: flex;
    flex-direction: column;
    padding: 20px;
    padding-bottom: 0px;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: var(--bg-color);
    min-width: 0;
    position: relative;
    isolation: isolate;
    /* Create stacking context without z-index */
}

.wiki-mode .game-main {
    padding: 0;
    overflow: visible;
    background: transparent;
}

/* Sidebar */
.sidebar-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 10px;
}

.sidebar-header h3 {
    margin: 0;
    line-height: 1;
}

.back-btn {
    padding: 5px 10px;
    font-size: 1.2rem;
    background: transparent;
    border: 1px solid transparent;
}

.back-btn:hover {
    background: rgba(0, 0, 0, 0.05);
    border-color: #ccc;
}

.instruction-hint {
    font-size: 0.85rem;
    color: var(--text-light);
    margin-bottom: 15px;
}

.sidebar-content {
    flex-grow: 1;
    overflow-y: auto;
}

/* Main Content Header */
.game-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    background: white;
    padding: 15px;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
}

.level-info h1 {
    font-size: 1.5rem;
    margin: 0;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 10px;
}

.level-id {
    background: var(--secondary-color);
    color: white;
    font-family: var(--font-mono);
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 1rem;
}

.hint-btn {
    background: var(--accent-blue);
    color: white;
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.1rem;
    margin-left: 10px;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
    padding: 0;
    line-height: 1;
}

.hint-btn:hover {
    transform: scale(1.1);
    background: var(--primary-color);
}

.level-desc {
    margin: 5px 0 0 0;
    color: var(--text-light);
}

.hint-panel {
    margin-top: 10px;
    background: #e1f5fe;
    border-left: 4px solid var(--accent-blue);
    border-radius: 4px;
    overflow: hidden;
}

.hint-content {
    padding: 10px 15px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 0.95rem;
    color: #0277bd;
}

.hint-content i {
    font-size: 1.1rem;
    margin-top: 2px;
}

.fade-enter-active,
.fade-leave-active {
    transition:
        opacity 0.3s ease,
        transform 0.3s ease,
        max-height 0.3s ease;
    max-height: 100px;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-5px);
    max-height: 0;
}

/* Controls */
.game-controls {
    display: flex;
    gap: 15px;
    align-items: center;
}

.playback-controls {
    display: flex;
    background: #f0f0f0;
    border-radius: var(--radius-sm);
    padding: 4px;
    gap: 6px;
}

.control-btn {
    background: white;
    border: 1px solid #ddd;
    border-radius: var(--radius-sm);
    padding: 8px 12px;
    font-size: 1.2rem;
    color: #555;
    transition: all 0.2s;
}

.control-btn:hover:not(:disabled) {
    background: #f8f8f8;
    color: var(--primary-color);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    border-color: var(--primary-color);
}

.control-btn.delete-btn {
    color: var(--danger-color);
}

.control-btn.delete-btn:hover {
    background: #fee2e2;
}

.control-btn.speed-btn:not(.locked-button) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.control-btn.speed-btn:not(.locked-button):hover:not(:disabled) {
    background: linear-gradient(135deg, #7c8ff0 0%, #8b5bb8 100%);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    transform: translateY(-1px);
}

.control-btn.locked-button {
    position: relative;
    opacity: 0.5;
    cursor: not-allowed;
}

.control-btn.locked-button:hover {
    background: white;
    color: #555;
    border-color: #ddd;
    transform: none;
}

.control-btn.speed-btn.locked-button {
    background: #e5e7eb;
    color: #9ca3af;
    border: 1px solid #d1d5db;
}

.control-btn.speed-btn.locked-button:hover {
    background: #e5e7eb;
    color: #9ca3af;
    border-color: #d1d5db;
}

.lock-icon {
    position: absolute;
    bottom: -2px;
    right: -2px;
    font-size: 0.7rem;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 3px;
    border-radius: 3px;
}

/* Validation Panel */
.validation-panel {
    background: white;
    padding: 10px 20px;
    border-radius: var(--radius-md);
    margin-bottom: 20px;
    box-shadow: var(--shadow-sm);
    position: relative;
    z-index: 1;
    flex-shrink: 0;
}

.test-cases-header {
    display: flex;
    align-items: center;
    gap: 15px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    margin-bottom: 10px;
}

.test-case-tabs {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 5px;
}

.test-case-tabs li {
    padding: 4px 10px;
    border-radius: 4px;
    background: #eee;
    cursor: pointer;
    font-weight: bold;
    color: #666;
    transition: all 0.2s;
}

.test-case-tabs li.selected {
    background: var(--primary-color);
    color: white;
}

.test-case-tabs li.completed {
    border: 2px solid var(--accent-green);
}

.test-case-details {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.io-group {
    display: flex;
    align-items: center;
    gap: 10px;
}

.io-group .label {
    width: 80px;
    color: var(--text-light);
    font-weight: bold;
}

.stack-view {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
}

.stack-item {
    background: #e2e8f0;
    padding: 4px 10px;
    border-radius: 4px;
    font-family: var(--font-mono);
    font-weight: bold;
    color: #333;
    transition:
        opacity 0.2s,
        background-color 0.2s;
}

.stack-item.consumed {
    opacity: 0.2;
}

.stack-item.next-item {
    background: var(--accent-blue);
    color: white;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
}

/* Board */
.board-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: visible;
    padding: 20px;
    width: 100%;
    min-width: 0;
}

.tap-hint {
    background: var(--accent-blue);
    color: white;
    padding: 10px 20px;
    border-radius: 30px;
    margin-bottom: 15px;
    font-weight: bold;
    box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
    animation: bounce 2s infinite;
    z-index: 100;
}

@keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-10px);
    }
    60% {
        transform: translateY(-5px);
    }
}

.wiki-mode .board-container {
    padding: 0;
}

.board {
    display: grid;
    border-radius: 6px;
    gap: var(--spacing-md);
    background-color: var(--board-bg);
    padding: var(--spacing-md);
    box-shadow: var(--shadow-lg);
    position: relative;
    min-width: 200px;
    margin: 0 auto 20px auto;
    z-index: 10;
}

.wiki-mode .board {
    box-shadow: none;
    margin: 0 auto;
}

.field {
    display: grid;
    border-radius: 3px;
    justify-content: center;
    align-items: center;
    background-color: #eee4da;
    /* Keeping as requested */
    z-index: 4;
    opacity: 0.4;
    width: 100%;
    height: 100%;
    transition:
        opacity 0.2s,
        border-color 0.2s,
        box-shadow 0.2s;
    border: 2px solid transparent;
    position: relative;
}

.field:hover {
    opacity: 0.6;
    border-color: rgba(0, 123, 255, 0.3);
}

.field.highlighted {
    opacity: 0.8;
    border: 4px solid #0066ff;
    box-shadow:
        0 0 0 3px rgba(0, 102, 255, 0.4),
        0 0 15px rgba(0, 102, 255, 0.6),
        inset 0 0 10px rgba(0, 102, 255, 0.2);
    z-index: 5;
}

.field.highlighted::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 3px;
    background: rgba(0, 102, 255, 0.15);
    z-index: -1;
    pointer-events: none;
}

/* Bird and entities styling (preserved) */
.thebird {
    display: none;
    pointer-events: none;
    position: relative;
    opacity: 1;
    background: none;
    z-index: 1000;
    width: 100%;
    height: 100%;
    user-select: none;
    overflow: visible;
}

.creep {
    position: relative;
    pointer-events: none;
    opacity: 1;
    background: none;
    z-index: 20;
    width: 100%;
    height: 100%;
    user-select: none;
    filter: invert(1) grayscale(100%);
}

.creep img,
.thebird img {
    width: 100%;
    height: 100%;
}

.moving {
    transition: margin ease-in-out 100ms;
}

.left img {
    transform: scaleX(-1);
}

.right img {
    transform: rotate(0deg);
}

.up img {
    transform: rotate(270deg);
}

.down img {
    transform: rotate(90deg);
}

.moving.left {
    margin-left: calc(-100% - var(--spacing-md));
}

.moving.right {
    margin-left: calc(100% + var(--spacing-md));
}

.moving.up {
    margin-top: calc(-100% - var(--spacing-md));
}

.moving.down {
    margin-top: calc(100% + var(--spacing-md));
}

.thebird.dead img {
    filter: invert(1);
    height: 0;
    transition: height ease-in-out 0.5s;
}

.thebird.jumping.right {
    animation: jump-right 0.8s ease-in-out forwards;
    z-index: 101;
}

.thebird.jumping.left {
    animation: jump-left 0.8s ease-in-out forwards;
    z-index: 101;
}

.thebird.jumping.up {
    animation: jump-up 0.8s ease-in-out forwards;
    z-index: 101;
}

.thebird.jumping.down {
    animation: jump-down 0.8s ease-in-out forwards;
    z-index: 101;
}

@keyframes jump-right {
    0% {
        transform: translate(0, 0) scale(1);
    }

    50% {
        transform: translate(calc(100% + var(--spacing-md)), -50%) scale(1.15);
    }

    100% {
        transform: translate(calc(200% + 2 * var(--spacing-md)), 0) scale(1);
    }
}

@keyframes jump-left {
    0% {
        transform: translate(0, 0) scale(1);
    }

    50% {
        transform: translate(calc(-100% - var(--spacing-md)), -50%) scale(1.15);
    }

    100% {
        transform: translate(calc(-200% - 2 * var(--spacing-md)), 0) scale(1);
    }
}

@keyframes jump-up {
    0% {
        transform: translate(0, 0) scale(1);
    }

    50% {
        transform: translate(0, calc(-100% - var(--spacing-md))) scale(1.15);
    }

    100% {
        transform: translate(0, calc(-200% - 2 * var(--spacing-md))) scale(1);
    }
}

@keyframes jump-down {
    0% {
        transform: translate(0, 0) scale(1);
    }

    50% {
        transform: translate(0, calc(100% + var(--spacing-md))) scale(1.15);
    }

    100% {
        transform: translate(0, calc(200% + 2 * var(--spacing-md))) scale(1);
    }
}

/* Stack visualization on bird */
.stack {
    position: absolute;
    bottom: 100%;
    /* Move above the bird */
    left: 50%;
    transform: translateX(-50%);
    /* Center horizontally */
    list-style: none;
    padding: 0;
    margin: 0 0 5px 0;
    /* Space between bird and stack */
    display: flex;
    flex-direction: column;
    width: 35px;
    /* Thinner stack */
    border-radius: 4px;
    background-color: rgba(51, 51, 51, 0.9);
    color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 10001;
    overflow: hidden;
}

.stack li {
    display: block;
    border-radius: 2px;
    text-align: center;
    margin: 2px;
    font-size: 14px;
    /* Smaller font for smaller width */
    font-weight: bold;
    padding: 2px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    transition:
        background-color 0.2s,
        transform 0.2s;
}

.stack li:last-child {
    border-bottom: none;
    /* Highlight the top of stack (last item = most recently pushed) */
    background: rgba(0, 123, 255, 0.4);
    box-shadow: inset 0 0 8px rgba(0, 123, 255, 0.3);
}

/* Stack item animations */
.stackies-enter-active {
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.stackies-leave-active {
    transition: all 0.15s ease-in;
    position: absolute;
    width: calc(100% - 4px);
}

.stackies-enter-from {
    opacity: 0;
    transform: translateY(15px) scale(0.85);
}

.stackies-leave-to {
    opacity: 0;
    transform: translateY(10px) scale(0.85);
}

.stackies-move {
    transition: transform 0.2s ease-out;
}

.field.droppable {
    border: 3px solid var(--accent-blue);
    opacity: 0.8;
}

/* Modal Styling */
.levelfinishpopup {
    display: flex;
    flex-direction: column;
    background: #fff;
    width: 500px;
    max-width: 90vw;
    padding: 0;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    text-align: left;
}

.modal-header {
    padding: 20px;
    border-bottom: 1px solid #eee;
    background: #f9f9f9;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--accent-green);
}

.modal-body {
    padding: 20px;
}

.modal-footer {
    padding: 20px;
    border-top: 1px solid #eee;
    text-align: right;
}

.unlock-section {
    margin-bottom: 20px;
}

.unlock-section p {
    font-weight: bold;
    color: var(--heading-color);
}

.unlocked-items {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.badge {
    background: var(--accent-color);
    color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: bold;
}

.unlocks-instructions {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}

.speed-unlock-badge {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    color: white;
    font-size: 18px;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    animation: speedUnlockPulse 0.6s ease-out;
}

.speed-unlock-badge i {
    font-size: 28px;
}

@keyframes speedUnlockPulse {
    0% {
        transform: scale(0.9);
        opacity: 0;
    }
    50% {
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.unlocked-instruction {
    width: 80px;
    flex-shrink: 0;
}

.primary-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: var(--radius-sm);
    font-size: 1rem;
    cursor: pointer;
}

.primary-btn:hover {
    background: var(--primary-hover);
}

/* Block Selection Modal */
.block-selection-popup {
    display: flex;
    flex-direction: column;
    background: #fff;
    width: 600px;
    max-width: 90vw;
    max-height: 80vh;
    padding: 0;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    text-align: left;
}

.search-container {
    padding: 15px;
    border-bottom: 1px solid #eee;
}

.block-search-input {
    width: 100%;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: var(--radius-sm);
    font-size: 1rem;
    font-family: var(--font-main);
    outline: none;
    transition: border-color 0.2s;
}

.block-search-input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.block-selection-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 15px;
    padding: 10px;
    max-height: 50vh;
    overflow-y: auto;
}

.block-selection-item {
    cursor: pointer;
    transition:
        transform 0.2s,
        box-shadow 0.2s,
        outline 0.2s;
    border-radius: 4px;
}

.block-selection-item:hover {
    transform: translateY(-2px);
}

.block-selection-item.highlighted-block {
    outline: 4px solid #0066ff;
    outline-offset: 2px;
    box-shadow:
        0 0 0 3px rgba(0, 102, 255, 0.4),
        0 0 15px rgba(0, 102, 255, 0.6);
    z-index: 1;
    position: relative;
}

.block-selection-item .selection-instruction {
    width: 100%;
}

.secondary-btn {
    background: #f0f0f0;
    color: #333;
    border: 1px solid #ddd;
    padding: 10px 20px;
    border-radius: var(--radius-sm);
    font-size: 1rem;
    cursor: pointer;
}

.secondary-btn:hover {
    background: #e0e0e0;
    border-color: #bbb;
}
</style>
