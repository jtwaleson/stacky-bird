import { createRouter, createWebHashHistory } from 'vue-router'

import MainMenu from './components/MainMenu.vue'
import LevelEditor from './components/LevelEditor.vue'
import LevelPlayer from './components/LevelPlayer.vue'

const routes = [
    {
        path: '/',
        name: 'Main',
        component: MainMenu,
    },
    {
        path: '/level/:levelName',
        name: 'Level Player',
        component: LevelPlayer,
        props: true,
    },
    {
        path: '/level-editor/',
        name: 'Level Editor',
        component: LevelEditor,
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
