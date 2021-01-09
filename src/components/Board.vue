<template>
    <div class="instruction-grid-container">
        <h2><T textKey="Available Instruction Blocks"/></h2>
        <p><T textKey="Drag to the board below."/></p>
        <InstructionList :draggable="!birdIsLoaded" unlockedOnly :cols="cols" :locked="birdIsLoaded"/>
        <template v-if="name">
            <h2><T textKey="Level"/> {{ name }} - <T :textKey="displayName"/></h2>
            <p><T :textKey="description"/></p>
        </template>
        <h2 v-else><T textKey="Board"/></h2>
        <p><T textKey="To get started, hit STEP or PLAY in the menu."/></p>
        <button class="back" @click="$router.push({ path: '/' })"><i class="bi-arrow-left"/></button>
        <div class="control-container">
            <button class="delete" @click="clearWithWarning"><i class="bi-trash"/></button>
            <button @click="reset" :disabled="!birdIsLoaded"><i class="bi-stop-circle"/></button>
            <button @click="step" :disabled="birdIsMoving"><i class="bi-skip-end-circle"/></button>
            <button @click="play" :disabled="playing"><i class="bi-play-circle"/></button>
            <button @click="shouldStopPlaying = true" :disabled="!playing"><i class="bi-pause-circle"/></button>
        </div>
        <div class="board" :style="boardStyle">
            <template v-for="col in cols" :key="col">
                <div v-for="row in rows" :key="row" class="field" :style="{'grid-column': col, 'grid-row': row}" @drop="drop(col, row, $event)" @dragover="allowDrop" @dragleave="removeDrop"></div>
            </template>
            <div v-if="birdIsLoaded" class="field thebird" :class="birdClasses" :style="birdStyle">
                <ul class="stack">
                    <li v-for="(item, index) in stack" :key="index" class="field-style-F">
                        {{ item }}
                    </li>
                </ul>
                <img v-if="bird.flappingImage" src="@/assets/flappy1.png"/>
                <img v-else src="@/assets/flappy2.png"/>
            </div>
            <Instruction v-for="(gridObject, index) in boardObjects" :key="index" v-bind="gridObject" :userPlaced="!birdIsLoaded && gridObject.userPlaced" :draggable="!birdIsLoaded && gridObject.userPlaced" :deleteMethod="() => deletePlacedInstruction(gridObject)"/>
        </div>
    </div>
</template>

<script>
const SPEED = 100;
import { mapState } from 'vuex'
import { toRaw } from 'vue'
import Instruction from "./Instruction.vue"
import InstructionList from "./InstructionList.vue"

