// Const variables for form, results, and page buttons
const form = document.getElementById('form');
const resultsContainer = document.querySelector('div.row');
const pageButtons = document.getElementById('page-buttons');

// Variables for input values and page number
let stateSelected = '';
let taxonSearched = '';
let pageNumber = 1;

form.addEventListener('submit', submitForm);

// Form function clears page, grabs input values, invokes fetch, and then resets
function submitForm(e) {
    e.preventDefault();

    resultsContainer.innerHTML = '';
    pageButtons.innerHTML = '';
    stateSelected = document.getElementById('state-dropdown').value;
    taxonSearched = document.getElementById('taxon-search').value;
    pageNumber = 1;

    fetchAPI();
    form.reset();

    return stateSelected, taxonSearched;
}

// Fetch function invokes loading GIF, fetches data, and passes it to displayResults function
function fetchAPI() {
    insertLoadingGIF();

    return fetch(`https://api.inaturalist.org/v1/observations?photos=true&verifiable=true&geoprivacy=open&order=desc&order_by=observed_on&hrank=species&page=${pageNumber}&per_page=15&place_id=${stateSelected}&taxon_id=47224&taxon_name=${taxonSearched}`)
    .then(response => response.json())
    .then(data => displayResults(data))
    .catch(error => {
        console.log(error);
    })
}

// Display function removes GIF, displays results, invokes page button function, and passes data to createTaxon()
function displayResults(data) {
    removeLoadingGIF();

    if (data.total_results === 0) {
        const errorPara = document.createElement('p');
        errorPara.innerText = "Oops! The search term you entered did not turn up any butterflies. Please try searching for another butterfly.";
        return resultsContainer.appendChild(errorPara);
    } else if (data.total_results >= 15) {
        renderPageButtons(pageNumber);
        return data.results.map(taxon => createTaxon(taxon));
    } else {
        return data.results.map(taxon => createTaxon(taxon));
    }
}

// Functions for inserting and removing loading GIF
function insertLoadingGIF() {
    const loadingGIF = document.createElement('img');
    loadingGIF.src = './src/images/loading.gif';
    loadingGIF.id = 'loading-gif';
    return resultsContainer.parentElement.appendChild(loadingGIF);
}

function removeLoadingGIF() {
    return resultsContainer.parentElement.lastChild.remove();
}

// Function for rendering correct page button(s) depending on current page number
function renderPageButtons(pageNumber) {
    if (pageNumber >= 2) {
        const previousButton = document.createElement('button');
        previousButton.innerText = 'Previous';
        previousButton.classList.add('btn', 'btn-primary');
        previousButton.addEventListener('click', goBackward);

        const nextButton = document.createElement('button');
        nextButton.innerText = 'Next'
        nextButton.classList.add('btn', 'btn-primary');
        nextButton.addEventListener('click', goForward);

        return pageButtons.append(previousButton, nextButton);

    } else if (pageNumber === 1) {
        const nextButton = document.createElement('button');
        nextButton.innerText = 'Next'
        nextButton.classList.add('btn', 'btn-primary');
        nextButton.addEventListener('click', goForward);

        return pageButtons.append(nextButton);
    }
}

// Functions for viewing next/previous page
function goForward() {
    pageNumber++;
    resultsContainer.innerHTML = '';
    pageButtons.innerHTML = '';
    return fetchAPI();
}

function goBackward() {
    pageNumber--;
    resultsContainer.innerHTML = '';
    pageButtons.innerHTML = '';
    return fetchAPI();
}

// Function for creating taxon
function createTaxon(taxon) {
    //console.log(taxon);
    const cardBox = document.createElement('div');
    const card = document.createElement('section');
    const img = document.createElement('img');
    const cardBody = document.createElement('article');
    const cardText = document.createElement('p');
    const cardSubBody = document.createElement('div');
    const button = document.createElement('button');
    const smallText = document.createElement('small');

    cardBox.classList.add('card-box', 'col-md-4');
    card.classList.add('card', 'mb-4', 'box-shadow');
    img.className = 'card-img-top';
    cardBody.className = 'card-body';
    cardText.className = 'card-text';
    cardSubBody.className = 'card-sub-body';
    button.classList.add('btn', 'btn-sm', 'btn-outline-secondary');
    button.innerText = 'More Info';
    smallText.className = 'text-muted';

    smallText.innerText = moment(taxon.time_observed_at).fromNow();
    cardSubBody.append(button, smallText);

    button.addEventListener('click', (e) => showMoreInfo(e, taxon))

    cardText.innerHTML = `${taxon.taxon.preferred_common_name} (<i>${taxon.taxon.name}</i>)`;
    cardBody.append(cardText, cardSubBody);

    img.src = convertImage(taxon);
    card.append(img, cardBody);
    cardBox.appendChild(card);
    return resultsContainer.appendChild(cardBox);
}

