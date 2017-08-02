/* eslint-env mocha */
const { invertPromise } = require('../src/index');
const util = require('util');
const sinon = require('sinon');
const { expect, use } = require('chai');
const sinonChai = require('sinon-chai');

use(sinonChai);

describe('invertPromise', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(util, 'inspect');
  });

  afterEach(() => {
    sandbox.restore();
  });

  async function catchResolve(result) {
    let caughtError = null;

    try {
      await invertPromise(Promise.resolve(result));
    } catch (error) {
      caughtError = error;
    }

    return caughtError;
  }

  it('rejects on a result with an error with inspect', async () => {
    util.inspect.returns('{ hello: \'world\' }');

    const error = await catchResolve({ hello: 'world' });

    expect(util.inspect).to.have.been.calledWithMatch({ hello: 'world' }, { depth: 2 });
    expect(error.message).to.match(/^Expected rejection received: \{ hello: 'world' \}/);
  });

  it('attaches the result to .result', async () => {
    const result = { hello: 'world' };
    const error = await catchResolve(result);

    expect(error.result).to.equal(result);
    expect(error.result).to.deep.equal(result);
  });

  it('resolves errors', async () => {
    const error = new Error('failed to execute');

    const result = await invertPromise(Promise.reject(error));

    expect(error).to.equal(result);
  });
});
