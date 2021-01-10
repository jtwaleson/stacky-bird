<template>
    <div class="instruction" :class="classObject" :style="boardLocationStyle" :draggable="draggable" @dragstart="dragstart" :title="$tr(description)" @dragend="dragend">
        <button @click="deleteMe" v-if="userPlaced" class="delete">✖</button>
        <div class="symbol">{{ symbol }}</div>
        <div class="code">{{ name }}</div>
    </div>
</template>
<script>
export default {
    name: 'Instruction',
    data() {
        return {
            draggingAway: false,
        }
    },
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
        canBeDeleted: Boolean,
        deleteMethod: Function,
        instructionClass: {
            type: String,
            default: "A",
        },
    },
    methods: {
        dragstart(e) {
            e.dataTransfer.setData("text", this.name);
            if (this.userPlaced && !e.ctrlKey) {
                e.dataTransfer.setData("deleteX", this.x);
                e.dataTransfer.setData("deleteY", this.y);
                this.draggingAway = true;
            }
        },
        dragend() {
            this.draggingAway = false;
        },
        deleteMe() {
            if (this.deleteMethod) {
                this.deleteMethod();
            }
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
                "hide-dragging": this.draggingAway,
            };
            result[`field-style-${this.instructionClass}`] = true;
            return result;
        },

    },
}
</script>
<style scoped>
.instruction {
    display: grid;
    position: relative;
    border-radius: 3px;
    width: 107px;
    height: 107px;

    text-align: center;
    justify-content: center;
    align-items: center;
/*    background-color: #eee4da;
    color: #776e65; */
    font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
    font-size: 55px;
    z-index: 0;
    opacity: 0.3;
    user-select: none;
}
.board .instruction.hide-dragging {
    opacity: 0.1;
}
.instruction.unlocked {
    opacity: 1.0;
}
.board .instruction {
    box-shadow: 0px 0px 7px 0px black;
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
button.delete {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    outline: inherit;
    width: 17px;
    height: 17px;
    position: absolute;
    left: 10px;
    top: 10px;
    font-size: 14px;
    display: inline-block;
}
button.delete:hover {
    box-shadow: 0px 0px 7px 0px black;
}
</style>
