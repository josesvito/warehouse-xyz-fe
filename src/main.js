import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//? Bootstrap Vue -> bootstrap + icon bootstrap
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/css/all.css'
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
//* END Bootstrap Vue

//? Vuelidate -> validasi form
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)
//* END Vuelidate

//? Font Awesome -> icon fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
// import { faSpinner } from '@fortawesome/free-solid-svg-icons' // satu satu di import
import { fas } from '@fortawesome/free-solid-svg-icons' // semua di import
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(fas)
Vue.component('font-awesome', FontAwesomeIcon)
//* END Font Awesome

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
