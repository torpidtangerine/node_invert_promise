const util = require('util');

function invertPromise(promise) {
  return promise
    .then((result) => {
      const resultInspect = util.inspect(result, { depth: 2 });
      const error = new Error(`Expected rejection received: ${resultInspect}`);
      error.result = result;

      return Promise.reject(error);
    }, error => error);
}

module.exports = { invertPromise };
