<template>
    <div class="wiki-container">
        <div class="wiki-header">
            <button class="back-btn" @click="$router.push({ path: '/' })">
                <i class="bi-arrow-left"></i> <T textKey="wiki.backToMenu" />
            </button>
            <h1><T textKey="wiki.title" /></h1>
            <p class="wiki-description"><T textKey="wiki.description" /></p>
        </div>

        <div class="category-filter">
            <button
                v-for="cat in categories"
                :key="cat"
                :class="{ active: selectedCategory === cat }"
                @click="selectedCategory = cat"
            >
                {{ cat === 'all' ? $t('wiki.allBlocks') : cat }}
            </button>
        </div>

        <div class="blocks-grid">
            <div
                v-for="blockDemo in filteredBlockDemos"
                :key="blockDemo.name"
                class="block-demo-card"
                :ref="(el) => setCardRef(el, blockDemo.name)"
            >
                <div class="block-header">
                    <div class="block-title">
                        <Instruction
                            v-if="store.instructions[blockDemo.name]"
                            :symbol="store.instructions[blockDemo.name]?.symbol || ''"
                            :name="blockDemo.name"
                            :description="store.instructions[blockDemo.name]?.description || ''"
                            :instructionClass="
                                store.instructions[blockDemo.name]?.instructionClass || 'A'
                            "
                            unlocked
                            class="block-icon"
                        />
                        <div>
                            <h3>{{ blockDemo.name }}</h3>
                            <p class="block-description">
                                <T :textKey="`instructions.${blockDemo.name}`" />
                            </p>
                        </div>
                    </div>
                    <div class="header-controls">
                        <button class="play-btn" @click="togglePlay(blockDemo.name)">
                            <i
                                :class="
                                    activeBlockName === blockDemo.name
                                        ? 'bi-pause-fill'
                                        : 'bi-play-fill'
                                "
                            ></i>
                        </button>
                        <div v-if="blockDemo.scenarios.length > 1" class="scenario-indicator">
                            <span
                                v-for="(_, idx) in blockDemo.scenarios"
                                :key="idx"
                                class="dot"
                                :class="{ active: currentScenarios[blockDemo.name] === idx }"
                            ></span>
                        </div>
                    </div>
                </div>

                <div class="demo-board">
                    <Board
                        :key="`${blockDemo.name}-${currentScenarios[blockDemo.name]}`"
                        :cols="getCurrentScenario(blockDemo).cols || 5"
                        :rows="getCurrentScenario(blockDemo).rows || 5"
                        :levelTiles="getCurrentScenario(blockDemo).tiles"
                        :validation="getCurrentScenario(blockDemo).validation"
                        :name="`wiki-${blockDemo.name}-${currentScenarios[blockDemo.name] || 0}`"
                        wikiMode
                        :active="activeBlockName === blockDemo.name"
                        @finish-level="handleBoardFinish(blockDemo.name, blockDemo.scenarios)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from '../store'
import Instruction from './Instruction.vue'
import Board from './Board.vue'

const store = useStore()
const selectedCategory = ref('all')
const cardRefs = ref<Record<string, HTMLElement>>({})
const currentScenarios = ref<Record<string, number>>({})
const intersectionObserver = ref<IntersectionObserver | null>(null)
const activeBlockName = ref<string | null>(null)

interface Scenario {
    cols?: number
    rows?: number
    tiles: Array<{ name: string; x: number; y: number; [key: string]: any }>
    validation?: Array<{ input: number[]; finalStack: number[] }>
}

interface BlockDemo {
    name: string
    category: string
    scenarios: Scenario[]
}

const categories = computed(() => {
    const cats = new Set(['all'])
    blockDemos.forEach((demo) => cats.add(demo.category))
    return Array.from(cats)
})

const filteredBlockDemos = computed(() => {
    if (selectedCategory.value === 'all') {
        return blockDemos
    }
    return blockDemos.filter((demo) => demo.category === selectedCategory.value)
})

