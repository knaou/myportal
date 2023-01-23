<template lang="pug">
    v-card
        v-card-title.headline(v-if="edit") Edit {{link.title}}
        v-card-title.headline(v-else) New Link
        v-card-text
            v-container
                v-row
                    v-col(col="4")
                        v-layout.link_icon(flex d-flex align-end)
                            LinkIcon.icon(:value.sync="link")
                            v-btn(v-if="link.image" text small color="blue" @click="update_icon()") Change
                            v-btn(v-else text small color="blue" @click="update_icon()") Set
                            v-btn(v-if="link.image" text small @click="clear_icon()") Clear
                    v-col(col="6")
                        v-text-field(v-if="edit" label="ID" v-model="link._id" readonly)
                    v-col(col="2")
                        v-checkbox(v-if="edit" label="Enable" v-model="link.enabled")
                v-row
                    v-text-field(label="Title" v-model="link.title" dense required autofocus)
                v-row
                    v-col
                        v-textarea(label="Description" v-model="link.description" dense)
                    v-col
                        v-text-field(label="LinkTo" v-model="link.linkto" placeholder="https://...")
                        v-combobox(
                            label="Tags"
                            v-model="link.tags"
                            :items="$store.state.tags"
                            chips
                            clearable
                            multiple
                            dense)
                            template(v-slot:selection="{ attrs, item, select, selected }")
                                v-chip(
                                    v-bind="attrs"
                                    :input-value="selected"
                                    close dense
                                    @click="select"
                                    @click:close="remove_tag(item)")
                                    strong {{ item }}
        v-card-actions
            v-spacer
            v-btn(v-if="edit" @click="action(false)" color="blue" text) Apply
            v-btn(v-else @click="action(false)" color="blue" text) Create
            v-btn(@click="action(true)" color="gray" text) Cancel
</template>

<script>
import LinkIcon from "./LinkIcon";

export default {
    name: "LinkEditor",
    components: { LinkIcon },
    props: {
        edit: {
            type: Boolean,
        },
        link: {
            type: Object,
            required: true,
        },
    },
    methods: {
        action(cancel) {
            this.$emit("action", cancel ? null : this.link);
        },
        remove_tag(item) {
            this.link.tags.splice(this.link.tags.indexOf(item), 1);
            this.link.tags = [...this.link.tags];
        },
        update_icon() {
            const input = document.createElement("input");
            const canvas = document.createElement("canvas");
            const self = this;
            input.type = "file";
            input.accept = "image/*";
            input.onchange = (event) => {
                const file = event.target.files[0];
                if (file.type !== "image/jpeg" && file.type !== "image/png") {
                    alert("Invalid file");
                } else {
                    // Resize Image
                    const image = new Image();
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        image.onload = () => {
                            const retw = 64;
                            const reth = 64;
                            const w = image.width;
                            const h = image.height;

                            let ratio;
                            if (retw * h > reth * w) {
                                ratio = retw / w;
                            } else {
                                ratio = reth / h;
                            }

                            canvas.setAttribute("width", retw);
                            canvas.setAttribute("height", reth);
                            const ctx = canvas.getContext("2d");
                            ctx.clearRect(0, 0, retw, reth);
                            ctx.drawImage(
                                image,
                                0,
                                0,
                                w,
                                h,
                                (retw - w * ratio) / 2.0,
                                (reth - w * ratio) / 2.0,
                                w * ratio,
                                h * ratio
                            );
                            self.link.image = canvas
                                .toDataURL("image/png")
                                .slice("data:image/png;base64,".length);
                        };
                        image.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        },
        clear_icon() {
            this.link.image = null;
        },
    },
};
</script>

<style lang="less" scoped>
.link_icon {
    margin-bottom: 2em;

    .icon {
        margin-right: 1em;
    }
}
</style>
