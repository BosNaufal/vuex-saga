// Please Remove The Console.log comment when you want to test. And Run manual test in the browser since I have no Idea to make automatic testing for this method :(

// Limitation
// - Can't run parallel generator function

import 'babel-polyfill'
import assert from 'assert'
import chai, { expect } from 'chai';

import { sagaRun, call } from '../dist/vuex-saga.js';

describe('sagaRun()', () => {

    let delay = (time) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("sesuatu")
        }, time)
      })
    }

    let delay2 = (time) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("paralel")
        }, time)
      })
    }


    it('Should Can Be Runned Async', function () {
      function *genFunc (store) {
        let a = yield [call(delay, 100), call(delay2, 1000)]
        // console.log('pertama', a);
        let b = yield call(delay, 1000)
        // console.log('kedua', b);
      }

      sagaRun(genFunc)

    });


    it('Should Can Run Normal Generator Function', function () {
      function *foo(store) {
        let a = yield 1;
        // console.log(a);
        let b = yield 2;
        // console.log(b);
        let c = yield 3;
        // console.log(c);
      }

      function *bar(store) {
        // console.log("=============");
        var y = yield 1;
        // console.log(y);
        var z = yield 2;
        // console.log(z);
      }

      sagaRun(foo)
      sagaRun(bar)
    });


    it('Should Can Run Nested Generator Function', function () {
      function ordinary () {
        // console.log('hai');
        return "halo"
      }

      function *foo(store) {
        let a = yield "aaaa";
        // console.log(a);
        let b = yield 2;
        // console.log(b);
        let c = yield "String 3";
        // console.log(c);
        let d = yield 4;
        // console.log(d);
        return 123
      }

      function *bar(store) {
        // console.log("=============");
        // var y = yield call(foo);
        // console.log("Nice", y);
        // var x = yield "almost";
        // console.log(x);
        // var b = yield [call(delay), call(delay2)];
        // console.log("Lagi", b);
        var b = yield [call(ordinary), call(delay2)];
        var a = yield call(foo)
        // console.log("Lagi", b, a);
        // var a = yield call(foo);
        // console.log("Lagi", a);
        // var z = yield "bawah";
        // console.log(z);
      }

      sagaRun(bar)
    });


});