const getCurrentScenario = (blockDemo: BlockDemo): Scenario => {
    const index = currentScenarios.value[blockDemo.name] || 0
    // Make sure we always get a valid scenario even if index is out of bounds (though it shouldn't be)
    const scenario =
        blockDemo.scenarios[index] !== undefined
            ? blockDemo.scenarios[index]
            : blockDemo.scenarios[0]

    if (!scenario) {
        return {
            tiles: [],
        }
    }

    // Enrich tiles with store data
    const enrichedTiles = scenario.tiles.map((tile) => {
        const instruction = store.instructions[tile.name]
        return {
            ...tile,
            ...(instruction || {}),
            // Ensure these are present to pass checks in Board.vue
            symbol: instruction?.symbol || '?',
            description: instruction?.description || '',
            instructionClass: instruction?.instructionClass || 'A',
        }
    })

    return {
        ...scenario,
        tiles: enrichedTiles,
    }
}

const setCardRef = (el: any, name: string) => {
    if (el) {
        cardRefs.value[name] = el as HTMLElement
    }
}

const togglePlay = (name: string) => {
    if (activeBlockName.value === name) {
        activeBlockName.value = null
    } else {
        activeBlockName.value = name
    }
}

const handleBoardFinish = (blockName: string, scenarios: Scenario[]) => {
    console.log('handleBoardFinish called for:', blockName)
    if (scenarios.length <= 1) {
        console.log('Only 1 scenario, not cycling')
        return
    }

    // Cycle scenario
    console.log('Cycling scenario for:', blockName)
    cycleScenario(blockName, scenarios)
}

const cycleScenario = (blockName: string, scenarios: Scenario[]) => {
    if (scenarios.length <= 1) return
    const current = currentScenarios.value[blockName] || 0
    const next = (current + 1) % scenarios.length
    console.log(`Cycling ${blockName} from ${current} to ${next}`)
    currentScenarios.value[blockName] = next
}

