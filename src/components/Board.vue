<template>
    <div class="board-container">
        <div class="board" :style="boardStyle">
            <template v-for="col in cols" :key="col">
                <div v-for="row in rows" :key="row" class="field" :style="{'grid-column': col, 'grid-row': row}"></div>
            </template>
            <div class="field thebird" :class="birdClasses" :style="birdStyle">
                <img v-if="bird.flappingImage" src="@/assets/flappy1.png"/>
                <img v-else src="@/assets/flappy2.png"/>
            </div>
        </div>
    </div>
</template>

<script>
const SPEED = 100;

export default {
    name: 'Board',
    props: {
        cols: Number,
        rows: Number,
    },
    data() {
        return {
            birdIsMoving: false,
            bird: {
                x: 2,
                y: 2,
                flappingImage: true,
            },
            birdClasses: [],
        }
    },
    computed: {
        boardStyle() {
            return {
                "grid-template-columns": `repeat(${this.cols}, 107px`,
                "grid-template-rows": `repeat(${this.rows}, 107px`,
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
            this.birdClasses.push("moving");
            this.birdClasses.push(`moving-${direction}`);
            if (newX <= 0 || newY <= 0 || newX > this.cols || newY > this.rows) {
                setTimeout(() => {
                    this.birdClasses.push("dead");
                }, 0.5 * SPEED);
            } else {
                setTimeout(() => {
                    this.birdClasses.pop();
                    this.birdClasses.pop();
                    this.bird.x += xDiff;
                    this.bird.y += yDiff;
                    this.birdIsMoving = false;
                }, 2 * SPEED);
            }
        }
    },
    mounted() {
        setInterval(() => {
            this.moveBird(1, 0);
        }, 3 * SPEED);
        setInterval(() => {
            this.bird.flappingImage = !this.bird.flappingImage;
        }, SPEED);
    },
}
</script>

<style scoped>
.board-container {
    width: fit-content;
    margin: 0 auto;
    margin-top: 200px;
}
.board {
    display:  grid;
    border-radius: 6px;
    grid-gap: 15px;
    background-color: #bbada0;
    padding: 15px;
}
.field {
    display: grid;
    border-radius: 3px;
    justify-content: center;
    align-items: center;
    background-color: #eee4da;
    color: #776e65;
    font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
    font-size: 55px;
    z-index: 0;
}
.thebird {
    display: none;
    background: none;
    z-index: 100;
    width: 107px;
    height: 107px;
}
.thebird img {
    width: 100%;
    height: 100%;
}
.moving {
    transition:
        margin ease-in-out 100ms; /* 2X SPEED */
}
.moving-left {
    margin-left:-122px;
}
.moving-right {
    margin-left: 122px;
}
.moving-up {
    margin-top: -122px;
}
.moving-down {
    margin-top: 122px;
}
.dead {
    background-color: red;
}
</style>
