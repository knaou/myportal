<template lang="pug">
  v-card(shaped)
      v-card-title.card-title {{value.title}}
      v-card-text.text
          v-layout(justify-center)
              LinkIcon.icon(:value="value" :href="value.linkto")
          v-layout(justify-center)
              v-chip(v-for="tag in value.tags" :key="value._id + '_' + tag" x-small outlined @click.stop="") {{tag}}
          Markdown.description {{ value.description }}
      v-card-actions
          v-btn(:href="value.linkto" small text color="blue") Jump
</template>
<script>
import Markdown from "vue-markdown";
import LinkIcon from "./LinkIcon";

export default {
    name: "Link",
    components: { LinkIcon, Markdown },
    props: {
        value: { type: Object, required: true },
    },
};
</script>
<style lang="less">
.card-title {
    padding: 4px 1em;
    justify-content: center;
}
.description {
    margin-top: 0.5em;
}
.icon {
    display: block;
    margin: 0.5em;
}
.text {
    padding-bottom: 0;
}
</style>