// Block demonstration configurations
const blockDemos: BlockDemo[] = [
    {
        name: 'STRT',
        category: 'Navigation',
        scenarios: [
            {
                cols: 4,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'FINI', x: 4, y: 2 },
                ],
                validation: [{ input: [], finalStack: [] }],
            },
        ],
    },
    {
        name: 'RGHT',
        category: 'Navigation',
        scenarios: [
            {
                cols: 5,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'RGHT', x: 2, y: 2 },
                    { name: 'FINI', x: 5, y: 2 },
                ],
                validation: [{ input: [], finalStack: [] }],
            },
        ],
    },
    {
        name: 'DOWN',
        category: 'Navigation',
        scenarios: [
            {
                cols: 4,
                rows: 4,
                tiles: [
                    { name: 'STRT', x: 2, y: 1 },
                    { name: 'DOWN', x: 3, y: 1 },
                    { name: 'FINI', x: 3, y: 4 },
                ],
                validation: [{ input: [], finalStack: [] }],
            },
        ],
    },
    {
        name: 'LEFT',
        category: 'Navigation',
        scenarios: [
            {
                cols: 5,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'RGHT', x: 2, y: 2 },
                    { name: 'LEFT', x: 5, y: 2 },
                    { name: 'FINI', x: 3, y: 2 },
                ],
                validation: [{ input: [], finalStack: [] }],
            },
        ],
    },
    {
        name: 'UPWD',
        category: 'Navigation',
        scenarios: [
            {
                cols: 4,
                rows: 4,
                tiles: [
                    { name: 'STRT', x: 2, y: 4 },
                    { name: 'UPWD', x: 3, y: 4 },
                    { name: 'FINI', x: 3, y: 1 },
                ],
                validation: [{ input: [], finalStack: [] }],
            },
        ],
    },
    {
        name: 'REVR',
        category: 'Navigation',
        scenarios: [
            {
                cols: 6,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'REVR', x: 5, y: 2 },
                    { name: 'FINI', x: 2, y: 2 },
                ],
                validation: [{ input: [], finalStack: [] }],
            },
        ],
    },
    {
        name: 'READ',
        category: 'Stack Operations',
        scenarios: [
            {
                cols: 4,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'READ', x: 2, y: 2 },
                    { name: 'FINI', x: 4, y: 2 },
                ],
                validation: [{ input: [5], finalStack: [5] }],
            },
            {
                cols: 4,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'READ', x: 2, y: 2 },
                    { name: 'READ', x: 3, y: 2 },
                    { name: 'FINI', x: 4, y: 2 },
                ],
                validation: [{ input: [3, 7], finalStack: [7, 3] }],
            },
        ],
    },
    {
        name: 'DUP1',
        category: 'Stack Operations',
        scenarios: [
            {
                cols: 5,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'READ', x: 2, y: 2 },
                    { name: 'DUP1', x: 3, y: 2 },
                    { name: 'FINI', x: 5, y: 2 },
                ],
                validation: [{ input: [4], finalStack: [4, 4] }],
            },
        ],
    },
    {
        name: 'SWAP',
        category: 'Stack Operations',
        scenarios: [
            {
                cols: 5,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'READ', x: 2, y: 2 },
                    { name: 'READ', x: 3, y: 2 },
                    { name: 'SWAP', x: 4, y: 2 },
                    { name: 'FINI', x: 5, y: 2 },
                ],
                validation: [{ input: [2, 5], finalStack: [2, 5] }],
            },
        ],
    },
    {
        name: 'PLUS',
        category: 'Math',
        scenarios: [
            {
                cols: 5,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'READ', x: 2, y: 2 },
                    { name: 'READ', x: 3, y: 2 },
                    { name: 'PLUS', x: 4, y: 2 },
                    { name: 'FINI', x: 5, y: 2 },
                ],
                validation: [{ input: [3, 4], finalStack: [7] }],
            },
            {
                cols: 5,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'READ', x: 2, y: 2 },
                    { name: 'READ', x: 3, y: 2 },
                    { name: 'PLUS', x: 4, y: 2 },
                    { name: 'FINI', x: 5, y: 2 },
                ],
                validation: [{ input: [10, 20], finalStack: [30] }],
            },
        ],
    },
    {
        name: 'MINU',
        category: 'Math',
        scenarios: [
            {
                cols: 5,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'READ', x: 2, y: 2 },
                    { name: 'READ', x: 3, y: 2 },
                    { name: 'MINU', x: 4, y: 2 },
                    { name: 'FINI', x: 5, y: 2 },
                ],
                validation: [{ input: [10, 3], finalStack: [7] }],
            },
        ],
    },
    {
        name: 'ADD1',
        category: 'Math',
        scenarios: [
            {
                cols: 5,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'READ', x: 2, y: 2 },
                    { name: 'ADD1', x: 3, y: 2 },
                    { name: 'FINI', x: 5, y: 2 },
                ],
                validation: [{ input: [5], finalStack: [6] }],
            },
        ],
    },
    {
        name: 'SUB1',
        category: 'Math',
        scenarios: [
            {
                cols: 5,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'READ', x: 2, y: 2 },
                    { name: 'SUB1', x: 3, y: 2 },
                    { name: 'FINI', x: 5, y: 2 },
                ],
                validation: [{ input: [5], finalStack: [4] }],
            },
        ],
    },
    {
        name: 'SUMA',
        category: 'Math',
        scenarios: [
            {
                cols: 6,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'READ', x: 2, y: 2 },
                    { name: 'READ', x: 3, y: 2 },
                    { name: 'READ', x: 4, y: 2 },
                    { name: 'SUMA', x: 5, y: 2 },
                    { name: 'FINI', x: 6, y: 2 },
                ],
                validation: [{ input: [3, 4, 5], finalStack: [12] }],
            },
        ],
    },
    {
        name: 'GEQ1',
        category: 'Logic',
        scenarios: [
            {
                cols: 4,
                rows: 4,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'READ', x: 2, y: 2 },
                    { name: 'GEQ1', x: 3, y: 2 },
                    { name: 'FINI', x: 4, y: 2 },
                ],
                validation: [{ input: [5], finalStack: [] }],
            },
            {
                cols: 4,
                rows: 4,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'READ', x: 2, y: 2 },
                    { name: 'GEQ1', x: 3, y: 2 },
                    { name: 'FINI', x: 3, y: 4 },
                ],
                validation: [{ input: [0], finalStack: [] }],
            },
        ],
    },
    {
        name: 'JMP1',
        category: 'Advanced',
        scenarios: [
            {
                cols: 6,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'JMP1', x: 2, y: 2 },
                    { name: 'BLCK', x: 3, y: 2 },
                    { name: 'FINI', x: 4, y: 2 },
                ],
                validation: [{ input: [], finalStack: [] }],
            },
        ],
    },
    {
        name: 'VOID',
        category: 'Stack Operations',
        scenarios: [
            {
                cols: 5,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'READ', x: 2, y: 2 },
                    { name: 'READ', x: 3, y: 2 },
                    { name: 'VOID', x: 4, y: 2 },
                    { name: 'FINI', x: 5, y: 2 },
                ],
                validation: [{ input: [3, 7], finalStack: [3] }],
            },
        ],
    },
    {
        name: 'CLER',
        category: 'Stack Operations',
        scenarios: [
            {
                cols: 5,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'READ', x: 2, y: 2 },
                    { name: 'READ', x: 3, y: 2 },
                    { name: 'CLER', x: 4, y: 2 },
                    { name: 'FINI', x: 5, y: 2 },
                ],
                validation: [{ input: [3, 7, 9], finalStack: [] }],
            },
        ],
    },
    {
        name: 'SIZE',
        category: 'Stack Operations',
        scenarios: [
            {
                cols: 5,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'READ', x: 2, y: 2 },
                    { name: 'READ', x: 3, y: 2 },
                    { name: 'SIZE', x: 4, y: 2 },
                    { name: 'FINI', x: 5, y: 2 },
                ],
                validation: [{ input: [3, 7], finalStack: [2, 7, 3] }],
            },
        ],
    },
    {
        name: 'SRT2',
        category: 'Advanced',
        scenarios: [
            {
                cols: 5,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'READ', x: 2, y: 2 },
                    { name: 'READ', x: 3, y: 2 },
                    { name: 'SRT2', x: 4, y: 2 },
                    { name: 'FINI', x: 5, y: 2 },
                ],
                validation: [{ input: [7, 3], finalStack: [7, 3] }],
            },
        ],
    },
    {
        name: 'SRTA',
        category: 'Advanced',
        scenarios: [
            {
                cols: 6,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'READ', x: 2, y: 2 },
                    { name: 'READ', x: 3, y: 2 },
                    { name: 'READ', x: 4, y: 2 },
                    { name: 'SRTA', x: 5, y: 2 },
                    { name: 'FINI', x: 6, y: 2 },
                ],
                validation: [{ input: [9, 3, 7, 1], finalStack: [9, 7, 3, 1] }],
            },
        ],
    },
    {
        name: 'REVA',
        category: 'Advanced',
        scenarios: [
            {
                cols: 6,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'READ', x: 2, y: 2 },
                    { name: 'READ', x: 3, y: 2 },
                    { name: 'READ', x: 4, y: 2 },
                    { name: 'REVA', x: 5, y: 2 },
                    { name: 'FINI', x: 6, y: 2 },
                ],
                validation: [{ input: [1, 2, 3], finalStack: [1, 2, 3] }],
            },
        ],
    },
    {
        name: 'FLP2',
        category: 'Logic',
        scenarios: [
            {
                cols: 5,
                rows: 5,
                tiles: [
                    { name: 'STRT', x: 1, y: 3 },
                    { name: 'FLP2', x: 3, y: 3, state: 0 },
                    { name: 'FINI', x: 5, y: 3 },
                    { name: 'SPWN', x: 2, y: 3 },
                ],
                validation: [{ input: [], finalStack: [] }],
            },
        ],
    },
    {
        name: 'DUP2',
        category: 'Stack Operations',
        scenarios: [
            {
                cols: 5,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'READ', x: 2, y: 2 },
                    { name: 'READ', x: 3, y: 2 },
                    { name: 'DUP2', x: 4, y: 2 },
                    { name: 'FINI', x: 5, y: 2 },
                ],
                validation: [{ input: [3, 7], finalStack: [7, 3, 7, 3] }],
            },
        ],
    },
    {
        name: 'ROT1',
        category: 'Stack Operations',
        scenarios: [
            {
                cols: 5,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'READ', x: 2, y: 2 },
                    { name: 'READ', x: 3, y: 2 },
                    { name: 'ROT1', x: 4, y: 2 },
                    { name: 'FINI', x: 5, y: 2 },
                ],
                validation: [{ input: [3, 7], finalStack: [3, 7] }],
            },
        ],
    },
    {
        name: 'EMPT',
        category: 'Stack Operations',
        scenarios: [
            {
                cols: 4,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'EMPT', x: 2, y: 2 },
                    { name: 'FINI', x: 4, y: 2 },
                ],
                validation: [{ input: [], finalStack: [1] }],
            },
            {
                cols: 5,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'READ', x: 2, y: 2 },
                    { name: 'EMPT', x: 3, y: 2 },
                    { name: 'FINI', x: 5, y: 2 },
                ],
                validation: [{ input: [5], finalStack: [0, 5] }],
            },
        ],
    },
    {
        name: 'INSZ',
        category: 'Stack Operations',
        scenarios: [
            {
                cols: 5,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'INSZ', x: 2, y: 2 },
                    { name: 'READ', x: 3, y: 2 },
                    { name: 'INSZ', x: 4, y: 2 },
                    { name: 'FINI', x: 5, y: 2 },
                ],
                validation: [{ input: [7, 9], finalStack: [1, 7, 2] }],
            },
        ],
    },
    {
        name: 'SRTN',
        category: 'Advanced',
        scenarios: [
            {
                cols: 6,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'READ', x: 2, y: 2 },
                    { name: 'READ', x: 3, y: 2 },
                    { name: 'READ', x: 4, y: 2 },
                    { name: 'SRTN', x: 5, y: 2 },
                    { name: 'FINI', x: 6, y: 2 },
                ],
                validation: [{ input: [9, 3, 7, 3], finalStack: [9, 7, 3] }],
            },
        ],
    },
    {
        name: 'REVN',
        category: 'Advanced',
        scenarios: [
            {
                cols: 6,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'READ', x: 2, y: 2 },
                    { name: 'READ', x: 3, y: 2 },
                    { name: 'READ', x: 4, y: 2 },
                    { name: 'REVN', x: 5, y: 2 },
                    { name: 'FINI', x: 6, y: 2 },
                ],
                validation: [{ input: [1, 2, 3, 2], finalStack: [2, 3, 1] }],
            },
        ],
    },
    {
        name: 'SUMN',
        category: 'Advanced',
        scenarios: [
            {
                cols: 6,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'READ', x: 2, y: 2 },
                    { name: 'READ', x: 3, y: 2 },
                    { name: 'READ', x: 4, y: 2 },
                    { name: 'SUMN', x: 5, y: 2 },
                    { name: 'FINI', x: 6, y: 2 },
                ],
                validation: [{ input: [5, 10, 15, 2], finalStack: [25, 5] }],
            },
        ],
    },
    {
        name: 'YOLO',
        category: 'Logic',
        scenarios: [
            {
                cols: 5,
                rows: 5,
                tiles: [
                    { name: 'STRT', x: 3, y: 3 },
                    { name: 'YOLO', x: 4, y: 3 },
                    { name: 'FINI', x: 5, y: 3 },
                ],
                validation: [{ input: [], finalStack: [] }],
            },
        ],
    },
    {
        name: 'DUMP',
        category: 'Advanced',
        scenarios: [
            {
                cols: 6,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'READ', x: 2, y: 2 },
                    { name: 'DUMP', x: 3, y: 2, state: null },
                    { name: 'READ', x: 4, y: 2 },
                    { name: 'DUMP', x: 3, y: 2, state: null },
                    { name: 'FINI', x: 6, y: 2 },
                ],
                validation: [{ input: [5, 9], finalStack: [5, 9] }],
            },
        ],
    },
    {
        name: 'BLCK',
        category: 'Navigation',
        scenarios: [
            {
                cols: 5,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 1 },
                    { name: 'DOWN', x: 2, y: 1 },
                    { name: 'BLCK', x: 2, y: 2 },
                    { name: 'FINI', x: 2, y: 3 },
                ],
                validation: [{ input: [], finalStack: [] }],
            },
        ],
    },
    {
        name: 'PRTI',
        category: 'Advanced',
        scenarios: [
            {
                cols: 6,
                rows: 4,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'PRTI', x: 3, y: 2 },
                    { name: 'BLCK', x: 4, y: 2 },
                    { name: 'PRTO', x: 3, y: 4 },
                    { name: 'FINI', x: 6, y: 4 },
                ],
                validation: [{ input: [], finalStack: [] }],
            },
        ],
    },
    {
        name: 'PRTO',
        category: 'Advanced',
        scenarios: [
            {
                cols: 6,
                rows: 4,
                tiles: [
                    { name: 'STRT', x: 1, y: 4 },
                    { name: 'PRTO', x: 3, y: 4 },
                    { name: 'BLCK', x: 4, y: 4 },
                    { name: 'PRTI', x: 3, y: 2 },
                    { name: 'FINI', x: 6, y: 2 },
                ],
                validation: [{ input: [], finalStack: [] }],
            },
        ],
    },
    {
        name: 'SPWN',
        category: 'Advanced',
        scenarios: [
            {
                cols: 5,
                rows: 4,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'SPWN', x: 2, y: 2 },
                    { name: 'DOWN', x: 3, y: 2 },
                    { name: 'FINI', x: 5, y: 2 },
                    { name: 'UPWD', x: 3, y: 3 },
                    { name: 'FINI', x: 3, y: 1 },
                ],
                validation: [{ input: [], finalStack: [] }],
            },
        ],
    },
    {
        name: 'WAIT',
        category: 'Advanced',
        scenarios: [
            {
                cols: 5,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'WAIT', x: 3, y: 2, state: 3 },
                    { name: 'FINI', x: 5, y: 2 },
                ],
                validation: [{ input: [], finalStack: [] }],
            },
        ],
    },
    {
        name: 'FLP3',
        category: 'Logic',
        scenarios: [
            {
                cols: 5,
                rows: 5,
                tiles: [
                    { name: 'STRT', x: 1, y: 3 },
                    { name: 'FLP3', x: 3, y: 3, state: 0 },
                    { name: 'FINI', x: 5, y: 3 },
                    { name: 'SPWN', x: 2, y: 3 },
                    { name: 'SPWN', x: 2, y: 3 },
                ],
                validation: [{ input: [], finalStack: [] }],
            },
        ],
    },
    {
        name: 'FLP4',
        category: 'Logic',
        scenarios: [
            {
                cols: 5,
                rows: 5,
                tiles: [
                    { name: 'STRT', x: 1, y: 3 },
                    { name: 'FLP4', x: 3, y: 3, state: 0 },
                    { name: 'FINI', x: 5, y: 3 },
                    { name: 'SPWN', x: 2, y: 3 },
                    { name: 'SPWN', x: 2, y: 3 },
                    { name: 'SPWN', x: 2, y: 3 },
                ],
                validation: [{ input: [], finalStack: [] }],
            },
        ],
    },
    {
        name: 'NOTE',
        category: 'Advanced',
        scenarios: [
            {
                cols: 4,
                rows: 3,
                tiles: [
                    { name: 'STRT', x: 1, y: 2 },
                    { name: 'NOTE', x: 2, y: 2 },
                    { name: 'FINI', x: 4, y: 2 },
                ],
                validation: [{ input: [], finalStack: [] }],
            },
        ],
    },
]

