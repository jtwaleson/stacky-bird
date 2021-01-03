<template>
    <div class="instruction-grid-container">
        <div class="menu-container">
            <div @click="$store.commit('openMenu')">BACK</div>
            <div @click="clear">CLER</div>
            <div @click="reset">RSET</div>
            <div @click="!birdIsMoving && step()" :class="{disabled: birdIsMoving}">STEP</div>
            <div @click="play" :class="{disabled: playing}">PLAY</div>
            <div @click="playing = false" :class="{disabled: !playing}">STOP</div>
        </div>
        <InstructionList draggable unlockedOnly/>
        <div class="board" :style="boardStyle">
            <template v-for="col in cols" :key="col">
                <div v-for="row in rows" :key="row" class="field" :style="{'grid-column': col, 'grid-row': row}" @drop="drop(col, row, $event)" @dragover="allowDrop"></div>
            </template>
            <div v-if="bird.x !== null && bird.y !== null" class="field thebird" :class="birdClasses" :style="birdStyle">
                <img v-if="bird.flappingImage" src="@/assets/flappy1.png"/>
                <img v-else src="@/assets/flappy2.png"/>
            </div>
            <Instruction v-for="(gridObject, index) in boardObjects" :key="index" v-bind="gridObject"/>
        </div>
        <ul class="stack">
            <li v-for="(item, index) in stack" :key="index">
                {{ item }}
            </li>
        </ul>
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
        cols: Number,
        rows: Number,
        gridObjects: Array,
        finishLevel: Function,
    },
    components: {
        Instruction,
        InstructionList,
    },
    data() {
        return {
            birdIsMoving: false,
            playing: false,
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
        boardObjects() {
            return this.gridObjects.concat(this.placedObjects);
        }
    },
    methods: {
        drop(x, y, event) {
            event.preventDefault();
            this.placedObjects.push({
                x,
                y,
                userPlaced: true,
                ...this.$store.state.instructions[event.dataTransfer.getData("text")],
            });
        },
        allowDrop(event) {
            event.preventDefault();
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
                await sleep(2 * SPEED);
                // this.birdClasses.pop();
                this.bird.x += xDiff;
                this.bird.y += yDiff;
            }
        },
        async dieBird() {
            clearInterval(this.flappingInterval);
            await sleep(0.5 * SPEED);
            this.birdClasses.push("dead");
            await sleep(4 * SPEED);
            this.reset();
        },
        finish() {
            this.finishLevel();
        },
        async play() {
            this.playing = true;
            while (this.playing) {
                await this.step();
            }
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
                await this.moveBird();
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
            }
            this.birdIsMoving = false;
        },
        reset() {
            this.birdIsMoving = false;
            this.playing = false;
            this.bird.x = null;
            this.bird.y = null;
            this.bird.flappingImage = true;
            this.bird.direction = "right";
            this.birdClasses = [];
            this.flappingInterval = null;
            this.stack = [];
            clearInterval(this.flappingInterval);
        },
        clear() {
            this.placedObjects = [];
            this.reset();
        }
    },
    mounted() {
    },
    beforeUnmount() {
        clearInterval(this.flappingInterval);
    },
}
</script>

<style scoped>
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
    opacity: 20%;
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
    opacity: 40%;
}
.thebird {
    display: none;
    opacity: 100%;
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
.left {
    transform: rotate(180deg);
}
.right {
    transform: rotate(0deg);
}
.up {
    transform: rotate(270deg);
}
.down {
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
    list-style: none;
    padding: 0;
    margin: 0;
    display: block;
    position: absolute;
    right: 10px;
    width: 100px;
    top: 10px;
    min-height: 100px;
    border-radius: 6px;
    background-color: #bbb;
}
.stack li {
    background-color: #999;
    display: block;
    border-radius: 3px;
}
</style>
