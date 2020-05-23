import Vue from 'vue'
import VueRouter from 'vue-router'
import Default from '@/views/Default.vue'

Vue.use(VueRouter)

import auth from './functions/gotrue-auth'

const routes = [
  {
    path: '/',
    name: 'Default',
    component: Default,

    beforeEnter: async (to, from, next) => {
      // Check, if the user clicked the email-confirmation link
      const confirmationToken = to.hash.match(/(?<=#confirmation_token=)(.*)$/)?.[0]
      if (confirmationToken) {
        auth.confirm(confirmationToken, true)
          .then(confirmation => {
            console.log('Successfully registered and confirmed! Now redirecting to the root', confirmation)
            return next()
          })
          .catch(error => {
            // Error while confirming. Maybe the user already confirmed it. Redirect to login
            console.log('Error while confirming. Maybe the user already confirmed it. Redirect to login')
            console.error(error)
            return next({ name: 'AuthSignin' })
          })
      }

      if (!auth.currentUser())
        return next({ name: 'AuthSignin' })

      return next()
    }
  },
  {
    path: '/auth/signup',
    name: 'AuthSignup',
    component: () => import(/* webpackChunkName: "AuthSignup" */ './views/AuthSignup.vue')
  },
  {
    path: '/auth/signin',
    name: 'AuthSignin',
    component: () => import(/* webpackChunkName: "AuthSignin" */ './views/AuthSignin.vue')
  },
  
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