onMounted(() => {
    // Initialize current scenarios
    blockDemos.forEach((demo) => {
        currentScenarios.value[demo.name] = 0
    })

    // Set up intersection observer (still useful for potential future use or keeping ref behavior)
    intersectionObserver.value = new IntersectionObserver(
        (entries) => {
            // Timer-based cycling removed - we now cycle only on completion
        },
        {
            threshold: 0.5,
        },
    )

    // Observe all block cards
    setTimeout(() => {
        Object.entries(cardRefs.value).forEach(([name, el]) => {
            el.setAttribute('data-block-name', name)
            intersectionObserver.value?.observe(el)
        })
    }, 100)
})

onBeforeUnmount(() => {
    // Clean up observers
    intersectionObserver.value?.disconnect()
})
</script>

<style scoped>
.wiki-container {
    min-height: 100vh;
    background: var(--bg-color);
    padding: 20px;
}

.wiki-header {
    max-width: 1400px;
    margin: 0 auto 30px;
}

.wiki-header h1 {
    font-size: 2.5rem;
    margin: 20px 0 10px;
    color: var(--heading-color);
}

.wiki-description {
    font-size: 1.1rem;
    color: var(--text-light);
    margin-bottom: 20px;
}

.back-btn {
    padding: 8px 16px;
    font-size: 1rem;
    background: white;
    border: 1px solid #ddd;
    border-radius: var(--radius-sm);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
}

