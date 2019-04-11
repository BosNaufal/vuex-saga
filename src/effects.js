
function destructuring(args) {
  let func = args[0]
  args = Array.prototype.slice.call(args,1,args.length)

  if(typeof(func) !== 'function') throw new Error("[Vue Saga]: First Argument Should Be a Function")

  return { args, func }
}

function wrapIt(method, func, args) {
  return {
    wrapped: true,
    method,
    func,
    args
  }
};

export function call()  {
  let { func, args } = destructuring(arguments)
  return wrapIt("CALL", func, args)
};

export function delay(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

function GetterFunction(selector, ...rest) {
  if (typeof this.getters[selector] === 'function') {
    return this.getters[selector].apply(this, rest)
  }
  return this.getters[selector]
}

export function select(selector, ...rest) {
  return wrapIt("SELECT", GetterFunction, [selector, ...rest])
}

function FakeFunction () {}

export function put()  {
  let args = arguments
  let mutation = args[0]
  let payload = args[1]

  return wrapIt("PUT", FakeFunction, [mutation, payload])
};



export default call;
