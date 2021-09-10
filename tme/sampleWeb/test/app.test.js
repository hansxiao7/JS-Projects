const assert = require('assert');
const render = require('../../render');

it('has a text input', async () =>{
    const dom = await render('index.html');

    const input = dom.window.document.querySelector('input');

    assert(input);
})


it('Shows a success message', async () =>{
    const dom = await render('index.html');
    
    const input = dom.window.document.querySelector('input');
    input.value = 'asdfaf@fadf.com'

    const form = dom.window.document.querySelector('form');
    form.dispatchEvent(new dom.window.Event('submit'));

    const h1 = dom.window.document.querySelector('h1');

    assert.strictEqual(h1.innerHTML, 'Looks good!');
})