import { createRouter, createWebHistory } from 'vue-router'

import MainMenu from '../components/MainMenu.vue'
import LevelPlayer from '../components/LevelPlayer.vue'
import BlockWiki from '../components/BlockWiki.vue'

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
        path: '/wiki',
        name: 'Block Wiki',
        component: BlockWiki,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
