// Variables for current HTML elements
const form = document.getElementById('form');
const stateDropdown = document.getElementById('state-dropdown');
const taxonSearch = document.getElementById('taxon-search');
const row = document.querySelector('div.row');
const containerDiv = row.parentElement;

form.addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();
    row.innerHTML = '';

    insertLoadingGIF();
    fetchAPI();

    form.reset();
}

function insertLoadingGIF() {
    const loadingGIF = document.createElement('img');
    loadingGIF.src = './src/images/loading.gif';
    loadingGIF.id = 'loading-gif';
    return containerDiv.appendChild(loadingGIF);
}

function removeLoadingGIF() {
    return containerDiv.lastChild.remove();
}

function fetchAPI() {
    const stateSelected = stateDropdown.value;
    const taxonInputted = taxonSearch.value;

    return fetch(`https://api.inaturalist.org/v1/observations?order=desc&order_by=observed_on&hrank=species&per_page=12&place_id=${stateSelected}&taxon_id=47224&taxon_name=${taxonInputted}`)
    .then(response => response.json())
    .then(data => {
        
        removeLoadingGIF();

        if (data.total_results === 0) {
            console.log("Oops! The search term you entered did not turn up any butterflies. Please try searching for another butterfly.");
            const errorPara = document.createElement('p');
            errorPara.innerText = "Oops! The search term you entered did not turn up any butterflies. Please try searching for another butterfly.";
            row.appendChild(errorPara);
        } else {
            data.results.map(taxon => createTaxon(taxon))
        }
    })
    .catch(error => {
        console.log(error);
    })
}

function createTaxon(taxon) {
    // Variables needed for new HTML elements
    const cardBox = document.createElement('div');
    const card = document.createElement('section');
    const img = document.createElement('img');
    const cardBody = document.createElement('article');
    const cardText = document.createElement('p');
    const cardSubBody = document.createElement('div');
    const button = document.createElement('button');
    const smallText = document.createElement('small');

    // Set classes and innerText for new HTML elements
    cardBox.classList.add('card-box', 'col-md-4');
    card.classList.add('card', 'mb-4', 'box-shadow');
    img.className = 'card-img-top';
    cardBody.className = 'card-body';
    cardText.className = 'card-text';
    cardSubBody.className = 'card-sub-body';
    button.classList.add('btn', 'btn-sm', 'btn-outline-secondary');
    button.innerText = 'More Info';
    smallText.className = 'text-muted';

    // Add observation date, append button and date to sub-body
    smallText.innerText = taxon.observed_on;
    cardSubBody.appendChild(button);
    cardSubBody.appendChild(smallText);

    // Add info to cardText p, append cardText and card sub-body to main card body
    cardText.innerHTML = `${taxon.taxon.preferred_common_name} (<i>${taxon.taxon.name}</i>)<br>${taxon.place_guess}`;
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardSubBody);

    // Convert square img returned from fetch request to larger size
    // Info about replace()
    // https://www.freecodecamp.org/news/javascript-regex-match-example-how-to-use-the-js-replace-method-on-a-string/
    const squareImg = taxon.photos[0].url;
    const largeImg = squareImg.replace('square', 'large');

    // Add img source to img element, append img and card body to card itself
    img.src = largeImg;
    card.appendChild(img);
    card.appendChild(cardBody);

    // Append card to card box
    cardBox.appendChild(card);

    // Append card box to container div
    row.appendChild(cardBox);
}