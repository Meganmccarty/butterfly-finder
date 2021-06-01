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
    console.log(taxon);
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
    const date = taxon.observed_on;
    const stringDate = taxon.observed_on_string.split(' ');
    let correctDateFormat = '';
    
    if (convertTimeFormat(stringDate)) {
        correctDateFormat = `${date} ` + convertTimeFormat(stringDate);
    } else {
        correctDateFormat = date;
    }
    
    console.log(stringDate);
    console.log(convertTimeFormat(stringDate));
    console.log(correctDateFormat);

    smallText.innerText = moment(correctDateFormat).fromNow();
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

    // Add event listener to More Info button
    button.addEventListener('click', function showMoreInfo() {
        const lightbox = document.getElementById('lightbox');
        const closeButton = document.getElementById('close');
        const lightboxContent = document.getElementById('lightbox-content');
    
        const lightboxImg = document.createElement('img');
        const lightboxPara = document.createElement('p');
        
        lightbox.style.display = 'flex';
        lightboxImg.src = largeImg;
        lightboxPara.innerHTML = cardText.innerHTML + `
            <br> Photo and observation © 
            <a target="_blank" href="https://www.inaturalist.org/people/${taxon.user.login}">${taxon.user.login}</a>, 
            who has observed ${taxon.user.observations_count} different organisms!
        `;
        if (taxon.taxon.wikipedia_url) {
            lightboxPara.innerHTML += `
                <br>
                <a target="_blank" href=${taxon.taxon.wikipedia_url}><button class="btn btn-primary">Wikipedia</button></a>
            `
        }
    
        lightboxContent.appendChild(lightboxImg);
        lightboxContent.appendChild(lightboxPara);

        closeButton.addEventListener('click', function hideMoreInfo() {
            lightboxContent.innerHTML = '';
            lightbox.style.display = 'none';
        })
    });

    // Add img source to img element, append img and card body to card itself
    img.src = largeImg;
    card.appendChild(img);
    card.appendChild(cardBody);

    // Append card to card box
    cardBox.appendChild(card);

    // Append card box to container div
    return row.appendChild(cardBox);
}

// This function is specifically written to prevent a deprecation warning from occurring when using moment.js
// Because iNaturalist is loose about the date formats it uses (it uses many!), the date must be converted to a
// format accepted by moment.js before being passed into moment.js as an argument

function convertTimeFormat(stringDate) {
    let time = '';
    
    if (stringDate.length >= 7) {
        time = stringDate[4]
    } else if (stringDate.length >= 3) {
        time = stringDate[1];
        const pmOrAm = stringDate[2];
        const firstTimeElement = parseInt(time[0]);
        const secondTimeElement = parseInt(time[1]);

        if (pmOrAm === 'PM' && firstTimeElement !== 1 && secondTimeElement !== 2) {
            time = firstTimeElement + 12 + time.substring(1);
        } else if (pmOrAm === 'AM' && firstTimeElement === 1 && secondTimeElement === 2) {
            firstTimeElement = 0;
            secondTimeElement = 0;
            time = firstTimeElement + secondTimeElement + time.substring(1);   
        }
        
    } else if (stringDate.length > 1) {
        time = stringDate[1];
    } else {
        time = '';
    }

    return time;
}