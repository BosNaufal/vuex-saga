import Vuex from 'vuex'
import Vue from 'vue';
import { delay, call, put } from '../../../dist/vuex-saga.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state, payload) {
      state.count += payload
    }
  },
  actions: {
    *test(store, payload) {
      let a = yield call(delay,1000)
      yield put("increment", 2)

      yield call(delay,700)
      yield put("increment", 10)

      return "Sesuatu"
    }
  }
})

export default store
