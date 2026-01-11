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
            </div>
            <div class="modal-footer">
                <button class="primary-btn" @click="$router.push({ path: '/' })">OK</button>
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

    <div class="game-layout">
        <aside class="game-sidebar">
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
            <div class="game-header">
                <div class="level-info">
                    <template v-if="name">
                        <h1>
                            <span class="level-id">{{ name }}</span>
                            <T v-if="displayName" :textKey="`levels.${name}.displayName`" />
                        </h1>
                        <p v-if="description" class="level-desc">
                            <T :textKey="`levels.${name}.description`" />
                        </p>
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
                            class="control-btn"
                            @click="playButton"
                            :disabled="playing && !multiplePlayButtons"
                            :title="playing && activeMode === 'regular' ? 'Pause' : 'Play'"
                        >
                            <i
                                :class="
                                    playing && activeMode === 'regular'
                                        ? 'bi-pause-fill'
                                        : 'bi-play-fill'
                                "
                            />
                        </button>
                        <button
                            class="control-btn"
                            v-if="fastButtonUnlocked"
                            @click="fastButton"
                            :disabled="playing && !multiplePlayButtons && activeMode !== 'fast'"
                            :title="playing && activeMode === 'fast' ? 'Pause' : 'Fast Forward'"
                        >
                            <i
                                :class="
                                    playing && activeMode === 'fast'
                                        ? 'bi-pause-fill'
                                        : 'bi-skip-forward-fill'
                                "
                            />
                        </button>
                        <button
                            class="control-btn"
                            v-if="ultraFastButtonUnlocked"
                            @click="ultraFastButton"
                            :disabled="
                                playing && !multiplePlayButtons && activeMode !== 'lightning'
                            "
                            :title="playing && activeMode === 'lightning' ? 'Pause' : 'Turbo'"
                        >
                            <i
                                :class="
                                    playing && activeMode === 'lightning'
                                        ? 'bi-pause-fill'
                                        : 'bi-lightning-fill'
                                "
                            />
                        </button>
                    </div>
                </div>
            </div>

            <div class="validation-panel" v-if="validation">
                <div class="test-cases-header">
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
                            <template v-if="birdIsLoaded">
                                <span
                                    v-for="(val, idx) in input"
                                    :key="'in' + idx"
                                    class="stack-item"
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
                    <div class="io-group">
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
                                    v-for="(item, index) in bird.stack.slice().reverse()"
                                    :key="bird.stack.length - index"
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
        finishLevel?: () => void
        unlocksLevels?: string[]
        unlocksInstructions?: string[]
        description?: string
        displayName?: string
        name?: string
        unlocked?: boolean
        completed?: boolean
        validation?: TestCase[]
        creeps?: Creep[]
    }>(),
    {
        cols: 7,
        rows: 7,
        creeps: () => [],
        unlocksLevels: () => [],
        unlocksInstructions: () => [],
    },
)

const store = useStore()

const selectedTestCase = ref<TestCase | null>(null)
const speed = ref(100)
const stepFunctionMutex = ref(false)
const showLevelCompletedModal = ref(false)
const showBlockSelectionModal = ref(false)
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
const flappingInterval = ref<ReturnType<typeof setInterval> | null>(null)
const userPlacedTiles = ref<Tile[]>([])
const completedTestCases = ref<Record<number, boolean>>({})
const loadedCreeps = ref<Creep[]>(cloneDeep(props.creeps))
const loadedLevelTiles = ref<Tile[]>(cloneDeep(props.levelTiles || []))
const activeMode = ref<'regular' | 'fast' | 'lightning' | null>(null)

const boardStyle = computed(() => {
    const ratio = (props.cols || 7) / (props.rows || 7)
    return {
        'grid-template-columns': `repeat(${props.cols}, minmax(0, 1fr))`,
        'grid-template-rows': `repeat(${props.rows}, minmax(0, 1fr))`,
        'aspect-ratio': `${props.cols} / ${props.rows}`,
        width: '100%',
        'max-width': `min(1000px, 100%, calc((100vh - 350px) * ${ratio}))`,
        'max-height': 'calc(100vh - 350px)',
    }
})

const ultraFastButtonUnlocked = computed(() => true)
const fastButtonUnlocked = computed(() => true)
const multiplePlayButtons = computed(
    () => fastButtonUnlocked.value || ultraFastButtonUnlocked.value,
)

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

const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        if (showBlockSelectionModal.value) {
            closeBlockSelectionModal()
        }
        if (showLevelCompletedModal.value) {
            showLevelCompletedModal.value = false
        }
        // Clear highlight when pressing Escape
        if (!showBlockSelectionModal.value && !showLevelCompletedModal.value) {
            highlightedSquareX.value = null
            highlightedSquareY.value = null
            highlightSource.value = null
        }
    } else {
        // Handle other keyboard navigation
        handleKeyboardNavigation(event)
    }
}

