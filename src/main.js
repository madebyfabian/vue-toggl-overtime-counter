import Vue from 'vue'
import App from './App.vue'
import router from './router'

// Load Dayjs
import '@/plugins/Dayjs'

// Load Progress Bar
import VueProgressBar from 'vue-progressbar'
Vue.use(VueProgressBar, {
  color: '#2EAADC',
})

// Load PersistState
import { providers } from '@/config'
import PersistantState from '@/plugins/PersistentState'
const tempProviderObj = {}
for (const provider of providers) {
  const newData = { authToken: null }
  if (provider.name === 'papierkram')
    newData.subdomain = null
  tempProviderObj[provider.name] = newData
}
Vue.use(PersistantState, {
  prefix: '__OVERTIMETRACKR_STORE:',
  initialState: {
    temp: {
      user: { name: null, email: null },
      providers: tempProviderObj
    }
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
