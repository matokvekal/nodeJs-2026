//const assert = require('chai').assert;
import { assert } from 'chai';

async function asyncFunction() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('resolved');
        }, 500);
    });
}

describe('Async Test with Async/Await', function() {
    it('tests a function using async/await', async function() {
        const result = await asyncFunction();
        assert.equal(result, 'resolved');
    });
});
