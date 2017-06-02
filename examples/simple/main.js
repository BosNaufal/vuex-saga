import 'babel-polyfill';
import Vue from 'vue';
import App from './components/app.vue';
import VuexSaga from '../../dist/vuex-saga.js';
import store from './vuex/index';

Vue.config.debug = true
Vue.config.devtools = true

Vue.use(VuexSaga, { store: store })

new Vue(Vue.util.extend(App)).$mount('app')