const devMode = computed(() => {
    return import.meta.env.DEV
})
const spawnBird = () => {
    let found = false
    const newBird: Bird = {
        x: null,
        y: null,
        flappingImage: true,
        direction: 'right',
        stack: [],
        birdClasses: [],
    }
    for (const tile of allTiles.value) {
        if (tile.name === 'STRT') {
            newBird.x = tile.x
            newBird.y = tile.y
            found = true
        }
    }
    if (!found) {
        throw new Error('no STRT block found!')
    }

    if (flappingInterval.value) {
        clearInterval(flappingInterval.value)
    }
    flappingInterval.value = setInterval(() => {
        for (const bird of birds.value) {
            bird.flappingImage = !bird.flappingImage
        }
    }, speed.value)
    birds.value.push(newBird)
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

    bird.birdClasses.length = 0
    bird.birdClasses.push(toRaw(bird.direction))
    if (newX <= 0 || newY <= 0 || newX > props.cols || newY > props.rows) {
        return dieBird('errors.outOfBoard', bird)
    } else {
        for (const tile of allTiles.value) {
            if (tile.name === 'BLCK' && tile.x === bird.x + xDiff && tile.y === bird.y + yDiff) {
                return dieBird('errors.hitWall', bird)
            }
        }
        bird.x += xDiff
        bird.y += yDiff
        for (const creep of loadedCreeps.value) {
            if (creep.x === bird.x && creep.y === bird.y) {
                return dieBird('errors.ghostCaught', bird)
            }
        }
    }
}

const dieBird = async (message: string, bird: Bird) => {
    shouldStopPlaying.value = true
    await sleep(0.5 * speed.value)
    bird.birdClasses.push('dead')
    await sleep(500)
    const $tr = instance?.proxy?.$tr
    const translatedMessage = $tr ? $tr(message) : message
    toast.warning(translatedMessage)
    reset()
}

const finish = () => {
    reset()
    let allLevelsFinished = true
    let nextTestCase: TestCase | null = null

    if (props.validation) {
        for (const testCaseIndex in props.validation) {
            if (props.validation[parseInt(testCaseIndex)] === selectedTestCase.value) {
                completedTestCases.value[parseInt(testCaseIndex)] = true
                const $tr = instance?.proxy?.$tr
                const translatedMessage = $tr
                    ? $tr('board.testCaseDone', {
                          testCaseIndex: parseInt(testCaseIndex) + 1,
                      })
                    : `Test case ${parseInt(testCaseIndex) + 1} done!`
                toast.info(translatedMessage)
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
        if (props.name) {
            store.completeLevel({
                levelName: props.name,
                isCompleted: true,
            })
        }
        showLevelCompletedModal.value = true
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
    if (playing.value) {
        return
    }
    activeMode.value = 'fast'
    shouldStopPlaying.value = false
    play()
}

const stepButton = async () => {
    speed.value = 200
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
        if (selectedTestCase.value) {
            input.value = [...toRaw(selectedTestCase.value.input)]
        }
        spawnBird()
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
        if (instruction && instruction.execute) {
            shouldMove = await instruction.execute(
                bird,
                {
                    input: input.value,
                    speed: speed.value,
                    finish,
                    dieBird,
                    spawnBird,
                    allTiles: allTiles.value,
                },
                instruction,
            )
        }
        if (shouldMove === 'SKIP') {
            await sleep(2 * speed.value)
        }
        if (!birdIsLoaded.value) {
            break
        }
        if (birdIsLoaded.value && shouldMove !== 'NOMOVE') {
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

onMounted(() => {
    if (!props.name) {
        return
    }
    if (props.validation && props.validation.length > 0) {
        selectedTestCase.value = props.validation[0] || null
    }
    const userPlacedTilesData = JSON.parse(localStorage.getItem(props.name) || '[]') as Array<{
        x: number
        y: number
        code: string
    }>
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
    window.addEventListener('keydown', handleEscapeKey)
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
    overflow-y: auto;
    overflow-x: hidden;
    background-color: var(--bg-color);
    min-width: 0;
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

.level-desc {
    margin: 5px 0 0 0;
    color: var(--text-light);
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

/* Validation Panel */
.validation-panel {
    background: white;
    padding: 10px 20px;
    border-radius: var(--radius-md);
    margin-bottom: 20px;
    box-shadow: var(--shadow-sm);
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
}

/* Board */
.board-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 20px;
    width: 100%;
    min-width: 0;
    /* Allow container to shrink below content size */
    min-height: 0;
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
    z-index: 100;
    width: 100%;
    height: 100%;
    user-select: none;
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
    display: block;
    width: 35px;
    /* Thinner stack */
    border-radius: 4px;
    background-color: rgba(51, 51, 51, 0.9);
    color: white;
    box-shadow: var(--shadow-sm);
    z-index: 200;
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
    border-bottom: 1px solid #555;
}

.stack li:last-child {
    border-bottom: none;
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
