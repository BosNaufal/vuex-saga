
function isGenFunc (func) {
  return typeof(func.prototype.next) === "function"
}

export default function sagaRun(genFunc, store = {}) {
  return new Promise((resolve, reject) => {

    let iter = typeof(genFunc) === "function" ? genFunc(store) : genFunc

    function runNext(iter, respon = null) {
      let nextRun = iter.next(respon)
      let data = nextRun.value
      let isDone = nextRun.done

      if(!isDone) {
        if (!data) throw new Error('[Vuex Saga]: Please wrap the function next to yield statement inside the effects e.g. "call" or "put"')
        let isOrdinaryGenFunc  = data.func
        let isArrayGenFunc  = typeof(data) === 'object' && data.length !== 0

        let runSingleIter = (data, done, single = true) => {
          let { func, args } = data
          if(typeof(func) === 'function') {

            if(data.method === "PUT") {
              let [mutation, payload] = data.args
              store.commit(mutation, payload)
              if(single) return runNext(iter)
              return done ? done() : false
            }

            if(data.method === "CALL") {
              let notReturnAnything = func.apply(func, args) === undefined
              if (notReturnAnything) {
                if(single) return runNext(iter)
                else return done ? done() : false
              }

              let isPromise = func.apply(func, args).then !== undefined

              if(isPromise) {
                return func.apply(func, args)
                .then((res) => {
                  if(single) return runNext(iter, res)
                  return done ? done(res) : false
                })
              }

              else if(isGenFunc(func)) {
                if(single) {
                  return sagaRun(func, store, (res) => {
                    return runNext(iter, res)
                  })
                }
                else throw new Error("[Vue Saga]: Can't run parallel generator function at once. But you can still run parallel ordinary function")
              }

              else {
                if(single) return runNext(iter)
                else return done ? done() : false
              }

            }

          }
        }

        let runArrayIter = (data) => {
          let arrayIter = data
          let doneCount = 0
          let allResponse = []
          for(let data of arrayIter) {
            runSingleIter(data, (res) => {
              allResponse.push(res)
              doneCount++
              let isDone = allResponse.length === arrayIter.length
              if(isDone) return runNext(iter, allResponse)
            }, false)
          }

        }

        if(isOrdinaryGenFunc) return runSingleIter(data)
        else if(isArrayGenFunc) return runArrayIter(data)
        else return runNext(iter, data)
      }

      else resolve(nextRun.value)
    }

    return runNext(iter)
  })
};
