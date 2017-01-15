# Vuex Saga

Better Vuex Action To Simplify Your Async Flow Process And Code Testing. It's inspired by  [redux-saga](https://github.com/redux-saga/redux-saga) but it works differently. Vuex Saga just simplify the action for async and testing while redux-saga is being advance async flow control which can make some watchers.

[DEMO](https://rawgit.com/BosNaufal/vuex-saga/master/index.html)

## Installation
You can import [vuex-saga.js](./dist/vuex-saga.js) to your vue component file like [this](./examples/simple/main.js) and process it with your preprocessor.

You can install it via NPM
```bash
npm install vuex-saga
```

## Dependencies
You need to install babel-polyfill and babel regenerator plugin and put it in the first line of your main entry file to make it works. You can check the example [here](./examples/simple/main.js).
```bash
npm install babel-polyfill babel-plugin-transform-regenerator
```

And Don't forget to add the plugin to your [```.babelrc```](./.babelrc)
```json
{
  "plugins": ["transform-regenerator"]
}
```

And Install it as a [Vue Plugin](https://vuejs.org/v2/guide/plugins.html#Using-a-Plugin) like this.
```javascript
import Vue from 'vue';
import VuexSaga from 'vuex-saga';

// Install it
Vue.use(VuexSaga)
```


## Why I Need This?
Probably you don't need it. But in some cases you'll find a busy async process that you'll hard to organize with ordinary Promise function. For example:

```javascript
import api from '../api'

api.fetchProduct()
.then((product) => {
  return api.fetchSeller(product.id)
  .then((seller) => {
    return api.statistic(product, seller)
    .then((statistic) => {
      return api.needStatisticProductAndSeller(statstic, product, seller)
    })
  })
})
.then((res) => {
  // Once your code bigger
  // you'll lost your path...
})
```

The solution is pretty simple, You can use [async/await](https://ponyfoo.com/articles/understanding-javascript-async-await) but I just heard that it will ready very soon. So, we can't use it natively for now. And another point that you should notice is "How can you test it Effortlessly?".


## How About Vuex Saga?
According to our cases above, we can simplify that code with [```Gernerator Function```](). It will make our async code looks like synchronous code. Take a look:
```javascript
import api from '../api'

function *fetchFlow() {
  let product = yield call(api.fetchProduct)
  let seller = yield call(api.fetchSeller, { product })
  let statistic = yield call(api.statistic, { product, seller })
  let lastFetch = yield call(api.needStatisticProductAndSeller, { statistic, product, seller })
  return lastFetch
}
```

Pretty simple right? It works like async/await function. But You'll get a better testing process although your testing a deep promise function. Take a peek:
```javascript
import { call } from 'vuex-saga'
import api from '../api'
import { fetchFlow } from '../actions';
import assert from 'assert';

describe('fetchFlow()', function () {

  it('Should Run The Flow Correctly ', function () {
    let process = fetchFlow()

    let fakeRespon = {}

    assert.deepEqual(process.next().value, call(api.fetchProduct))
    assert.deepEqual(process.next(fakeRespon).value, call(api.fetchSeller, { fakeRespon }))
    assert.deepEqual(process.next(fakeRespon).value, call(api.statistic, { fakeRespon }))
    assert.deepEqual(process.next(fakeRespon).value, call(api.needStatisticProductAndSeller, { fakeRespon }))
  });

});
```

Wait? Are you sure it's a valid testing process? I'm not sure yet. But It works. You don't need to mock the promises, You don't need run the real fetch function in the browser, It just works. Let me tell you how ```call()``` function works.

```call()``` function is just an ordinary function that return a plain object contains our real function. So, the generator only pass the **plain object** while the runner excute the function from the object. Since we don't use the runner, we can test our code like the example above, Just need to deep compare two object.


## How About Nested Sagas?
It's just the same, you can wrap it with ```call()``` function.
```javascript
import { call } from 'vuex-saga'
import api from '../api'

function *nestedGenFunc() {
  yield call(delay, 1000)
  return 1000
}

function *fetchFlow() {
  let nested = yield call(nestedGenFunc)
}
```


## Is it take care some parallel async process?
Yes, it should. Just wrap it within an array! Check it out.

```javascript
import { call } from 'vuex-saga'
import api from '../api'

function *fetchFlow() {
  let [product, other] = yield [call(api.fetchProduct), call(api.otherApis)]
}
```

The limitation is, you can't run nested generator function in parallel but you can still run some promises or ordinary function (to fetch data or something) in parallel.


## How to bind the saga (generator function) to run?
Vuex Saga has a method named ```sagaRun()``` which will bind the saga to run. You simple import it, but the recommended way is bind it from the component. We have a helper methods to do it.

```html
<template>
  <div>
    <h1>Hello World</h1>
  </div>
</template>

<script>

  export default {

    created() {
      this.$run("nameOfSaga", { argument })
      .then((res) => {
        // when saga has finished
      })
    }

  }

</script>
```

The ```$run``` method is similiar with  ```store.dispatch``` method. But it can run the generator function. At the last, it will pass a returned value from the generator function (saga). Do you think it's not comfortable to write? we also have ```mapSagas()``` method that will mapping our sagas to the local methods just like the ```Vuex.mapActions()``` do.

```html
<template>
  <div>
    <h1>Hello World</h1>
  </div>
</template>

<script>

  import { mapSagas } from 'vuex-saga';

  export default {

    methods: {
      ...mapSagas({
        test: "nameOfSaga"
      })
    },

    created() {
      this.test({ argument })
      .then((res) => {
        // when saga has finished
      })
    }

  }

</script>
```


## How if I want to change the state? Should I use ```store.commit()```?
You can still use ```store.commit()``` but it will hard to test. Instead, we have a helper method called ```put()``` function. It's just the same with ```call()``` function but it's used to run some mutation.

```javascript
import Vuex from 'vuex'
import Vue from 'vue';
import { call, put, delay } from 'vuex-saga'

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
    *incrementAsync(store, payload) {
      yield call(delay,1000)
      yield put("increment", 2)

      yield call(delay,700)
      yield put("increment", 10)
      return store.count
    }
  }
})

export default store
```

How do I test it? Just the same way with the ```call()``` testing.

```javascript

import { call, put, delay } from 'vuex-saga'
import api from '../api'
import { incrementAsync } from '../actions';
import assert from 'assert';

describe('incrementAsync()', function () {
  it('Should Run The Flow Correctly ', function () {
    let process = incrementAsync()

    assert.deepEqual(process.next().value, call(delay,1000))
    assert.deepEqual(process.next().value, put("increment", 2))
    assert.deepEqual(process.next().value, call(delay,700))
    assert.deepEqual(process.next().value, put("increment", 10))
  });

});
```

So now, you can test the flow and the fetch process separately. It will make your code easy to test. No more reason to not doing a test.

## Limitation
There's a limitation. But it wil not make us harder to write. The limitation is, We Can't run nested generator function in parallel

```javascript
import api from '../api'

function *nestedGenFunc() {
  yield call(delay, 1000)
  return 1000
}

function *fetchFlow() {
  let [a, b] = yield [call(nestedGenFunc), call(nestedGenFunc)] // Will throw error

  // Instead, it will be run
  let [product, other] = yield [call(api.fetch), call(api.fetcOther)]
  let a = yield call(nestedGenFunc) // It will run too
  let b = yield call(nestedGenFunc) // it will run too
}
```


## API
| Method | Format | Deskripsi |
| :--- | :--- | :--- |
| ```*saga()``` | passed arguments ```*saga(store, payload)``` | It's not a method form ```vuex-saga```. I just want you to know how the saga looks like. It recieve a ```store``` object and ```payload``` object. We can use it for logic bussiness within our saga. We should notice the (```*```) star symbol in the function name. It indicate that our function is a generator function |
| ```delay()``` | ```delay(number)``` | It's just a simple method to delay some function inside the saga. Maybe, It will not used cause I made it just for making a fake async proccess |
| ```call()``` | ```call(func, obj)``` | It's used to call some function. For best practice you should wrap your function to be a promise. The second arguments is single object—cause vuex action has only one argument for data payload—which will passed to the our sagas, You can access it from the saga. |
| ```put()``` | ```put(string, obj)``` | It's Used to bind some vuex mutation. The behaviour is same with ```store.commit()``` method. The first Argument is the mutation name, and the second is the data payload which will be passed to the mutation |
| ```vm.$run()``` | ```vm.$run(string, obj)``` | It's a method to run the sagas. the behaviour is similiar with ```store.dispatch()``` method. The first argument is action name, and the second argument is data payload. This method only run in the component instance. It always return a promise in the end of saga process |
| ```mapSagas()``` | ```mapSagas(obj)``` | It's a method to mapping the sagas to be a local methods of component. the behaviour is similiar with ```Vuex.mapActions()``` method. It will return an object. You can check the example above about how to use it or you can check the ```Vuex.mapAction()``` method documentation |

## Credits
- [Redux Saga](redux-saga.github.io/redux-saga/)
- [gen-run](https://github.com/creationix/gen-run)
- [http://www.2ality.com/2015/03/es6-generators.html](http://www.2ality.com/2015/03/es6-generators.html)
- [https://davidwalsh.name/es6-generators](https://davidwalsh.name/es6-generators)
- [http://thejsguy.com/2016/10/15/a-practical-introduction-to-es6-generator-functions.html](http://thejsguy.com/2016/10/15/a-practical-introduction-to-es6-generator-functions.html)
- [http://www.2ality.com/2015/03/no-promises.html](http://www.2ality.com/2015/03/no-promises.html)


## Thank You for Making this useful~


## Let's talk about some projects with me
Just Contact Me At:
- Email: [bosnaufalemail@gmail.com](mailto:bosnaufalemail@gmail.com)
- Skype Id: bosnaufal254
- twitter: [@BosNaufal](https://twitter.com/BosNaufal)


## License
[MIT](http://opensource.org/licenses/MIT)
Copyright (c) 2016 - forever Naufal Rabbani
