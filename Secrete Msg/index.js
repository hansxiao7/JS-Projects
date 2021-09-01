const {hash} = window.location;

const msg = atob(hash.replace('#',''));

if (msg){
    document.querySelector('#msg-form').classList.add('hide');
    document.querySelector('#msg-show').classList.remove('hide');
    document.querySelector('h1').innerText = msg;
}


document.querySelector('form').addEventListener('submit', (event) =>{
    event.preventDefault();

    const input = document.querySelector('#msg-input');
    const msgForm = document.querySelector('#msg-form');
    msgForm.classList.add('hide');
    
    const linkForm = document.querySelector('#link-form');
    linkForm.classList.remove('hide');
    // ascii to base64 encoding
    // btoa: ascii to base64
    // atob: base64 to ascii
    const encrypyted = btoa(input.value);
    const linkInput = document.querySelector('#link-input');
    linkInput.value = `${window.location}#${encrypyted}`;
    linkInput.select();
})
