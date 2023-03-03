import '@/plugins/vue-composition-api'
import '@/styles/styles.scss'
import axios from 'axios'
import Vue from 'vue'
import VueAxios from 'vue-axios'
import App from './App.vue'
// import firebaseMessaging from './firebase/firebase'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// Vue.prototype.$messaging = firebaseMessaging

Vue.use(VueAxios, axios)

// axios.defaults.baseURL = 'https://api.jasmine-k.com/api/web/'

axios.defaults.baseURL = 'http://localhost:3500/api/web/'

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      store.dispatch('submitLogout')
      router.push('/')

      // location.reload()
    }

    if (error.response.status === 402) {
      router.push('/paymentRequired')
    }

    return Promise.reject(error)
  },
)

new Vue({
  router,
  store,
  vuetify,

  // watch: {
  //   $route(to) {
  //     console.log('to', to)

  //     // if (to.meta.reload === true) {
  //     //   window.location.reload()
  //     // }
  //   },
  // },
  render: h => h(App),
}).$mount('#app')
