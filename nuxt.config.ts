// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    modules: [
        '@pinia/nuxt',
        '@element-plus/nuxt',
        '@nuxt/image'
    ],
    css: [
        "~/assets/index.css",
    ],
    //ssr: false,
    app: {
        head: {
            title: '技能库',
            htmlAttrs: {
                lang: 'en'
            },
            link: [
                {rel: 'icon', type: 'image/jpeg', href: '/img/app_icon.jpeg'},
            ]
        },
    },

})
