<template lang="pug">
    v-img(v-if="value.image" :src="'data:image/png;base64,' + value.image" max-width=64 max-height=64)
    span.noimage(v-else) NoImage
</template>
<script>
export default {
    name: "LinkIcon",
    props: {
        value: {
            type: Object,
            required: true,
        },
    },
};
</script>
<style lang="less" scoped>
.noimage {
    padding: 0.5em;
    border: solid 1px gray;
    font-size: xx-small;
    text-align: center;
}
</style>
