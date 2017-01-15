import 'babel-polyfill'
import assert from 'assert'
import chai, { expect } from 'chai';

import { call, put } from '../dist/vuex-saga.js';

describe('Main Effect', () => {

  it('Should Accept The Generator Function', function () {
    function *genFunc () { }
    let actual = call(genFunc)
    expect(actual).to.be.an('object')
  });


  it('Should return a object', function () {
    let actual = call(() => {})
    expect(actual).to.be.an('object')
  });


  it('Method Object Should Be "CALL"', function () {
    let actual = call(() => {})
    expect(actual.method).to.be.equal('CALL')
  });


  it('Arguments Should Passed To The Its Function', function () {
    let actual = call(() => {}, "a")

    expect(actual.args).to.be.an('array')
    expect(actual.args[0]).to.be.equal("a")
  });


  it('Should Deep Equal', function () {
    let delay = (time) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(true)
          return true
        }, time)
      })
    }
    function *genFunc () {
      let respon = yield call(delay, 1000)
      yield put("Something", respon)
    }

    let iter = genFunc()

    let fakeRespon = {}
    let expectedCall = call(delay, 1000)
    let expectedPut = put("Something", fakeRespon)

    assert.deepEqual(iter.next().value, expectedCall)
    assert.deepEqual(iter.next(fakeRespon).value, expectedPut)
    // console.log(iter.next().value,expectedPut);
  });

  it('Should Deep Equal When Parallel Too', function () {
    let delay = (time) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(true)
        }, time)
      })
    }
    let delay2 = (time) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(false)
        }, time)
      })
    }
    function *genFunc () {
      yield [call(delay, 1000), call(delay2,2000)]
    }

    let iter = genFunc()

    let expected = [call(delay, 1000), call(delay2,2000)]
    assert.deepEqual(iter.next().value, expected)
  });




});
