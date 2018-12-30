<template>
    <v-app dark>
        <v-toolbar app>
            <v-toolbar-side-icon>
                <img v-if="icon === 0" src='@/assets/flappy0.png' width="40px" height="40px"/>
                <img v-else src='@/assets/flappy1.png' width="40px" height="40px"/>
            </v-toolbar-side-icon>
            <v-toolbar-title>Stacky Bird</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-sm-and-down">
                <v-btn flat to="/">Levels</v-btn>
                <v-btn flat to="/about">About</v-btn>
                <v-btn flat href="https://github.com/jtwaleson/stacky-bird" target="_blank">GitHub</v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-content>
            <router-view/>
        </v-content>
        <v-footer app></v-footer>
    </v-app>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            icon: 0,
            timer: null,
        }
    },
    mounted() {
        this.timer = setInterval(() => {
            this.icon += 1;
            this.icon = this.icon % 2;
        }, 1000);
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
};
</script>
