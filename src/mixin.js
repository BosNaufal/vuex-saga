
import sagaRun from './sagaRun.js'

let VuexSaga = {}
VuexSaga.install = function (Vue, options) {
  Vue.mixin({
    beforeCreate: function () {
      const { $store } = this
      const store = {
        state: $store.state,
        dispatch: $store.dispatch,
        commit: $store.commit,
      }

      this.$run = (action, payload) => {
        return store.dispatch(action,payload)
        .then((generator) => {
          return sagaRun(generator, store)
        })
      }
    }
  })
}

export default VuexSaga;