const sleep = m => new Promise(r => setTimeout(r, m))

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
        gridObjects: Array,
        finishLevel: Function,
        unlocksLevels: Array,
        unlocksInstructions: Array,
        description: String,
        displayName: String,
        name: String,
        unlocked: Boolean,
        completed: Boolean,
    },
    components: {
        Instruction,
        InstructionList,
    },
    data() {
        return {
            birdIsMoving: false,
            playing: false,
            shouldStopPlaying: false,
            bird: {
                x: null,
                y: null,
                flappingImage: true,
                direction: "right",
            },
            birdClasses: [],
            flappingInterval: null,
            placedObjects: [],
            stack: [],
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
        birdStyle() {
            return {
                "grid-column": this.bird.x,
                "grid-row": this.bird.y,
                "display": "grid",
            }
        },
        birdIsLoaded() {
            return this.bird.x !== null && this.bird.y !== null;
        },
        boardObjects() {
            return this.gridObjects.concat(this.placedObjects);
        },
    },
    methods: {
        drop(x, y, event) {
            event.preventDefault();
            if (this.birdIsLoaded) {
                return;
            }
            event.toElement.classList.remove("droppable");
            // TODO this needs guarding
            let deleteX = parseInt(event.dataTransfer.getData("deleteX"));
            let deleteY = parseInt(event.dataTransfer.getData("deleteY"));
            if (deleteX && deleteY) {
                this.placedObjects = this.placedObjects.filter(item => !(item.x === deleteX && item.y === deleteY));
            }
            this.placedObjects.push({
                x,
                y,
                userPlaced: true,
                ...this.$store.state.instructions[event.dataTransfer.getData("text")],
            });
            this.saveBoardToLocalStorage();
        },
        allowDrop(event) {
            if (this.birdIsLoaded) {
                return;
            }
            event.toElement.classList.add("droppable");
            event.preventDefault();
        },
        removeDrop(event) {
            event.toElement.classList.remove("droppable");
        },
        deletePlacedInstruction(placedInstruction) {
            if (this.birdIsLoaded) {
                return;
            }
            this.placedObjects = this.placedObjects.filter(item => item !== placedInstruction);
            this.saveBoardToLocalStorage();
        },
        async moveBird() {
            this.birdIsMoving = true;
            let xDiff = 0;
            let yDiff = 0;
            if (this.bird.direction === "up") {
                yDiff = -1;
            } else if (this.bird.direction === "down") {
                yDiff = 1;
            } else if (this.bird.direction === "left") {
                xDiff = -1;
            } else if (this.bird.direction === "right") {
                xDiff = 1;
            } else {
                throw new Error(`invalid direction of bird ${this.bird.direction}`);
            }
            let newX = this.bird.x + xDiff;
            let newY = this.bird.y + yDiff;


            this.birdClasses.length = 0;
            this.birdClasses.push(toRaw(this.bird.direction));
            // this.birdClasses.push("moving");
            if (newX <= 0 || newY <= 0 || newX > this.cols || newY > this.rows) {
                await this.dieBird();
            } else {
                // this.birdClasses.pop();
                for (let boardObject of this.boardObjects) {
                    if (boardObject.name === "BLCK" && boardObject.x === this.bird.x + xDiff && boardObject.y === this.bird.y + yDiff) {
                        return await this.dieBird();
                    }
                }
                this.bird.x += xDiff;
                this.bird.y += yDiff;
            }
        },
        async dieBird() {
            clearInterval(this.flappingInterval);
            this.shouldStopPlaying = true;
            await sleep(0.5 * SPEED);
            this.birdClasses.push("dead");
            await sleep(4 * SPEED);
            this.reset();
        },
        finish() {
            this.$router.push({ path: "/" });
            this.$store.commit("completeLevel", this.name);
            for (const instructionName of this.unlocksInstructions) {
                this.$store.commit("unlockInstruction", instructionName);
            }
            for (const levelName of this.unlocksLevels) {
                this.$store.commit("unlockLevel", levelName);
            }
            alert(this.$tr("Level completed"));
        },
        async play() {
            if (this.playing) {
                return;
            }
            this.playing = true;
            while (this.playing && !this.shouldStopPlaying) {
                await this.step();
            }
            this.playing = false;
            this.shouldStopPlaying = false;
        },
        async step() {
            if (this.birdIsMoving) {
                console.error("can not step while still stepping");
                return;
            }
            this.birdIsMoving = true;

            if (this.bird.x === null || this.bird.y === null) {
                for (let boardObject of this.boardObjects) {
                    if (boardObject.name === "STRT") {
                        this.bird.x = boardObject.x;
                        this.bird.y = boardObject.y;
                    }
                }
                this.flappingInterval = setInterval(() => {
                    this.bird.flappingImage = !this.bird.flappingImage;
                }, SPEED);
            } else {
                let instruction = null;
                for (let boardObject of this.boardObjects) {
                    if (boardObject.x === this.bird.x && boardObject.y === this.bird.y) {
                        instruction = boardObject;
                        break
                    }
                }
                if (instruction) {
                    await instruction.execute(this);
                }
                await this.moveBird();
            }
            await sleep(2 * SPEED);
            this.birdIsMoving = false;
        },
        reset() {
            this.birdIsMoving = false;
            this.bird.x = null;
            this.bird.y = null;
            this.bird.flappingImage = true;
            this.bird.direction = "right";
            this.birdClasses = [];
            this.stack = [];
            clearInterval(this.flappingInterval);
            this.flappingInterval = null;
        },
        clearWithWarning() {
            if (confirm(this.$tr("This will reset your level, are you sure?"))) {
                this.clear();
            }
        },
        clear() {
            this.placedObjects = [];
            this.reset();
            this.saveBoardToLocalStorage();
        },
        saveBoardToLocalStorage() {
            if (!this.name) {
                return;
            }
            let placedObjects = [];
            for (const placedObject of this.placedObjects) {
                placedObjects.push({
                    x: placedObject.x,
                    y: placedObject.y,
                    code: placedObject.name,
                });
            }
            localStorage.setItem(this.name, JSON.stringify(placedObjects));
        },
    },
    mounted() {
        if (!this.name) {
            return;
        }
        let placedObjects = JSON.parse(localStorage.getItem(this.name) || "[]");
        // TODO this needs guarding
        for (let placedObject of placedObjects) {
            this.placedObjects.push({
                x: placedObject.x,
                y: placedObject.y,
                userPlaced: true,
                ...this.$store.state.instructions[placedObject.code],
            });
        }
    },
    beforeUnmount() {
        clearInterval(this.flappingInterval);
    },
}
</script>

<style scoped>
.control-container {
    display: inline-block;
    background-color: #bbb;
    padding: 5px;
    border-radius: 7px;
    margin-bottom: 3px;
}
.control-container button:hover {
    cursor: pointer;
}
.control-container button {
    margin: 0 5px;
    font-size: 20px;
    width: 35px;
    height: 35px;
}
.control-container button.delete {
    margin-right: 35px;
    background-color: #f3b27a;
}
button.back {
    margin: 0 5px;
    margin-right: 35px;
    font-size: 20px;
    width: 35px;
    height: 35px;
}
.menu-container {
    display:  grid;
    border-radius: 6px;
    grid-gap: 15px;
    background-color: #bbb;
    padding: 15px;
    grid-template-columns: repeat(7, 107px);
    margin-top: 20px;
    margin-bottom: 20px;
}
.menu-container div {
    display: grid;
    border-radius: 3px;
    justify-content: center;
    align-items: center;
    background-color: #999;
    padding: 30px 0;
    user-select: none;
}
.menu-container div:hover {
    cursor: pointer;
    background-color: #aaa;
}
.menu-container div.disabled {
    opacity: 0.2;
}
.menu-container div.disabled:hover {
    cursor: not-allowed;
    background-color: #999;
}
.field {
    display: grid;
    border-radius: 3px;
    justify-content: center;
    align-items: center;
    background-color: #eee4da;
    opacity: 0.4;
}
.thebird {
    display: none;
    position: relative;
    opacity: 1.0;
    background: none;
    z-index: 100;
    width: 107px;
    height: 107px;
    user-select: none;
}
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
.dead {
    filter: invert(1);
    height: 0px;
    transition:
        height ease-in-out 500ms;
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
</style>
