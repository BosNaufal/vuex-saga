
import sagaRun from './sagaRun.js'

let VuexSaga = {}
VuexSaga.install = function (Vue, options) {
  if (!options) throw new Error("[Vuex Saga]: Should pass the store in the plugin installation options")
  const { store } = options

  Vue.mixin({
    beforeCreate: function () {
      this.$run = (action, payload) => {
        return store.dispatch(action, payload)
        .then((generator) => {
          if (!generator) throw new Error("[Vuex Saga]: You're running ordinary action. Use Vuex mapActions instead of Vuex Saga mapSagas")
          return sagaRun(generator, store)
        })
      }
    }
  })
}

export default VuexSaga;
