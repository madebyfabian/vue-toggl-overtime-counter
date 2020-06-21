import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import auth from '@/plugins/GotrueAuth'
import EmptyRouterView from '@/components/views/EmptyRouterView'
import MainAppView from '@/components/views/MainAppView'

import { providers } from '@/config'

import TimerView from '@/views/Timer.vue'


const routes = [
  {
    path: '/',
    component: MainAppView,
    children: [
      {
        path: '/',
        name: 'Dashboard',
        component: TimerView,
        meta: { title: 'Timer', requiresAuth: true }
      },

      {
        path: '/auth',
        redirect: { name: 'AuthSignin' },
        component: EmptyRouterView,
        children: [
          {
            path: 'signin', 
            name: 'AuthSignin',
            component: () => import('@/views/Auth/AuthSignin.vue'),
            meta: { title: 'Anmelden' }
          },
    
          {
            path: 'password-lost',
            name: 'AuthPasswordLost',
            component: () => import('@/views/Auth/AuthPasswordLost.vue'),
            meta: { title: 'Passwort vergessen?' }
          },
    
          {
            path: 'signup', 
            redirect: { name: 'AuthSignup' },
            component: EmptyRouterView,
            meta: { title: 'Konto erstellen' },
            children: [
              {
                path: '',
                name: 'AuthSignup',
                component: () => import('@/views/Auth/AuthSignup.vue')
              },

              {
                path: 'provider/:provider',
                name: 'AuthSignup_withProvider',
                beforeEnter: (to, from, next) => {
                  return !providers.find(provider => provider.name === to.params?.provider) 
                    ? next({ name: 'AuthSignup' }) : next()
                },
                component: () => import('@/views/Auth/AuthSignup_withProvider.vue')
              },

              {
                path: 'create-account',
                name: 'AuthSignup_createAccount',
                beforeEnter: (to, from, next) => {
                  return !to.params?.connectionToProvider?.successful
                    ? next({ name: 'AuthSignup' }) : next()
                },
                component: () => import('@/views/Auth/AuthSignup_createAccount.vue')
              },
            ]
          }
        ]
      }, // end /auth
    ]
  },

  // Catch 404
  {
    path: '*',
    redirect: { name: 'Dashboard' }
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach(async (from, to, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestRouteWithTitle = from.matched.slice().reverse().find(route => route.meta?.title)
  const title = nearestRouteWithTitle?.meta.title || ''
  document.title = `${title ? `${title} – ` : ''}overtimetrackr`

  // Check if this route is protected and is only allowed to access if user is signed in.
  if (from.matched.some(record => record.meta.requiresAuth) && !(auth.currentUser())) 
    next({ name: 'AuthSignin' })
  else
    next()
})

export default router
