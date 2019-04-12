import 'babel-polyfill'
import assert from 'assert'
import chai, { expect } from 'chai';

import { call, put, select } from '../dist/vuex-saga.js';

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

  it('Select Effect Should Have Method "SELECT"', function () {
    let actual = select('testSelector')
    expect(actual.method).to.be.equal('SELECT')
  });

  it('Arguments Should Be Passed To Selector Function', function () {
    let actual = select('testSelector', 123, 567)
    expect(actual.args.length).to.be.equal(3)
    expect(actual.args[0]).to.be.equal('testSelector')
    expect(actual.args[1]).to.be.equal(123)
    expect(actual.args[2]).to.be.equal(567)
  });

  it('Select Should Call Getter Function With Passed Arguments', function () {
    const mockStore = {
      getters: {
        testSelector: (a, b) => [a, b]
      }
    }
    let actual = select('testSelector', 123, 567)
    const res = actual.func.apply(mockStore, actual.args);
    expect(res.length).to.be.equal(2)
    expect(res[0]).to.be.equal(123)
    expect(res[1]).to.be.equal(567)
  });

  it('Select Should Call Root Getter Function If Not Found From Getters', function () {
    const mockStore = {
      getters: {},
      rootGetters: {
        testSelector: (a, b) => [a, b]
      }
    }
    let actual = select('testSelector', 123, 567)
    const res = actual.func.apply(mockStore, actual.args);
    expect(res.length).to.be.equal(2)
    expect(res[0]).to.be.equal(123)
    expect(res[1]).to.be.equal(567)
  });

  it('Select Should Return Getter Value If Getter Is Not A Function', function () {
    const mockStore = {
      getters: {
        testSelector: 'abcd'
      },
      rootGetters: {}
    }
    let actual = select('testSelector')
    const res = actual.func.apply(mockStore, actual.args);
    expect(res).to.be.equal('abcd')
  });

  it('Select Should Return Value From State If Selector Doesnt Seem To Be A Getter', function () {
    const mockStore = {
      getters: {},
      rootGetters: {},
      state: {},
      rootState: {
        testModule: {
          testField: 123
        }
      }
    }
    let actual = select('testModule.testField')
    const res = actual.func.apply(mockStore, actual.args);
    expect(res).to.be.equal(123)
  });

  it('Select Should Prefer State Over RootState If Selector Doesnt Seem To Be A Getter', function () {
    const mockStore = {
      getters: {},
      rootGetters: {},
      state: {
        testModule: {
          testField: 'abcd'
        }
      },
      rootState: {
        testModule: {
          testField: 123
        }
      }
    }
    let actual = select('testModule.testField')
    const res = actual.func.apply(mockStore, actual.args);
    expect(res).to.be.equal('abcd')
  });

  it('Select Should Return Undefined If Selector Is Not Found', function () {
    const mockStore = {
      getters: {},
      rootGetters: {},
      state: {},
      rootState: {}
    }
    let actual = select('testModule.testField.aa.bb.cc')
    const res = actual.func.apply(mockStore, actual.args);
    expect(res).to.be.equal(undefined)
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
