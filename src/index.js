const form = document.getElementById('form');
form.addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();
    document.querySelector('div.row').innerHTML = '';

    insertLoadingGIF();
    fetchAPI();

    form.reset();
}

function insertLoadingGIF() {
    const loadingGIF = document.createElement('img');
    loadingGIF.src = './src/images/loading.gif';
    loadingGIF.id = 'loading-gif';
    return document.querySelector('div.row').parentElement.appendChild(loadingGIF);
}

function fetchAPI() {
    const stateSelected = document.getElementById('state-dropdown').value;
    const taxonInputted = document.getElementById('taxon-search').value;

    return fetch(`https://api.inaturalist.org/v1/observations?order=desc&order_by=observed_on&hrank=species&page=1&per_page=15&place_id=${stateSelected}&taxon_id=47224&taxon_name=${taxonInputted}`)
    .then(response => response.json())
    .then(data => displayResults(data))
    .catch(error => {
        console.log(error);
    })
}

function displayResults(data) {
    removeLoadingGIF();

    if (data.total_results === 0) {
        const errorPara = document.createElement('p');
        errorPara.innerText = "Oops! The search term you entered did not turn up any butterflies. Please try searching for another butterfly.";
        return document.querySelector('div.row').appendChild(errorPara);
    } else {
        console.log(data);
        return data.results.map(taxon => createTaxon(taxon))
    }
}

function removeLoadingGIF() {
    return document.querySelector('div.row').parentElement.lastChild.remove();
}

function createTaxon(taxon) {
    console.log(taxon);
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

    const date = taxon.observed_on;
    smallText.innerText = moment(taxon.time_observed_at).fromNow();
    cardSubBody.append(button, smallText);

    button.addEventListener('click', (e) => showMoreInfo(e, taxon))

    cardText.innerHTML = `${taxon.taxon.preferred_common_name} (<i>${taxon.taxon.name}</i>)<br>${taxon.place_guess}`;
    cardBody.append(cardText, cardSubBody);

    img.src = convertImage(taxon);
    card.append(img, cardBody);
    cardBox.appendChild(card);
    return document.querySelector('div.row').appendChild(cardBox);
}

// Convert square img returned from fetch request to larger size
// Info about replace()
// https://www.freecodecamp.org/news/javascript-regex-match-example-how-to-use-the-js-replace-method-on-a-string/
function convertImage(taxon) {
    const squareImg = taxon.photos[0].url;
    return squareImg.replace('square', 'large');
}

function showMoreInfo(e, taxon) {
    const lightboxImg = document.createElement('img');
    const lightboxPara = document.createElement('p');
    
    document.getElementById('lightbox').style.display = 'flex';
    lightboxImg.src = convertImage(taxon);
    lightboxPara.innerHTML = e.target.parentElement.previousSibling.innerHTML + `
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