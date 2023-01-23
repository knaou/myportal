<template lang="pug">
    v-app
        v-app-bar(app dark dense flat)
            v-toolbar-title(left)
                nuxt-link.title-label(to="/" nuxt) MyPortal
            v-spacer
            v-btn(to="/" nuxt)
                v-icon dashboard
                span Dashboard
            v-btn(to="/links" nuxt)
                v-icon list
                span Manage-List
        v-content(app)
            nuxt
        v-footer(app)
            v-bottom-sheet(v-if="$store.state.errors", v-model="show_errors")
                v-sheet.text-center(height="150px")
                    v-btn.mt-6(text, color="red", @click="show_errors=false") Reload
                    div.py-3(v-for="err in $store.state.errors") {{err}}
            span &copy; 2020 naou. All right reserved.
</template>

<script>
import { mapMutations } from "vuex";

export default {
    data: () => ({
        drawer: null,
        mini: true,
        tab: null,
    }),
    computed: {
        show_errors: {
            get() {
                return this.$store.state.errors.length > 0;
            },
            set(v) {
                if (v) {
                    // Do nothing
                } else {
                    this.clearError();
                    location.reload();
                }
            },
        },
    },
    methods: {
        ...mapMutations(["clearError"]),
    },
};
</script>
<style lang="less" scoped>
.title-label {
    text-decoration: none;
    color: white;
    font-size: x-large;
}
</style>
