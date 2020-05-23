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
      // Check, if the user clicked the signup email-confirmation link
      const confirmationToken = to.hash.match(/(?<=#confirmation_token=)(.*)$/)?.[0]
      if (confirmationToken) 
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


      // Check, if the user clicked the account recovery (password lost) link
      const recoveryToken = to.hash.match(/(?<=#recovery_token=)(.*)$/)?.[0]
      if (recoveryToken) 
        // Redirect user to "set a new password page"
        return next({ name: 'AuthPasswordChange', params: { recoveryToken } })


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
    component: () => import(/* webpackChunkName: "AuthSignin" */ './views/AuthSignin.vue'),

    beforeEnter: async (to, from, next) => {
      // Check if user is already logged in
      const user = auth.currentUser()
      if (user)
        next({ name: 'Default' })
      
      next()
    }
  },
  {
    path: '/auth/password-lost',
    name: 'AuthPasswordLost',
    component: () => import(/* webpackChunkName: "AuthPasswordLost" */ './views/AuthPasswordLost.vue')
  },
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
