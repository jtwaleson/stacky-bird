<template>
  <!-- Level Finish Pop-up -->
  <vue-final-modal v-model="showLevelCompletedModal">
    <div class="levelfinishpopup">
      <div>
        <h2>
          <T textKey="You finished the level, great job!" />
        </h2>
      </div>
      <div v-if="unlocksLevels && unlocksLevels.length > 0">
        <T textKey="You have unlocked the following levels" />:
        <span style="font-weight: bold" v-for="level in unlocksLevels" :key="level">{{ level }}
        </span>
      </div>
      <div v-if="unlocksInstructions && unlocksInstructions.length > 0">
        <T textKey="You have unlocked the following blocks" />:
      </div>
      <div class="unlocks-instructions">
        <Instruction v-for="(instructionCode, index) in unlocksInstructions" :key="index"
          v-bind="store.instructions[instructionCode]" unlocked />
      </div>
      <div>
        <button @click="$router.push({ path: '/' })">OK</button>
      </div>
    </div>
  </vue-final-modal>

  <div class="main">
    <!-- instructions -->
    <div class="instructions1">
      <div>
        <button class="back bi-arrow-left" @click="$router.push({ path: '/' })"></button>
      </div>
      <h2>
        <T textKey="Available Instruction Blocks" />
      </h2>
      <p>
        <T textKey="Drag to the board on the right." />
      </p>
      <div v-if="devMode">
        <button @click="toggleLevelCompleteDevMode">
          {{ completed ? 'Uncomplete' : 'Complete' }}
        </button>
      </div>
    </div>

    <!-- board-menu -->
    <div class="boardd">
      <div class="board-menu">
        <div>
          <template v-if="name">
            <h2>
              <T textKey="Level" /> {{ name }} -
              <T :textKey="displayName" />
            </h2>
            <p>
              <T :textKey="description" />
            </p>
          </template>
          <h2 v-else>
            <T textKey="Board" />
          </h2>
        </div>
        <div class="control-container">
          <button :disabled="birdIsLoaded || playing" class="delete" @click="clearWithWarning">
            <i class="bi-trash" />
          </button>
          <button @click="resetButton" :disabled="!birdIsLoaded">
            <i class="bi-stop-fill" />
          </button>
          <button @click="stepButton"><i class="bi-skip-end-fill" /></button>
          <button @click="playButton" :disabled="playing && !multiplePlayButtons">
            <i class="bi-play-fill" />
          </button>
          <button v-if="fastButtonUnlocked" @click="fastButton" :disabled="playing && !multiplePlayButtons">
            <i class="bi-skip-forward-fill" />
          </button>
          <button v-if="ultraFastButtonUnlocked" @click="ultraFastButton" :disabled="playing && !multiplePlayButtons">
            <i class="bi-lightning-fill" />
          </button>
        </div>
      </div>
      <div v-if="validation">
        <T textKey="Test cases" />
        <ul class="test-case-selector">
          <li @click="selectedTestCase = testCase" v-for="(testCase, idx) in validation" :key="idx" :class="{
            selected: testCase === selectedTestCase,
            completed: idx in completedTestCases,
          }">
            {{ idx + 1 }}
          </li>
        </ul>
        <hr />
        <T textKey="Input" />
        <ul class="test-case-selector" v-if="selectedTestCase && birdIsLoaded">
          <li v-for="(input, idx) in input" :key="idx">
            {{ input }}
          </li>
        </ul>
        <ul class="test-case-selector" v-else-if="selectedTestCase">
          <li v-for="(input, idx) in selectedTestCase.input" :key="idx">
            {{ input }}
          </li>
        </ul>
        <hr />
        <T textKey="Expected output" />
        <ul class="test-case-selector" v-if="selectedTestCase">
          <li v-for="(output, idx) in selectedTestCase.finalStack" :key="idx">
            {{ output }}
          </li>
        </ul>
      </div>
    </div>

    <!-- available instructions -->
    <div class="instructions2">
      <InstructionList :draggable="!birdIsLoaded && !playing" unlockedOnly :cols="3"
        :locked="birdIsLoaded || playing" />
    </div>

    <!-- the actual board -->
    <div class="boarddd">
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
  return {
    'grid-template-columns': `repeat(${props.cols}, 107px)`,
    'grid-template-rows': `repeat(${props.rows}, 107px)`,
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
.main {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 15px;
  width: fit-content;
}

.instructions1 {
  justify-self: end;
}

.main>div {
  justify-self: stretch;
}

.main .boardd {
  align-self: end;
}

.main .boarddd {
  width: fit-content;
}

.board-menu>div {
  display: inline-block;
  padding: 8px 4px;
  border-radius: 7px;
  height: fit-content;
  width: fit-content;
}

.control-container {
  background-color: #bbb;
}

.board-menu {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

button:hover {
  cursor: pointer;
  background-color: rgb(249, 249, 249);
}

button {
  margin: 0 5px;
  font-size: 20px;
  padding: 7px 7px;
  border: 1px solid gray;
  background-color: rgb(239, 239, 239);
}

.board-menu button.delete {
  margin-right: 55px;
}

.levelfinishpopup {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background: #fff;
  width: 350px;
  min-height: 450px;
  margin: 100px auto;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
}

.field {
  display: grid;
  border-radius: 3px;
  justify-content: center;
  align-items: center;
  background-color: #eee4da;
  z-index: 4;
  opacity: 0.4;
}

.thebird {
  display: none;
  pointer-events: none;
  position: relative;
  opacity: 1;
  background: none;
  z-index: 100;
  width: 107px;
  height: 107px;
  user-select: none;
}

.creep {
  position: relative;
  pointer-events: none;
  opacity: 1;
  background: none;
  z-index: 20;
  width: 107px;
  height: 107px;
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
  /* 2X SPEED */
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
  margin-left: -122px;
}

.moving.right {
  margin-left: 122px;
}

.moving.up {
  margin-top: -122px;
}

.moving.down {
  margin-top: 122px;
}

.thebird.dead img {
  filter: invert(1);
  height: 0;
  transition: height ease-in-out 0.5s;
}

.stack {
  position: absolute;
  left: -100px;
  top: 80px;
  list-style: none;
  padding: 0;
  margin: 0;
  display: block;
  position: absolute;
  right: 10px;
  width: 100px;
  border-radius: 6px;
  background-color: #bbb;
}

.stack li {
  display: block;
  border-radius: 3px;
  text-align: center;
  margin: 4px;
  font-size: 20px;
  font-weight: bold;
  padding: 4px;
}

.field.droppable {
  border: 3px solid blue;
}

.unlocks-instructions>.instruction {
  display: inline-block !important;
  margin: 5px;
  opacity: 1 !important;
}

.test-case-selector {
  margin: 0;
  padding: 0;
  min-height: 40px;
}

.test-case-selector li {
  display: inline-block;
  border-radius: 3px;
  text-align: center;
  margin: 4px;
  font-size: 20px;
  font-weight: bold;
  padding: 4px 20px;
  background: #bbb;
}

.test-case-selector li.selected {
  background: #ddd;
}

.test-case-selector li.completed {
  border: 3px solid green;
}

.stack .stackies-enter-active,
.stack .stackies-leave-active {
  transition: opacity 0.15s;
}

.stack .stackies-enter-from,
.stack .stackies-leave-to {
  opacity: 0;
}
</style>
