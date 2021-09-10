const assert = require('assert');
const {forEach} = require('../index');

let numbers;
beforeEach(() =>{
    numbers = [1, 2, 3];
})

it('should sum an array', () =>{
    let total = 0;

    forEach(numbers, (ele) =>{
        total += ele;
    })

    assert.strictEqual(total, 6);

})