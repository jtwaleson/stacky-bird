<template>
    <div class="instruction-grid-container">
        <div class="menu-container">
            <div @click="$store.commit('openMenu')">BACK</div>
            <div @click="reset">RSET</div>
            <div @click="step">STEP</div>
            <div @click="fast">FAST</div>
        </div>
        <div class="instruction-grid board" :style="boardStyle">
            <template v-for="col in cols" :key="col">
                <div v-for="row in rows" :key="row" class="field" :style="{'grid-column': col, 'grid-row': row}"></div>
            </template>
            <div class="field thebird" :class="birdClasses" :style="birdStyle">
                <img v-if="bird.flappingImage" src="@/assets/flappy1.png"/>
                <img v-else src="@/assets/flappy2.png"/>
            </div>
            <Instruction v-for="(gridObject, index) in boardObjects" :key="index" v-bind="gridObject"/>
        </div>
    </div>
</template>

<script>
const SPEED = 100;
import Instruction from "./Instruction.vue"

export default {
    name: 'Board',
    props: {
        cols: Number,
        rows: Number,
        gridObjects: Array,
        birdX: Number,
        birdY: Number,
    },
    components: {
        Instruction,
    },
    data() {
        return {
            birdIsMoving: false,
            bird: {
                x: this.birdX,
                y: this.birdY,
                flappingImage: true,
                direction: "right",
            },
            birdClasses: [],
            flappingInterval: null,
            boardObjects: this.gridObjects,
        }
    },
    computed: {
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
    },
    methods: {
        moveBird(xDiff, yDiff) {
            if (this.birdIsMoving) {
                console.error("can not move bird while still moving");
                return;
            }
            this.birdIsMoving = true;
            let newX = this.bird.x + xDiff;
            let newY = this.bird.y + yDiff;

            if (!(xDiff === 0 || yDiff === 0)) {
                throw new Error("can only move in one direction at the same time");
            }
            let direction = null;
            if (xDiff < 0) {
                direction = "left";
            } else if (xDiff > 0) {
                direction = "right";
            } else if (yDiff < 0) {
                direction = "up";
            } else if (yDiff > 0) {
                direction = "down";
            }
            this.birdClasses.length = 0;
            this.birdClasses.push(direction);
            this.birdClasses.push("moving");
            if (newX <= 0 || newY <= 0 || newX > this.cols || newY > this.rows) {
                this.dieBird();
            } else {
                setTimeout(() => {
                    this.birdClasses.pop();
                    this.bird.x += xDiff;
                    this.bird.y += yDiff;
                    this.birdIsMoving = false;
                }, 2 * SPEED);
            }
        },
        dieBird() {
            clearInterval(this.flappingInterval);
            setTimeout(() => {
                this.birdClasses.push("dead");
            }, 0.5 * SPEED);
        },

    },
    mounted() {
        this.flappingInterval = setInterval(() => {
            this.bird.flappingImage = !this.bird.flappingImage;
        }, SPEED);
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
    grid-template-columns: repeat(4, 107px);
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
</style>
