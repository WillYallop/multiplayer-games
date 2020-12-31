export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'multiplayer-games',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    'simplebar/dist/simplebar.min.css',
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/plugins/vue-closable.js', ssr: false },
    { src: '~/plugins/vue-particals.js', ssr: false }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/auth',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    ['nuxt-fontawesome', {
      component: 'fa',
      imports: [
        {
          set: '@fortawesome/free-solid-svg-icons',
          icons: ['faChevronRight', 'faChevronDown', 'faUsers', 'faPlus', 'faBell', 'faUser', 'faCog', 'faHome', 'faUnlockAlt', 'faEye', 'faSignOutAlt', 'faSearch']
        }
      ]
    }],
  ],
  // User Auth
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/user/signin', method: 'post', propertyName: 'token' },
          user: { url: '/user', method: 'get', propertyName: 'data' },
          logout: false
        },
        autoFetchUser: true
      }
    },
    redirect: false,
    resetOnError: true,
  },
  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: 'https://multiplayer-game-api.herokuapp.com/v1'
  },
  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  },
  env: {
    API_URL: 'https://multiplayer-game-api.herokuapp.com/v1'

  },
  server: {     
    port: process.env.PORT || 8000,
    host: '0.0.0.0',  
  },
}
