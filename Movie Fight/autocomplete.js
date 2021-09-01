const createAutoComplete = ({
    root, 
    renderOption, 
    onOptionSelect, 
    inputValue, 
    fetchData    
}) =>{

    root.innerHTML = `
        <label><b>Search for a Movie</b><label>
        <input class="input" />
        <div class='dropdown'>
            <div class='dropdown-menu'>
                <div class='dropdown-content results'></div>
            </div>
        </div>
    `;

    const input = root.querySelector('input')
    const dropdown = root.querySelector('.dropdown')
    const resultsWrapper = root.querySelector('.results')

    const onInput = async (event)=>{
        const items = await fetchData(event.target.value);

        if (!items.length){
            dropdown.classList.remove('is-active');
            return
        }

        resultsWrapper.innerHTML = '';
        dropdown.classList.add('is-active');

        for (let item of items){
            const option = document.createElement('a');
            
            option.classList.add('dropdown-item');

            option.innerHTML = renderOption(item);

            option.addEventListener('click', () =>{
                input.value = inputValue(item);
                dropdown.classList.remove('is-active');
                onOptionSelect(item);
            });

            resultsWrapper.append(option);
        }
    }

    // debounce; when there is no input in 0.5s. run onInput
    input.addEventListener('input', debounce(onInput, 500))

    // when click out of the dropdown, close the menu
    document.querySelector('click', (event) =>{
        if (!root.contains(event.target)){
            dropdown.classList.remove('is-active');
        }
    });


};