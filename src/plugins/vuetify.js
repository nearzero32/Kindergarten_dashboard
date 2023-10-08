import preset from '@/@core/preset/preset'
import '@fortawesome/fontawesome-free/css/all.css'
import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

export default new Vuetify({
  preset,
  icons: {
    iconfont: 'mdiSvg' || 'fa',
  },
  theme: {
    options: {
      customProperties: true,
      variations: false,
    },
  },
})
