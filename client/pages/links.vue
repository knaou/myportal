<template lang="pug">
    v-container
        v-card
            v-dialog(v-model="dialog" persistent @keydown.esc="dialog = false" max-width="40em")
                LinkEditor(:edit="dialog_edit" :link="dialog_link" @action="close_dialog")
            v-card-title
                v-text-field(
                    v-model="search"
                    append-icon="search"
                    label="Search"
                    hide-details)
                v-btn(text @click="addItem")
                    v-icon add
            v-data-table(
                :items="$store.state.links"
                :search="search",
                :headers="headers"
                item-key="_id")
                template(v-slot:item.enabled="{ item }")
                    v-simple-checkbox(v-model="item.enabled" disabled)
                template(v-slot:item.image="{ item }")
                    LinkIcon.icon(:value="item")
                template(v-slot:item.tags="{ item }")
                    v-chip(v-for="tag in item.tags" :key="item._id + '_' + tag" x-small outlined) {{tag}}
                template(v-slot:item.action="{ item }")
                    v-icon(small class="mr-2" @click="editItem(item)") edit
                    v-icon(small @click="deleteItem(item)") delete
</template>
<script>
import { mapActions } from "vuex";
import LinkEditor from "@/components/LinkEditor";
import LinkIcon from "@/components/LinkIcon";
import { normalizeLink } from "@/lib/LinkUtil";

export default {
    name: "Links",
    components: {
        LinkIcon,
        LinkEditor,
    },
    async fetch({ store, params }) {
        await store.dispatch("loadLinks");
    },
    data() {
        return {
            search: "",
            dialog: false,
            dialog_edit: false,
            dialog_link: {},
            headers: [
                { text: "Enabled", value: "enabled" },
                { text: "Icon", value: "image", width: 80, filterable: false },
                { text: "Title", value: "title" },
                { text: "Description", value: "description" },
                { text: "LinkTo", value: "linkto" },
                { text: "Tags", value: "tags" },
                { text: "Actions", value: "action", sortable: false },
            ],
        };
    },
    methods: {
        addItem() {
            this.loadSynonyms();
            this.dialog_edit = false;
            this.dialog_link = normalizeLink();
            this.dialog = true;
        },
        editItem(item) {
            this.loadSynonyms();
            this.dialog_edit = true;
            this.dialog_link = normalizeLink(item);
            this.dialog = true;
        },
        deleteItem(item) {
            if (
                confirm("Are you sure you want to delete " + item.title + "?")
            ) {
                this.removeLink(item._id);
            }
        },
        async close_dialog(link) {
            this.dialog = false;
            if (link) {
                if (this.dialog_edit) {
                    await this.updateLink(link);
                } else {
                    await this.addLink(link);
                }
            }
        },
        ...mapActions(["loadSynonyms", "addLink", "updateLink", "removeLink"]),
    },
};
</script>
<style lang="less" scoped>
.icon {
    margin: 0.5em;
}
</style>

