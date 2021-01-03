<template>
    <div class="instruction" :class="classObject" :style="boardLocationStyle" :draggable="draggable" @dragstart="dragstart">
        <div class="symbol">{{ symbol }}</div>
        <div class="code">{{ name }}</div>
    </div>
</template>
<script>
export default {
    name: 'Instruction',
    props: {
        symbol: String,
        name: String,
        description: String,
        unlocked: Boolean,
        x: {
            required: false,
            default: null,
        },
        y: {
            required: false,
            default: null,
        },
        draggable: Boolean,
        userPlaced: Boolean,
        instructionClass: {
            type: String,
            default: "A",
        },
    },
    methods: {
        dragstart(e) {
            e.dataTransfer.setData("text", this.name);
        },
    },
    computed: {
        boardLocationStyle() {
            if (this.x !== null && this.y !== null) {
                return {
                    "grid-column": this.x,
                    "grid-row": this.y,
                }
            }
            return {};
        },
        classObject() {
            let result = {
                unlocked: this.unlocked,
                draggable: this.draggable,
                userPlaced: this.userPlaced,
            };
            result[`field-style-${this.instructionClass}`] = true;
            return result;
        },

    },
}
</script>
<style>
.instruction {
    display: grid;
    border-radius: 3px;
    width: 107px;
    height: 107px;

    text-align: center;
    justify-content: center;
    align-items: center;
    background-color: #eee4da;
    color: #776e65;
    font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
    font-size: 55px;
    z-index: 0;
    opacity: 0.3;
    user-select: none;
}

.instruction.unlocked {
    opacity: 1.0;
}
.board .instruction {
    /* if on the board, it is always unlocked */
    box-shadow: 0px 0px 7px 0px black;
    opacity: 1.0;
}
.instruction-grid .instruction:hover {
    box-shadow: 0px 0px 7px 0px blue;
}
.instruction-grid .instruction.draggable:hover {
    box-shadow: 0px 0px 7px 0px blue;
}
.instruction.userPlaced {
    box-shadow: 0px 0px 7px 0px blue;
}
.instruction .symbol {
    line-height: 70px;
}
.instruction .code {
    line-height: 37px;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 1.5px;
    color: #555;
    font-family: "Lucida Sans Typewriter", "Lucida Console", monospace;
}
</style>
