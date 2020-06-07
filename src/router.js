import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'

Vue.use(VueRouter)

import auth from './functions/gotrue-auth'
import EmptyRouterView from './components/EmptyRouterView'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,

    beforeEnter: async (to, from, next) => {
      if (!auth.currentUser()) next({ name: 'Auth' })
      else next()
    }
  },

  /**
   * Auth
   */
  {
    path: '/auth',
    redirect: { name: 'Auth' },
    component: EmptyRouterView,

    children: [
      {
        path: 'identify', 
        name: 'Auth',
        beforeEnter: async (to, from, next) => {
          if (!auth.currentUser()) next()
          else next({ name: 'Dashboard' })
        },
        component: () => import(/* webpackChunkName: "Auth" */ './views/Auth.vue')
      },

      {
        path: 'signin', 
        name: 'AuthSignin',
        component: () => import(/* webpackChunkName: "AuthSignin" */ './views/AuthSignin.vue'),

        beforeEnter: async (to, from, next) => {
          if (to.params?.email) next()
          else next({ name: 'Auth' })
        }
      },

      {
        path: 'toggl',
        name: 'AuthWithToggl',
        component: () => import(/* webpackChunkName: "AuthWithToggl" */ './views/AuthWithToggl.vue')
      },

      {
        path: 'signout',
        name: 'AuthSignout',
        component: () => import(/* webpackChunkName: "AuthSignout" */ './views/AuthSignout.vue'),

        beforeEnter: async (to, from, next) => {
          console.log('ok')
          const user = auth.currentUser()
          if (!user) 
            next({ name: 'Auth' })
          else 
            user.logout()
              .then(response => next())
              .catch(error => console.error("Failed to logout user: %o", error))
        }
      },

      {
        path: 'password-lost',
        name: 'AuthPasswordLost',
        component: () => import(/* webpackChunkName: "AuthPasswordLost" */ './views/AuthPasswordLost.vue')
      },

      {
        path: 'signup', 
        redirect: { name: 'AuthSignup' },
        component: EmptyRouterView,

        children: [
          {
            path: '',
            name: 'AuthSignup',
            component: () => import(/* webpackChunkName: "AuthSignup" */ './views/AuthSignup.vue'),
          },
          {
            path: 'verify-token',
            name: 'AuthSignup__verifyToken',
            component: () => import(/* webpackChunkName: "AuthSignup__verifyToken" */ './views/AuthSignup__verifyToken.vue'),
          },
          {
            path: '/auth/signup/account-config',
            redirect: { name: 'AuthSignup__accountConfig__1' },
            component: EmptyRouterView,

            beforeEnter: async (to, from, next) => {
              if (!auth.currentUser()) next({ name: 'Auth' })
              else next()
            },

            children: [
              {
                path: '/auth/signup/account-config/1',
                name: 'AuthSignup__accountConfig__1',
                component: () => import(/* webpackChunkName: "AuthSignup__accountConfig__1" */ './views/AuthSignup__accountConfig__1.vue')
              },
              {
                path: '/auth/signup/account-config/2',
                name: 'AuthSignup__accountConfig__2',
                component: () => import(/* webpackChunkName: "AuthSignup__accountConfig__2" */ './views/AuthSignup__accountConfig__2.vue')
              },
              {
                path: '/auth/signup/account-config/3',
                name: 'AuthSignup__accountConfig__3',
                component: () => import(/* webpackChunkName: "AuthSignup__accountConfig__3" */ './views/AuthSignup__accountConfig__3.vue')
              },
              {
                path: '/auth/signup/account-config/4',
                name: 'AuthSignup__accountConfig__4',
                component: () => import(/* webpackChunkName: "AuthSignup__accountConfig__4" */ './views/AuthSignup__accountConfig__4.vue')
              },
              {
                path: '/auth/signup/account-config/5',
                name: 'AuthSignup__accountConfig__5',
                component: () => import(/* webpackChunkName: "AuthSignup__accountConfig__5" */ './views/AuthSignup__accountConfig__5.vue')
              }
            ]
          }
        ]
      } // end /auth/signup

    ]
  }, // end /auth


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

export default router
