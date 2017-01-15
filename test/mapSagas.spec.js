
import assert from 'assert'
import chai, { expect } from 'chai';

import { mapSagas } from '../dist/vuex-saga.js';

describe('mapSagas()', () => {

  it('Should return object', function () {

    let actual = mapSagas({
      foo: "bar"
    })
    expect(actual).to.be.an('object')

  });


});
