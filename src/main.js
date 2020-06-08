import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

Vue.mixin({
  created() {
    // console.log(this.$route?.meta?.title)

    // const title = this.$options?.title
    // if (title)
    //   document.title = title
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