// Convert square img returned from fetched data to larger size
// Info about replace()
// https://www.freecodecamp.org/news/javascript-regex-match-example-how-to-use-the-js-replace-method-on-a-string/
function convertImage(taxon) {
    const squareImg = taxon.photos[0].url;
    return squareImg.replace('square', 'large');
}

// Functions for revealing/hiding lightbox
function showMoreInfo(e, taxon) {
    const lightboxImg = document.createElement('img');
    const lightboxPara = document.createElement('p');
    
    document.getElementById('lightbox').style.display = 'flex';
    lightboxImg.src = convertImage(taxon);
    lightboxPara.innerHTML = e.target.parentElement.previousSibling.innerHTML + `
        <br> <a target="_blank" href="https://www.google.com/maps/search/?api=1&query=${taxon.location}">${taxon.place_guess}</a>
        <br> Photo and observation © 
        <a target="_blank" href="https://www.inaturalist.org/people/${taxon.user.login}">${taxon.user.login}</a>, 
        who has observed ${taxon.user.observations_count} different organisms!
    `;
    if (taxon.taxon.wikipedia_url) {
        lightboxPara.innerHTML += `
            <br>
            <div>
            <a target="_blank" href="${taxon.uri}"><button class="btn green">iNaturalist</button></a>
            <a target="_blank" href=${taxon.taxon.wikipedia_url}><button class="btn btn-primary">Wikipedia</button></a>
            </div>
        `
    } else {
        lightboxPara.innerHTML += `
            <br>
            <div>
            <a target="_blank" href="${taxon.uri}"><button class="btn green">iNaturalist</button></a>
            </div>
        `
    }

    document.getElementById('close').addEventListener('click', hideMoreInfo);
    return document.getElementById('lightbox-content').append(lightboxImg, lightboxPara);
}

function hideMoreInfo() {
    document.getElementById('lightbox-content').innerHTML = '';
    lightbox.style.display = 'none';
}

// Found a much better way to get the correct date format needed for moment.js (rendering the code below unnecessary)
// The observation object returned has another key with a standard date format that also takes timezones into account
// Keeping my code below (but commented out) because I spent a lot of time on it (and it worked most of the time;
// there were still some extra date/time formats that I did not take into account, as they were rarely used)

/*

// This function is specifically written to prevent a deprecation warning from occurring when using moment.js
// Because iNaturalist is loose about the date formats it uses (it uses many!), the date must be converted to a
// format accepted by moment.js before being passed into moment.js as an argument

function convertTimeFormat(date, stringDate) {
    let time = '';
    
    // Checks if stringDate is in format [day of week, month, day, year, time, timezone, timezone name]; time is at index 4
    // In this case, time is in correct 24 hour format
    if (stringDate.length >= 7) {
        time = stringDate[4]
        return `${date} ${time}`;
    
    // Checks if stringDate is in format [date, time, am/pm, timezone]; time is at index 1
    // In this case, time is NOT in correct format
    } else if (stringDate.length >= 3) {
        time = stringDate[1];
        const pmOrAm = stringDate[2];
        const firstTimeElement = parseInt(time[0]);
        const secondTimeElement = parseInt(time[1]);

        // Checks if PM is true and hour is !noon; if true, convert hour to 24 hour time
        if (pmOrAm === 'PM' && secondTimeElement !== 2) {
            time = firstTimeElement + 12 + time.substring(1);
            return `${date} ${time}`;
        
        // Checks if AM is true and hour is midnight; if true, convert midnight to 24 hour time
        } else if (pmOrAm === 'AM' && secondTimeElement === 2) {
            firstTimeElement = 0;
            secondTimeElement = 0;
            time = firstTimeElement + secondTimeElement + time.substring(1);  
            return `${date} ${time}`; 
        }
    
    // Checks if stringDate is in format [date, time]; time is at index 1
    // In this case, time is in correct 24 hour format
    } else if (stringDate.length > 1) {
        time = stringDate[1];
        return `${date} ${time}`;
    
    // Checks if stringDate is in format [date]; time is null
    } else {
        time = '';
        return date;
    }
}
*/