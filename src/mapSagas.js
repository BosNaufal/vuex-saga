
export default function mapSagas(obj) {
  let keys = Object.keys(obj)
  let methods = {}
  keys.forEach((key) => {
    methods[key] = function (payload) {
      return this.$run(obj[key], payload)
    }
  });
  return methods
};
