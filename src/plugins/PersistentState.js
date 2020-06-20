let globalState // avoid garbage collection

/**
 * @see https://github.com/arve0/vue-persistent-state/blob/master/index.js
 */
const install = ( Vue, config ) => {
  const { prefix, initialState } = config

  // Get state from localStorage.
  let state = {}
  for (let key in initialState) {
    let val = localStorageGet(prefix + key)
    if (!val) {
      localStorageSet(prefix + key, initialState[key])
      val = initialState[key]
    } 
    state[key] = val
  }

  // Make sure nested objects in initialState are not mutated.
  state = Object.assign({}, state)

  // Watch for changes.
  globalState = new Vue({
    data: state,
    watch: createWatchConfig(prefix, state),
  })

  Vue.mixin({
    data: function () {
      return state
    },
  })

  // Make store API available through $store.
  Vue.prototype.$store = state
}


export default { install }


const localStorageGet = ( fullKey ) => {
  try {
    return JSON.parse(localStorage.getItem(fullKey))
  } catch (error) {
    return null
  }
}

const localStorageSet = ( fullKey, value ) => {
  localStorage.setItem(fullKey, JSON.stringify(value))
}

const createWatchConfig = ( prefix, state ) => {
  let watch = {}
  for (let key in state) {
    watch[key] = {
      deep: true,
      handler: (newValue, oldValue) => {
        localStorageSet(prefix + key, newValue)
      }
    }
  }
  return watch
}


