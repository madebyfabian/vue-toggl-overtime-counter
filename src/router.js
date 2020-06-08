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
    meta: {
      title: 'Dashboard',
      requiresAuth: true
    }
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
        component: () => import(/* webpackChunkName: "AuthSignin" */ './views/AuthSignin.vue'),
        meta: {
          title: 'Anmelden'
        }
      },

      {
        path: 'password-lost',
        name: 'AuthPasswordLost',
        component: () => import(/* webpackChunkName: "AuthPasswordLost" */ './views/AuthPasswordLost.vue'),
        meta: {
          title: 'Passwort vergessen?'
        }
      },

      {
        path: 'signup', 
        redirect: { name: 'AuthSignup' },
        component: EmptyRouterView,
        meta: {
          title: 'Konto erstellen'
        },

        children: [
          {
            path: '',
            name: 'AuthSignup',
            component: () => import(/* webpackChunkName: "AuthSignup" */ './views/AuthSignup__01.vue')
          },

          {
            path: 'toggl',
            name: 'AuthSignup__toggl',
            component: () => import(/* webpackChunkName: "AuthWithToggl" */ './views/AuthSignup__02_toggl.vue'),
            meta: {
              title: 'Mit toggl anmelden'
            }
          },

          {
            path: 'create-account',
            name: 'AuthSignup__createAccount',
            component: () => import(/* webpackChunkName: "AuthSignup__createAccount" */ './views/AuthSignup__03_createAccount.vue')
          },

          {
            path: 'verify-token',
            name: 'AuthSignup__verifyToken',
            component: () => import(/* webpackChunkName: "AuthSignup__verifyToken" */ './views/AuthSignup__04_verifyToken.vue')
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
                component: () => import(/* webpackChunkName: "AuthSignup__05_workspaces" */ './views/AuthSignup__05_workspaces.vue'),
                meta: {
                  title: 'Deine Workspaces'
                }
              },

              {
                path: 'projects',
                name: 'AuthSignup__06_projects',
                component: () => import(/* webpackChunkName: "AuthSignup__06_projects" */ './views/AuthSignup__06_projects.vue'),
                meta: {
                  title: 'Deine Projekte'
                }
              },

              {
                path: 'business-days',
                name: 'AuthSignup__07_businessDays',
                component: () => import(/* webpackChunkName: "AuthSignup__07_businessDays" */ './views/AuthSignup__07_businessDays.vue'),
                meta: {
                  title: 'Deine Arbeitszeit'
                }
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
