<template>
  <!-- Level Finish Pop-up -->
  <vue-final-modal v-model="showLevelCompletedModal" classes="modal-container" content-class="modal-content">
    <div class="levelfinishpopup">
      <div class="modal-header">
        <h2>
          <T textKey="You finished the level, great job!" />
        </h2>
      </div>
      <div class="modal-body">
        <div v-if="unlocksLevels && unlocksLevels.length > 0" class="unlock-section">
          <p>
            <T textKey="You have unlocked the following levels" />:
          </p>
          <div class="unlocked-items">
            <span class="badge" v-for="level in unlocksLevels" :key="level">{{ level }}</span>
          </div>
        </div>
        <div v-if="unlocksInstructions && unlocksInstructions.length > 0" class="unlock-section">
          <p>
            <T textKey="You have unlocked the following blocks" />:
          </p>
          <div class="unlocks-instructions">
            <Instruction v-for="(instructionCode, index) in unlocksInstructions" :key="index"
              v-bind="store.instructions[instructionCode]" unlocked />
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="primary-btn" @click="$router.push({ path: '/' })">OK</button>
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
          <T textKey="Blocks" />
        </h3>
      </div>

      <p class="instruction-hint">
        <T textKey="Drag to the board on the right." />
      </p>

      <div class="sidebar-content">
        <InstructionList :draggable="!birdIsLoaded && !playing" unlockedOnly :cols="2"
          :locked="birdIsLoaded || playing" />
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
              <T :textKey="displayName" />
            </h1>
            <p class="level-desc">
              <T :textKey="description" />
            </p>
          </template>
          <h1 v-else>
            <T textKey="Board" />
          </h1>
        </div>

        <div class="game-controls">
          <button :disabled="birdIsLoaded || playing" class="control-btn delete-btn" @click="clearWithWarning"
            title="Clear Board">
            <i class="bi-trash" />
          </button>
          <div class="playback-controls">
            <button class="control-btn" @click="resetButton" :disabled="!birdIsLoaded" title="Stop">
              <i class="bi-stop-fill" />
            </button>
            <button class="control-btn" @click="stepButton" title="Step">
              <i class="bi-skip-end-fill" />
            </button>
            <button class="control-btn primary" @click="playButton" :disabled="playing && !multiplePlayButtons"
              title="Play">
              <i class="bi-play-fill" />
            </button>
            <button class="control-btn" v-if="fastButtonUnlocked" @click="fastButton"
              :disabled="playing && !multiplePlayButtons" title="Fast Forward">
              <i class="bi-skip-forward-fill" />
            </button>
            <button class="control-btn" v-if="ultraFastButtonUnlocked" @click="ultraFastButton"
              :disabled="playing && !multiplePlayButtons" title="Turbo">
              <i class="bi-lightning-fill" />
            </button>
          </div>
        </div>
      </div>

      <div class="validation-panel" v-if="validation">
        <div class="test-cases-header">
          <span class="label">
            <T textKey="Test cases" />
          </span>
          <ul class="test-case-tabs">
            <li @click="selectedTestCase = testCase" v-for="(testCase, idx) in validation" :key="idx" :class="{
              selected: testCase === selectedTestCase,
              completed: idx in completedTestCases,
            }">
              {{ idx + 1 }}
            </li>
          </ul>
        </div>

        <div class="test-case-details" v-if="selectedTestCase">
          <div class="io-group">
            <span class="label">
              <T textKey="Input" />:
            </span>
            <div class="stack-view">
              <span v-if="birdIsLoaded" v-for="(val, idx) in input" :key="'in' + idx" class="stack-item">{{ val
                }}</span>
              <span v-else v-for="(val, idx) in selectedTestCase.input" :key="'in-s' + idx" class="stack-item">{{ val
              }}</span>
            </div>
          </div>
          <div class="io-group">
            <span class="label">
              <T textKey="Expected" />:
            </span>
            <div class="stack-view">
              <span v-for="(val, idx) in selectedTestCase.finalStack" :key="'out' + idx" class="stack-item">{{ val
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="board-container">
        <div class="board" :style="boardStyle">
          <template v-for="col in cols" :key="col">
            <div v-for="row in rows" :key="row" class="field" :style="{ 'grid-column': col, 'grid-row': row }"
              @drop="drop(col, row, $event)" @dragover="allowDrop" @dragleave="removeDrop"></div>
          </template>
          <template v-if="birdIsLoaded">
            <div v-for="(bird, index) in birds" :key="index" class="field thebird" :class="bird.birdClasses"
              :style="birdStyle(bird)">
              <transition-group name="stackies" class="stack" tag="ul">
                <li v-for="(item, index) in bird.stack.slice().reverse()" :key="bird.stack.length - index"
                  class="field-style-F">
                  {{ item }}
                </li>
              </transition-group>
              <img :src="getBirdImageSource(bird)" />
            </div>
          </template>
          <div v-for="(creep, index) in loadedCreeps" :key="index" class="field creep" :class="creep.direction"
            :style="birdStyle(creep)">
            <img src="@/assets/flappy1.png" />
          </div>
          <Instruction v-for="(levelTile, index) in allTiles" :key="index" v-bind="levelTile" unlocked
            :userPlaced="!birdIsLoaded && levelTile.userPlaced" :draggable="!birdIsLoaded && levelTile.userPlaced"
            :deleteMethod="() => deletePlacedInstruction(levelTile)" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { sleep, oppositeDirection } from '../util'
import { useStore } from '../store'
import { toRaw } from 'vue'
import Instruction from './Instruction.vue'
import InstructionList from './InstructionList.vue'
import { useToast } from 'vue-toastification'
import flappy1 from '@/assets/flappy1.png'
import flappy2 from '@/assets/flappy2.png'
import cloneDeep from 'lodash/cloneDeep'

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
  execute?: (bird: Bird, board: any, tile: Tile) => Promise<string | void>
  [key: string]: any
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
const playing = ref(false)
const shouldStopPlaying = ref(false)
const birds = ref<Bird[]>([])
const input = ref<number[]>([])
const flappingInterval = ref<ReturnType<typeof setInterval> | null>(null)
const userPlacedTiles = ref<Tile[]>([])
const completedTestCases = ref<Record<number, boolean>>({})
const loadedCreeps = ref<Creep[]>(cloneDeep(props.creeps))
const loadedLevelTiles = ref<Tile[]>(cloneDeep(props.levelTiles || []))

const boardStyle = computed(() => {
  const ratio = (props.cols || 7) / (props.rows || 7)
  return {
    'grid-template-columns': `repeat(${props.cols}, minmax(0, 1fr))`,
    'grid-template-rows': `repeat(${props.rows}, minmax(0, 1fr))`,
    'aspect-ratio': `${props.cols} / ${props.rows}`,
    'width': '100%',
    'max-width': `min(1000px, 100%, calc((100vh - 350px) * ${ratio}))`,
    'max-height': 'calc(100vh - 350px)',
  }
})

const ultraFastButtonUnlocked = computed(() => true)
const fastButtonUnlocked = computed(() => true)
const multiplePlayButtons = computed(() => fastButtonUnlocked.value || ultraFastButtonUnlocked.value)

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

const birdStyle = (bird: Bird) => {
  return {
    'grid-column': bird.x,
    'grid-row': bird.y,
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
  userPlacedTiles.value.push({
    x,
    y,
    userPlaced: true,
    ...store.instructions[instructionCode],
    state: null,
  })
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
    return dieBird('You are out of the board', bird)
  } else {
    for (const tile of allTiles.value) {
      if (
        tile.name === 'BLCK' &&
        tile.x === bird.x + xDiff &&
        tile.y === bird.y + yDiff
      ) {
        return dieBird('You hit the wall', bird)
      }
    }
    bird.x += xDiff
    bird.y += yDiff
    for (const creep of loadedCreeps.value) {
      if (creep.x === bird.x && creep.y === bird.y) {
        return dieBird('You hit the ghost', bird)
      }
    }
  }
}

const dieBird = async (message: string, bird: Bird) => {
  shouldStopPlaying.value = true
  await sleep(0.5 * speed.value)
  bird.birdClasses.push('dead')
  await sleep(500)
  // @ts-ignore - $tr is added by mixin
  const $tr = instance?.proxy?.$tr as ((key: string, replacements?: Record<string, any>) => string) | undefined
  const translatedMessage = $tr ? $tr(message) : message
  toast.warning(translatedMessage)
  reset()
}

const finish = () => {
  reset()
  let allLevelsFinished = true
  let nextTestCase: TestCase | false = false

  if (props.validation) {
    for (const testCaseIndex in props.validation) {
      if (props.validation[parseInt(testCaseIndex)] === selectedTestCase.value) {
        completedTestCases.value[parseInt(testCaseIndex)] = true
        // @ts-ignore - $tr is added by mixin
        const $tr = instance?.proxy?.$tr as ((key: string, replacements?: Record<string, any>) => string) | undefined
        const translatedMessage = $tr
          ? $tr(`Test case {testCaseIndex} done!`, { testCaseIndex: parseInt(testCaseIndex) + 1 })
          : `Test case ${parseInt(testCaseIndex) + 1} done!`
        toast.info(translatedMessage)
      }
    }
    for (const testCaseIndex in props.validation) {
      if (!(parseInt(testCaseIndex) in completedTestCases.value)) {
        allLevelsFinished = false
        nextTestCase = props.validation[parseInt(testCaseIndex)]
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
    selectedTestCase.value = nextTestCase || null
  }
}
const playButton = () => {
  speed.value = 200
  if (playing.value) {
    return
  }
  shouldStopPlaying.value = false
  play()
}

const ultraFastButton = () => {
  speed.value = 5
  if (playing.value) {
    return
  }
  shouldStopPlaying.value = false
  play()
}

const fastButton = () => {
  speed.value = 40
  if (playing.value) {
    return
  }
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
      shouldMove = await instruction.execute(bird, { input: input.value, speed: speed.value, finish, dieBird, spawnBird, allTiles: allTiles.value }, instruction)
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
        await dieBird('A ghost caught a bird', bird)
        stepFunctionMutex.value = false
        return
      }
    }
  }

  stepFunctionMutex.value = false
}

const resetButton = async () => {
  shouldStopPlaying.value = true
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
  // @ts-ignore - $tr is added by mixin
  const $tr = instance?.proxy?.$tr as ((key: string, replacements?: Record<string, any>) => string) | undefined
  const message = $tr ? $tr('This will reset your level, are you sure?') : 'This will reset your level, are you sure?'
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
  if (props.validation) {
    selectedTestCase.value = props.validation[0]
  }
  const userPlacedTilesData = JSON.parse(localStorage.getItem(props.name) || '[]') as Array<{
    x: number
    y: number
    code: string
  }>
  for (const tile of userPlacedTilesData) {
    userPlacedTiles.value.push({
      x: tile.x,
      y: tile.y,
      userPlaced: true,
      ...store.instructions[tile.code],
    })
  }
})

onBeforeUnmount(() => {
  if (flappingInterval.value) {
    clearInterval(flappingInterval.value)
  }
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
  gap: 2px;
}

.control-btn {
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  font-size: 1.2rem;
  color: #555;
  transition: all 0.2s;
}

.control-btn:hover:not(:disabled) {
  background: white;
  color: var(--primary-color);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.control-btn.primary {
  color: var(--primary-color);
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
  gap: 10px;
}

.unlocks-instructions .instruction {
  display: inline-block !important;
  transform: scale(0.6);
  transform-origin: top left;
  margin-right: -40px;
  margin-bottom: -40px;
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
</style>
