<template>
    <div class="board-container">
        <div class="board" :style="boardStyle">
            <div v-for="i in (cols * rows)" :key="i" class="field"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Board',
    props: {
        cols: Number,
        rows: Number,
    },
    computed: {
        boardStyle() {
            console.log(this);
            return {
                "grid-template-columns": `repeat(${this.cols}, 107px`,
                "grid-template-rows": `repeat(${this.rows}, 107px`,
            }
        },
    }
}
</script>

<style scoped>
.board-container {
    width: fit-content;
    margin: 0 auto;
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
}
</style>
