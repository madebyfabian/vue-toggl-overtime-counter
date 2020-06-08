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
    meta: { requiresAuth: true }
  },

  /**
   * Auth
   */
  {
    path: '/auth',
    redirect: { name: 'AuthSignin' },
    component: EmptyRouterView,

    children: [
      {
        path: 'signin', 
        name: 'AuthSignin',
        component: () => import(/* webpackChunkName: "AuthSignin" */ './views/AuthSignin.vue')
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
            component: () => import(/* webpackChunkName: "AuthSignup" */ './views/AuthSignup__01.vue'),
          },

          {
            path: 'toggl',
            name: 'AuthSignup__toggl',
            component: () => import(/* webpackChunkName: "AuthWithToggl" */ './views/AuthSignup__02_toggl.vue')
          },

          {
            path: 'create-account',
            name: 'AuthSignup__createAccount',
            component: () => import(/* webpackChunkName: "AuthSignup__createAccount" */ './views/AuthSignup__03_createAccount.vue'),
          },

          {
            path: 'verify-token',
            name: 'AuthSignup__verifyToken',
            component: () => import(/* webpackChunkName: "AuthSignup__verifyToken" */ './views/AuthSignup__04_verifyToken.vue'),
          },
          
          {
            path: 'account-config',
            redirect: { name: 'AuthSignup__05_workspaces' },
            component: EmptyRouterView,
            meta: { requiresAuth: true },

            children: [
              {
                path: 'workspaces',
                name: 'AuthSignup__05_workspaces',
                component: () => import(/* webpackChunkName: "AuthSignup__05_workspaces" */ './views/AuthSignup__05_workspaces.vue')
              },

              {
                path: 'projects',
                name: 'AuthSignup__06_projects',
                component: () => import(/* webpackChunkName: "AuthSignup__06_projects" */ './views/AuthSignup__06_projects.vue')
              },

              {
                path: 'business-days',
                name: 'AuthSignup__07_businessDays',
                component: () => import(/* webpackChunkName: "AuthSignup__07_businessDays" */ './views/AuthSignup__07_businessDays.vue')
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

router.beforeEach(async (from, to, next) => {
  if (from.matched.some(record => record.meta.requiresAuth) && !(auth.currentUser())) 
    next({ name: 'AuthSignin' })
  else
    next()
})

export default router
