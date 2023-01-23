import { normalizeLink, copyLinkContent } from "../lib/LinkUtil";

export const state = () => ({
  links: [],
  tags: [],
  linkUpdating: false,
  errors: [],
});

export const mutations = {
  setError(state, payload) {
    state.errors.push(payload);
  },
  clearError(state) {
    state.errors = [];
  },
  setTags(state, payload) {
    state.tags = payload;
  },
  setLinkUpdating(state, payload) {
    state.linkUpdating = payload;
  },
  setLinks(state, payload) {
    state.links = payload;
  },
  applyLink(state, { _id, link }) {
    const filtered = state.links.filter((v) => {
      return v._id === _id;
    });
    if (filtered.length > 0) {
      const l = filtered[0];
      if (link) {
        // Update
        copyLinkContent(link, filtered[0]);
      } else {
        // Delete
        state.links.splice(state.links.indexOf(l), 1);
      }
    } else {
      // Added
      state.links.push(link);
    }
  },
};

export const actions = {
  async loadSynonyms(context) {
    try {
      context.commit("setLinkUpdating", true);
      const synonyms = await this.$axios.$get("/d/synonyms");
      context.commit("setTags", synonyms.tags);
      context.commit("setLinkUpdating", false);
    } catch (err) {
      context.commit("setError", err);
    }
  },
  async loadLinks(context) {
    try {
      context.commit("setLinkUpdating", true);
      const links = await this.$axios.$get("/d/links");
      context.commit(
        "setLinks",
        links.links.reduce((ret, l) => {
          ret.push(normalizeLink(l));
          return ret;
        }, [])
      );
      const synonyms = await this.$axios.$get("/d/synonyms");
      context.commit("setTags", synonyms.tags);
      context.commit("setLinkUpdating", false);
    } catch (err) {
      context.commit("setError", err);
    }
  },
  async addLink(context, payload) {
    try {
      context.commit("setLinkUpdating", true);
      const ret = await this.$axios.$post("/d/links", payload);
      context.commit("applyLink", {_id: ret._id, link: ret});
      context.commit("setLinkUpdating", false);
    } catch (err) {
      context.commit("setError", err);
    }
  },
  async updateLink(context, payload) {
    try {
      context.commit("setLinkUpdating", true);
      const ret = await this.$axios.$put("/d/links/" + payload._id, payload);
      context.commit("applyLink", { _id: ret._id, link: ret });
      context.commit("setLinkUpdating", false);
    } catch (err) {
      context.commit("setError", err);
    }
  },
  async removeLink(context, payload) {
    try {
      context.commit("setLinkUpdating", true);
      const ret = await this.$axios.$delete("/d/links/" + payload);
      context.commit("applyLink", { _id: ret._id, link: null });
      context.commit("setLinkUpdating", false);
    } catch (err) {
      context.commit("setError", err);
    }
  },
};
