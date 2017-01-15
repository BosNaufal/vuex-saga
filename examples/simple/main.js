import 'babel-polyfill'
import Vue from 'vue';
import App from './components/app.vue';
import VuexSaga from '../../dist/vuex-saga.js'

Vue.config.debug = true
Vue.config.devtools = true

Vue.use(VuexSaga)

new Vue(Vue.util.extend(App)).$mount('app')
