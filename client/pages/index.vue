<template lang="pug">
    v-container
        v-row
            v-text-field(
                ref="search"
                v-model="search"
                append-icon="search"
                label="Search")

        v-flex
            v-chip-group(v-model="searchTags" multiple dense column)
                v-chip(v-for="tag in $store.state.tags" :key="tag" :value="tag" :disabled="! selectableTags.has(tag)"
                    filter) {{tag}}
        v-container
            v-layout(fluid d-flex flex-wrap justify-center align-start)
                Link.links(v-for="link in filteredLinks" :key="link._id" :value="link")
</template>

<script>
import Link from "@/components/Link";

export default {
    name: "Home",
    components: {
        Link,
    },
    async fetch({ store, params }) {
        await store.dispatch("loadLinks");
    },
    data() {
        return {
            tab: null,
            search: "",
            searchTags: [],
        };
    },
    computed: {
        selectableTags() {
            let tags = new Set();
            this.filteredLinks.forEach((link) => {
                link.tags.forEach((tag) => tags.add(tag));
            });
            return tags;
        },
        filteredLinks() {
            const s = this.search.trim();
            const items = [];
            this.$store.state.links.forEach((item) => {
                let add = false;
                if (s.length > 0) {
                    if (
                        (item.title &&
                            item.title
                                .toLowerCase()
                                .includes(s.toLowerCase())) ||
                        (item.description &&
                            item.description
                                .toLowerCase()
                                .includes(s.toLowerCase()))
                    ) {
                        add = true;
                    } else if (item && item.tags) {
                        for (const tag in item.tags) {
                            if (tag === s) {
                                add = true;
                            }
                        }
                    }
                } else {
                    add = true;
                }
                if (add && this.searchTags.length > 0) {
                    for (const t in this.searchTags) {
                        let safe = false;
                        for (const _t in item.tags) {
                            if (item.tags[_t] === this.searchTags[t]) safe = true;
                        }
                        if (!safe) add = false;
                    }
                }
                if (add && item.enabled) {
                    items.push(item);
                }
            });

            return items;
        },
    },
};
</script>

<style lang="less" scoped>
.links {
    margin: 0.5em;
}
.category_section {
    margin-top: 2em;
}
</style>
