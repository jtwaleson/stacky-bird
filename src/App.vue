<template>
    <router-view/>
</template>

<script>
export default {
    name: 'App',
}
</script>

<style>
body {
    user-select: none;
}
/* for now use the beautiful 2048 colors */
.field-style-A {
    background: #eee4da;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0), inset 0 0 0 1px rgba(255, 255, 255, 0);
}
.field-style-B {
    background: #eee1c9;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0), inset 0 0 0 1px rgba(255, 255, 255, 0);
}
.field-style-C {
    color: #f9f6f2;
    background: #f3b27a;
}
.field-style-D {
    color: #f9f6f2;
    background: #f69664;
}
.field-style-E {
    color: #f9f6f2;
    background: #f77c5f;
}
.field-style-F {
    color: #f9f6f2;
    background: #f75f3b;
}
.field-style-G {
    color: #f9f6f2;
    background: #edd073;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.2380952381), inset 0 0 0 1px rgba(255, 255, 255, 0.1428571429);
}
.field-style-H {
    color: #f9f6f2;
    background: #edcc62;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.3174603175), inset 0 0 0 1px rgba(255, 255, 255, 0.1904761905);
}
.field-style-I {
    color: #f9f6f2;
    background: #edc950;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.3968253968), inset 0 0 0 1px rgba(255, 255, 255, 0.2380952381);
}
.field-style-J {
    color: #f9f6f2;
    background: #edc53f;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.4761904762), inset 0 0 0 1px rgba(255, 255, 255, 0.2857142857);
}
.field-style-K {
    color: #f9f6f2;
    background: #edc22e;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.5555555556), inset 0 0 0 1px rgba(255, 255, 255, 0.3333333333);
}
.field-style-Z {
    color: #000;
    background: #000;
    box-shadow: 0 0 30px 10px #000, inset 0 0 0 1px #000;
}
.field-style-F1 {
    color: #ff9a00;
    background: #f75f3b;
}
.field-style-F2 {
    color: #0065ff;
    background: #f75f3b;
}
.field-style-A1 {
    color: #ff9a00;
    background: #eee4da;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0), inset 0 0 0 1px rgba(255, 255, 255, 0);
}
.field-style-A2 {
    color: #0065ff;
    background: #eee4da;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0), inset 0 0 0 1px rgba(255, 255, 255, 0);
}
</style>
