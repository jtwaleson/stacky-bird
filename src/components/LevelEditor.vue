<template>
    <div class="instruction-grid-container">
        <h2><T textKey="Menu"/></h2>
        <div class="menu-container">
            <div @click="$store.commit('openMenu')">BACK</div>
            <div @click="clearWithWarning">CLEAR</div>
        </div>
        <h2><T textKey="Available Instruction Blocks"/></h2>
        <InstructionList draggable showAll/>
        <div class="board" :style="boardStyle">
            <template v-for="col in cols" :key="col">
                <div v-for="row in rows" :key="row" class="field" :style="{'grid-column': col, 'grid-row': row}" @drop="drop(col, row, $event)" @dragover="allowDrop"></div>
            </template>
            <Instruction v-for="(gridObject, index) in boardObjects" :key="index" v-bind="gridObject" :deleteMethod="() => deletePlacedInstruction(gridObject)"/>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Instruction from "./Instruction.vue"
import InstructionList from "./InstructionList.vue"


export default {
    name: 'Board',
    components: {
        Instruction,
        InstructionList,
    },
    data() {
        return {
            cols: 7,
            rows: 7,
            gridObjects: [],
            name: String,
            description: String,
            displayName: String,
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
            // TODO this needs guarding
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
            event.preventDefault();
        },
        deletePlacedInstruction(placedInstruction) {
            this.placedObjects = this.placedObjects.filter(item => item !== placedInstruction);
            this.saveBoardToLocalStorage();
        },
        // saveBoardToLocalStorage() {
        //     if (!this.name) {
        //         return;
        //     }
        //     let placedObjects = [];
        //     for (const placedObject of this.placedObjects) {
        //         placedObjects.push({
        //             x: placedObject.x,
        //             y: placedObject.y,
        //             code: placedObject.name,
        //         });
        //     }
        //     localStorage.setItem(this.name, JSON.stringify(placedObjects));
        // },
    },
    mounted() {
    },
    beforeUnmount() {
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
</style>
