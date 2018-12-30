<template>
    <v-layout row style="margin-top: 30px">
        <v-flex xs12 sm6 offset-sm3>
            <v-card>
                <v-toolbar dark>
                    <v-toolbar-title>All Levels</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>

                <v-list two-line>
                    <template v-for="(item, index) in items">
                        <v-list-tile
                              :key="item.title"
                              avatar
                              ripple
                              @click="$router.push('/level/' + (index + 1))"
                        >
                            <v-list-tile-content>
                                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                                <!--<v-list-tile-sub-title class="text--primary">{{ item.headline }}</v-list-tile-sub-title>-->
                                <!--<v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>-->
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <!--<v-list-tile-action-text>{{ item.action }}</v-list-tile-action-text>-->
                                <v-icon
                                   v-if="selected.indexOf(index) < 0"
                                   color="grey lighten-1"
                                >star_border</v-icon>
                                <v-icon
                                   v-else
                                   color="yellow darken-2"
                                >star</v-icon>
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-divider
                            v-if="index + 1 < items.length"
                            :key="index"
                        ></v-divider>
                    </template>
                </v-list>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    name: 'LevelIndex',
    data() {
        return {
            items: [
                {
                    title: "1: Press Step",
                },
                {
                    title: "2: Press Play",
                },
                {
                    title: "3: A Corner",
                },
                {
                    title: "4: Return the Item",
                },
                {
                    title: "5: ???",
                },
            ],
            selected: [0],
        };
    },
};
</script>