.back-btn:hover {
    background: #f8f8f8;
    border-color: var(--primary-color);
}

.category-filter {
    max-width: 1400px;
    margin: 0 auto 30px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.category-filter button {
    padding: 8px 16px;
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
}

.category-filter button:hover {
    border-color: var(--primary-color);
    background: #f0f7ff;
}

.category-filter button.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.blocks-grid {
    max-width: 1400px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
    gap: 30px;
}

.block-demo-card {
    background: white;
    border-radius: var(--radius-lg);
    padding: 20px;
    box-shadow: var(--shadow-md);
    transition: transform 0.2s;
}

.block-demo-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

.block-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
}

.block-title {
    display: flex;
    gap: 15px;
    align-items: flex-start;
    flex: 1;
}

.block-icon {
    flex-shrink: 0;
}

.block-title h3 {
    margin: 0 0 5px 0;
    font-size: 1.3rem;
    color: var(--heading-color);
    font-family: var(--font-mono);
}

.block-icon {
    flex-shrink: 0;
    width: 60px;
    height: 60px;
    font-size: 0.8rem; /* Scale down text inside */
}

/* Override Instruction component styles when inside block-icon */
:deep(.block-icon.instruction) {
    width: 60px;
    height: 60px;
}

.block-description {
    margin: 0;
    color: var(--text-light);
    font-size: 0.95rem;
}

.scenario-indicator {
    display: flex;
    gap: 6px;
    padding: 5px;
}

.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ddd;
    transition: background 0.3s;
}

.dot.active {
    background: var(--primary-color);
}

.demo-board {
    border: 2px solid #f0f0f0;
    border-radius: var(--radius-md);
    padding: 15px;
    background: #fafafa;
    min-height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
}

@media (max-width: 768px) {
    .blocks-grid {
        grid-template-columns: 1fr;
    }

    .wiki-header h1 {
        font-size: 2rem;
    }
}

.header-controls {
    display: flex;
    align-items: center;
    gap: 15px;
}

.play-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    color: var(--primary-color);
    transition: all 0.2s;
}

.play-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    transform: scale(1.05);
}
</style>
