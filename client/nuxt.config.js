module.exports = {
  ssr: false,
  head: {
    titleTemplate: "%s - " + process.env.npm_package_name,
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  loading: { color: "#fff" },
  plugins: ["@plugins/vuetify"],
  buildModules: [
    "@nuxtjs/vuetify",
    "@nuxtjs/axios",
    "@nuxtjs/proxy",
    "@nuxtjs/pwa",
  ],
  proxy: {
    "/d": "http://127.0.0.1:5000",
  },
  wpa: {
    manifest: {
      name: "MyPortal",
      lang: "ja",
    },
  },
};
