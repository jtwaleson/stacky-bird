<template>

    <!-- Level Finish Pop-up -->
    <vue-final-modal v-model="showLevelCompletedModal">
        <div class="levelfinishpopup">
            <div>
                <h2><T textKey="You finished the level, great job!"/></h2>
            </div>
            <div v-if="unlocksLevels.length > 0">
                <T textKey="You have unlocked the following levels"/>: <span style="font-weight: bold" v-for="level in unlocksLevels" :key="level">{{ level }} </span>
            </div>
            <div v-if="unlocksInstructions.length > 0">
                <T textKey="You have unlocked the following blocks"/>:
            </div>
            <div class="unlocks-instructions">
                <Instruction v-for="(instructionCode, index) in unlocksInstructions" :key="index" v-bind="$store.state.instructions[instructionCode]" unlocked/>
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
            <h2><T textKey="Available Instruction Blocks"/></h2>
            <p><T textKey="Drag to the board on the right."/></p>
            <div v-if="devMode">
                <button @click="toggleLevelCompleteDevMode">{{ completed ? "Uncomplete" : "Complete" }}</button>
            </div>
        </div>

        <!-- board-menu -->
        <div class="boardd">
            <div class="board-menu">
                <div>
                    <template v-if="name">
                        <h2><T textKey="Level"/> {{ name }} - <T :textKey="displayName"/></h2>
                        <p><T :textKey="description"/></p>
                    </template>
                    <h2 v-else><T textKey="Board"/></h2>
                </div>
                <div class="control-container">
                    <button :disabled="birdIsLoaded || playing" class="delete" @click="clearWithWarning"><i class="bi-trash"/></button>
                    <button @click="resetButton" :disabled="!birdIsLoaded"><i class="bi-stop-fill"/></button>
                    <button @click="stepButton"><i class="bi-skip-end-fill"/></button>
                    <button @click="playButton" :disabled="playing && !multiplePlayButtons"><i class="bi-play-fill"/></button>
                    <button v-if="fastButtonUnlocked" @click="fastButton" :disabled="playing && !multiplePlayButtons"><i class="bi-skip-forward-fill"/></button>
                    <button v-if="ultraFastButtonUnlocked" @click="ultraFastButton" :disabled="playing && !multiplePlayButtons"><i class="bi-lightning-fill"/></button>
                </div>
            </div>
            <div v-if="validation">
                <T textKey="Test cases"/>
                <ul class="test-case-selector">
                    <li @click="selectedTestCase = testCase" v-for="(testCase, idx) in validation" :key="idx" :class="{ selected: testCase === selectedTestCase, completed: idx in completedTestCases }">
                        {{ idx + 1 }}
                    </li>
                </ul>
                <hr/>
                <T textKey="Input"/>
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
                <hr/>
                <T textKey="Expected output"/>
                <ul class="test-case-selector" v-if="selectedTestCase">
                    <li v-for="(output, idx) in selectedTestCase.finalStack" :key="idx">
                        {{ output }}
                    </li>
                </ul>
            </div>
        </div>

        <!-- available instructions -->
        <div class="instructions2">
            <InstructionList :draggable="!birdIsLoaded && !playing" unlockedOnly :cols="3" :locked="birdIsLoaded || playing"/>
        </div>

        <!-- the actual board -->
        <div class="boarddd">
            <div class="board" :style="boardStyle">
                <template v-for="col in cols" :key="col">
                    <div v-for="row in rows" :key="row" class="field" :style="{'grid-column': col, 'grid-row': row}" @drop="drop(col, row, $event)" @dragover="allowDrop" @dragleave="removeDrop"></div>
                </template>
                <template v-if="birdIsLoaded">
                    <div v-for="(bird, index) in birds" :key="index" class="field thebird" :class="bird.birdClasses" :style="birdStyle(bird)">
                        <transition-group name="stackies" class="stack" tag="ul">
                            <li v-for="(item, index) in bird.stack.slice().reverse()" :key="bird.stack.length - index" class="field-style-F">
                                {{ item }}
                            </li>
                        </transition-group>
                        <img :src="getBirdImageSource(bird)"/>
                    </div>
                </template>
                <div v-for="(creep, index) in loadedCreeps" :key="index" class="field creep" :class="creep.direction" :style="birdStyle(creep)">
                    <img src="@/assets/flappy1.png"/>
                </div>
                <Instruction v-for="(levelTile, index) in allTiles" :key="index" v-bind="levelTile" unlocked :userPlaced="!birdIsLoaded && levelTile.userPlaced" :draggable="!birdIsLoaded && levelTile.userPlaced" :deleteMethod="() => deletePlacedInstruction(levelTile)"/>
            </div>
        </div>
    </div>
