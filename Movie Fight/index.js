const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '':movie.Poster;
        
        return `
        <img src="${imgSrc}"/>
        ${movie.Title} (${movie.Year})
        `;
    },

    inputValue(movie){
        return movie.Title
    },

    async fetchData(searchTerm) {
        const response = await axios.get("http://www.omdbapi.com/",{
            params:{
                apikey:'aa580508',
                s: searchTerm
            }
        });
        
        if (response.data.Error){
            return [];
        }
    
        return response.data.Search;
    }


}

createAutoComplete({
    ...autoCompleteConfig,
    root : document.querySelector('#left-autocomplete'),
    
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    }
});


createAutoComplete({
    ...autoCompleteConfig,
    root : document.querySelector('#right-autocomplete'),
    
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }
});

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summary, side) => {
    const response = await axios.get("http://www.omdbapi.com/",{
        params:{
            apikey:'aa580508',
            i: movie.imdbID
        }
    });

    summary.innerHTML = movieTemplate(response.data);

    if (side === 'left') leftMovie = response.data;
    else rightMovie = response.data;

    if (leftMovie && rightMovie){
        runComparison();
    }

}

const runComparison = () =>{
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) =>{
        const rightStat = rightSideStats[index];

        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);

        if (isNaN(leftSideValue)) leftSideValue = 0;
        if (isNaN(rightSideValue)) rightSideValue = 0;

        if (leftSideValue > rightSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else if (leftSideValue < rightSideValue){
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    })


}


const movieTemplate = (movieDetail) =>{
    const dollars = parseInt(
        movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g, '')
    );
    
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(
        movieDetail.imdbVotes.replace(/,/g,'')
    );
    
    const awards = movieDetail.Awards.split(' ').reduce((accumulator, currWord) =>{
        const value = parseInt(currWord)
        
        if (isNaN(value)){
            return accumulator;
        } else {
            return accumulator + value;
        }
    }, 0);


    return `
        <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetail.Poster}" alt="Movie Poster">
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <h1>${movieDetail.Title}</h1>
                <h4>${movieDetail.Genre}</h4>
                <h6>
                <span class="tag is-primary is-light is-medium">${movieDetail.Year}</span>
                    <span class="tag is-link is-light is-medium">${movieDetail.Country.split(',')[0]}</span> 
                    <span class="tag is-danger is-light is-medium">${movieDetail.Rated}</span>
                </h6>
                <p>${movieDetail.Plot}</p>
            </div>
        </div>
        </article>
        <article data-value=${awards} class='notification is-primary'>
            <p class='title'>${movieDetail.Awards}</p>
            <p class='subtitle'>Awards</p>
        </article>
        <article data-value=${dollars} class='notification is-primary'>
            <p class='title'>${movieDetail.BoxOffice}</p>
            <p class='subtitle'>Box Office</p>
        </article>
        <article data-value=${metascore} class='notification is-primary'>
            <p class='title'>${movieDetail.Metascore}</p>
            <p class='subtitle'>Metascore</p>
        </article>
        <article data-value=${imdbRating} class='notification is-primary'>
            <p class='title'>${movieDetail.imdbRating}</p>
            <p class='subtitle'>IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class='notification is-primary'>
            <p class='title'>${movieDetail.imdbVotes}</p>
            <p class='subtitle'>IMDB Votes</p>
        </article>
    `
};