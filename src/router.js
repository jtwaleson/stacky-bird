import Vue from 'vue';
import Router from 'vue-router';
import LevelIndex from '@/components/LevelIndex';
import NotFound from '@/components/NotFound';
import Level from '@/components/Level';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: LevelIndex,
        },
        {
            path: '/level/:id',
            component: Level,
        },
        {
            path: '*',
            component: NotFound,
        },
    ],
});