</template>

<script>
import { sleep, oppositeDirection } from '../util.js';
import { mapState } from 'vuex';
import { toRaw } from 'vue';
import Instruction from "./Instruction.vue";
import InstructionList from "./InstructionList.vue";
import { useToast } from "vue-toastification";
import flappy1 from "@/assets/flappy1.png";
import flappy2 from "@/assets/flappy2.png";

const toast = useToast();


function getXYDiff(direction) {
    let xDiff = 0;
    let yDiff = 0;
    if (direction === "up") {
        yDiff = -1;
    } else if (direction === "down") {
        yDiff = 1;
    } else if (direction === "left") {
        xDiff = -1;
    } else if (direction === "right") {
        xDiff = 1;
    } else {
        throw new Error(`invalid direction ${direction}`);
    }
    return [xDiff, yDiff];
}

export default {
    name: 'Board',
    props: {
        cols: {
            type: Number,
            default: 7,
        },
        rows: {
            type: Number,
            default: 7,
        },
        levelTiles: Array,
        finishLevel: Function,
        unlocksLevels: Array,
        unlocksInstructions: Array,
        description: String,
        displayName: String,
        name: String,
        unlocked: Boolean,
        completed: Boolean,
        validation: Array,
        creeps: {
            type: Array,
            default: () => [],
        },
    },
    components: {
        Instruction,
        InstructionList,
    },
    data() {
        return {
            selectedTestCase: null,
            speed: 100,
            stepFunctionMutex: false,
            showLevelCompletedModal: false,
            playing: false,
            shouldStopPlaying: false,
            birds: [],
            input: [],
            flappingInterval: null,
            userPlacedTiles: [],
            completedTestCases: {},
            loadedCreeps: JSON.parse(JSON.stringify(this.creeps)),
        }
    },
    computed: {
        ...mapState(['instructions']),
        boardStyle() {
            return {
                "grid-template-columns": `repeat(${this.cols}, 107px)`,
                "grid-template-rows": `repeat(${this.rows}, 107px)`,
            }
        },
        ultraFastButtonUnlocked() {
            return true;
        },
        fastButtonUnlocked() {
            return true;
        },
        multiplePlayButtons() {
            return this.fastButtonUnlocked || this.ultraFastButtonUnlocked;
        },
        birdIsLoaded() {
            for (const bird of this.birds) {
                if (bird.x !== null && bird.y !== null) {
                    return true;
                }
            }
            return false;
        },
        allTiles() {
            return this.levelTiles.concat(this.userPlacedTiles);
        },
        devMode() {
            return process.env.NODE_ENV !== "production";
        },
    },
    methods: {
        spawnBird() {
            let found = false;
            const newBird = {
                x: null,
                y: null,
                flappingImage: true,
                direction: "right",
                stack: [],
                birdClasses: [],
            };
            for (let tile of this.allTiles) {
                if (tile.name === "STRT") {
                    newBird.x = tile.x;
                    newBird.y = tile.y;
                    found = true;
                }
            }
            if (!found) {
                throw new Error("no STRT block found!");
            }

            if (this.flappingInterval) {
                clearInterval(this.flappingInterval);
            }
            this.flappingInterval = setInterval(() => {
                for (const bird of this.birds) {
                    bird.flappingImage = !bird.flappingImage;
                }
            }, this.speed);
            this.birds.push(newBird);
        },
        toggleLevelCompleteDevMode() {
            this.$store.commit("completeLevel", {
                levelName: this.name,
                isCompleted: !this.completed,
            });
        },
        birdStyle(bird) {
            return {
                "grid-column": bird.x,
                "grid-row": bird.y,
                "display": "grid",
            }
        },
        drop(x, y, event) {
            event.preventDefault();
            if (this.birdIsLoaded) {
                return;
            }
            event.target.classList.remove("droppable");
            // TODO this needs guarding
            let deleteX = parseInt(event.dataTransfer.getData("deleteX"));
            let deleteY = parseInt(event.dataTransfer.getData("deleteY"));
            if (deleteX && deleteY) {
                this.userPlacedTiles = this.userPlacedTiles.filter(item => !(item.x === deleteX && item.y === deleteY));
            }
            this.userPlacedTiles.push({
                x,
                y,
                userPlaced: true,
                ...this.$store.state.instructions[event.dataTransfer.getData("text")],
                state: null,
            });
            this.completedTestCases = {};
            this.saveBoardToLocalStorage();
        },
        getBirdImageSource(bird) {
            if (bird.flappingImage || this.shouldStopPlaying) {
                return flappy1;
            }
            return flappy2;

        },
        allowDrop(event) {
            if (this.birdIsLoaded) {
                return;
            }
            event.target.classList.add("droppable");
            event.preventDefault();
        },
        removeDrop(event) {
            event.target.classList.remove("droppable");
        },
        deletePlacedInstruction(placedInstruction) {
            if (this.birdIsLoaded) {
                return;
            }
            this.userPlacedTiles = this.userPlacedTiles.filter(item => item !== placedInstruction);
            this.completedTestCases = {};
            this.saveBoardToLocalStorage();
        },
        moveBird(bird) {
            // can return a promise or undefined
            const [xDiff, yDiff] = getXYDiff(bird.direction);
            let newX = bird.x + xDiff;
            let newY = bird.y + yDiff;

            bird.birdClasses.length = 0;
            bird.birdClasses.push(toRaw(bird.direction));
            // this.birdClasses.push("moving");
            if (newX <= 0 || newY <= 0 || newX > this.cols || newY > this.rows) {
                return this.dieBird("You are out of the board", bird);
            } else {
                // this.birdClasses.pop();
                for (let tile of this.allTiles) {
                    if (tile.name === "BLCK" && tile.x === bird.x + xDiff && tile.y === bird.y + yDiff) {
                        return this.dieBird("You hit the wall", bird);
                    }
                }
                bird.x += xDiff;
                bird.y += yDiff;
                for (let creep of this.loadedCreeps) {
                    if (creep.x === bird.x && creep.y === bird.y) {
                        return this.dieBird("You hit the ghost", bird);
                    }
                }
            }
        },
        async dieBird(message, bird) {
            this.shouldStopPlaying = true;
            await sleep(0.5 * this.speed);
            bird.birdClasses.push("dead");
            await sleep(500);
            toast.warning(this.$tr(message));
            this.reset();
        },
        finish() {
            this.reset();
            let allLevelsFinished = true;
            let nextTestCase = false

            if (this.validation) {
                for (let testCaseIndex in this.validation) {
                    if (this.validation[testCaseIndex] === this.selectedTestCase) {
                        this.completedTestCases[testCaseIndex] = true;
                        toast.info(this.$tr(`Test case {testCaseIndex} done!`, {testCaseIndex: parseInt(testCaseIndex) + 1}));
                    }
                }
                for (let testCaseIndex in this.validation) {
                    if (!(testCaseIndex in this.completedTestCases)) {
                        allLevelsFinished = false;
                        nextTestCase = this.validation[testCaseIndex];
                        break
                    }
                }
            }
            if (allLevelsFinished) {
                this.shouldStopPlaying = true;
                this.$store.commit("completeLevel", {
                    levelName: this.name,
                    isCompleted: true,
                });
                this.showLevelCompletedModal = true;
            } else {
                this.selectedTestCase = nextTestCase;
            }
        },
        playButton() {
            this.speed = 200;
            if (this.playing) {
                return;
            }
            this.shouldStopPlaying = false;
            this.play();
        },
        ultraFastButton() {
            this.speed = 5;
            if (this.playing) {
                return;
            }
            this.shouldStopPlaying = false;
            this.play();
        },
        fastButton() {
            this.speed = 40;
            if (this.playing) {
                return;
            }
            this.shouldStopPlaying = false;
            this.play();
        },
        async stepButton() {
            this.speed = 200;
            this.shouldStopPlaying = true;
            if (this.playing) {
                return;
            }
            await this.play();
        },
        async play() {
            if (this.playing) {
                return;
            }
            this.playing = true;
            while (this.playing) {
                await this.step();
                if (this.shouldStopPlaying) {
                    break;
                }
                await sleep(this.speed);
            }
            this.playing = false;
            this.shouldStopPlaying = false;
        },
        async step() {
            if (this.stepFunctionMutex) {
                console.error("can not step while still stepping");
                return;
            }
            this.stepFunctionMutex = true;
            if (this.birds.length === 0) {
                this.input = [];
                if (this.selectedTestCase) {
                    this.input = [...toRaw(this.selectedTestCase.input)];
                }
                this.spawnBird();
            }
            for (const bird of this.birds) {
                let instruction = null;
                for (let tile of this.allTiles) {
                    if (tile.x === bird.x && tile.y === bird.y) {
                        instruction = tile;
                        break
                    }
                }
                let shouldMove = null;
                if (instruction) {
                    shouldMove = await instruction.execute(bird, this, instruction);
                }
                if (shouldMove === "SKIP") {
                    await sleep(2 * this.speed);
                }
                if (!this.birdIsLoaded) {
                    break;
                }
                if (this.birdIsLoaded && shouldMove !== "NOMOVE") {
                    await this.moveBird(bird);
                }
            }
            for (const creep of this.loadedCreeps) {
                if (!this.birdIsLoaded) {
                    break;
                }
                const [xDiff, yDiff] = getXYDiff(creep.direction);
                let newX = creep.x + xDiff;
                let newY = creep.y + yDiff;
                if (newY <= 0 || newY > this.rows || newX <= 0 || newX > this.cols) {
                    creep.direction = oppositeDirection[creep.direction];
                } else {
                    let hitBlock = false;
                    for (const tile of this.allTiles) {
                        if (newX === tile.x && newY === tile.y && tile.name === "BLCK") {
                            hitBlock = true;
                        }
                    }
                    if (hitBlock) {
                        creep.direction = oppositeDirection[creep.direction];
                    } else {
                        creep.x = newX;
                        creep.y = newY;
                    }
                }
                for (const bird of this.birds) {
                    if (bird.x === creep.x && bird.y === creep.y) {
                        return await this.dieBird("A ghost caught a bird", bird);
                    }
                }
            }

            this.stepFunctionMutex = false;
        },
        async resetButton() {
            this.shouldStopPlaying = true;
            while (this.playing) {
                await sleep(100);
            }
            this.reset();
        },
        reset() {
            this.stepFunctionMutex = false;
            this.loadedCreeps = JSON.parse(JSON.stringify(this.creeps));
            this.birds = [];
            for (const tile of this.allTiles) {
                tile.state = null;
            }
            clearInterval(this.flappingInterval);
        },
        clearWithWarning() {
            if (confirm(this.$tr("This will reset your level, are you sure?"))) {
                this.clear();
            }
        },
        clear() {
            this.userPlacedTiles = [];
            this.reset();
            this.saveBoardToLocalStorage();
        },
        saveBoardToLocalStorage() {
            if (!this.name) {
                return;
            }
            let userPlacedTiles = [];
            for (const tile of this.userPlacedTiles) {
                userPlacedTiles.push({
                    x: tile.x,
                    y: tile.y,
                    code: tile.name,
                });
            }
            localStorage.setItem(this.name, JSON.stringify(userPlacedTiles));
        },
    },
    mounted() {
        if (!this.name) {
            return;
        }
        if (this.validation) {
            this.selectedTestCase = this.validation[0];
        }
        let userPlacedTiles = JSON.parse(localStorage.getItem(this.name) || "[]");
        // TODO this needs guarding
        for (let tile of userPlacedTiles) {
            this.userPlacedTiles.push({
                x: tile.x,
                y: tile.y,
                userPlaced: true,
                ...this.$store.state.instructions[tile.code],
            });
        }
    },
    beforeUnmount() {
        clearInterval(this.flappingInterval);
    },
}
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
    opacity: 1.0;
    background: none;
    z-index: 100;
    width: 107px;
    height: 107px;
    user-select: none;
}
.creep {
    position: relative;
    pointer-events: none;
    opacity: 1.0;
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
    transition:
        margin ease-in-out 100ms; /* 2X SPEED */
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
    margin-left:-122px;
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
    transition:
        height ease-in-out 0.5s;
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
.unlocks-instructions > .instruction {
    display: inline-block !important;
    margin: 5px;
    opacity: 1.0 !important;
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
