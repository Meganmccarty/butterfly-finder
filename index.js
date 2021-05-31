// Variables for current HTML elements
const form = document.getElementById('form');
const stateDropdown = document.getElementById('state-dropdown');
const taxonSearch = document.getElementById('taxon-search');
const row = document.querySelector('div.row');

form.addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();
    row.innerHTML = '';
    const stateSelected = stateDropdown.value;
    const taxonInputted = taxonSearch.value;

    fetch(`https://api.inaturalist.org/v1/observations?order=desc&order_by=observed_on&hrank=species&per_page=12&place_id=${stateSelected}&taxon_id=47224&taxon_name=${taxonInputted}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.total_results === 0) {
            console.log("Oops! The search term you entered did not turn up any butterflies. Please try searching for another butterfly.");
        } else {
            data.results.map(taxon => {
                // Variables needed for new HTML elements
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

                smallText.innerText = taxon.observed_on;
                cardSubBody.appendChild(button);
                cardSubBody.appendChild(smallText);

                cardText.innerHTML = `${taxon.taxon.preferred_common_name} (<i>${taxon.taxon.name}</i>)<br>${taxon.place_guess}`;
                cardBody.appendChild(cardText);
                cardBody.appendChild(cardSubBody);

                const squareImg = taxon.photos[0].url;
                const largeImg = squareImg.replace('square', 'large');

                img.src = largeImg;
                card.appendChild(img);
                card.appendChild(cardBody);

                cardBox.appendChild(card);

                row.appendChild(cardBox);
                
            })
        }
    })
    .catch(error => {
        console.log(error)
    })
    form.reset();
}