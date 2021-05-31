// Variables for current HTML elements
const form = document.getElementById('form');
const stateDropdown = document.getElementById('state-dropdown');
const taxonSearch = document.getElementById('taxon-search');

form.addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();
    const stateSelected = stateDropdown.value;
    const taxonInputted = taxonSearch.value;

    fetch(`https://api.inaturalist.org/v1/observations?order=desc&order_by=created_at&place_id=${stateSelected}&taxon_id=47224&taxon_name=${taxonInputted}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.total_results === 0) {
            console.log("Oops! The search term you entered did not turn up any butterflies. Please try searching for another butterfly.");
        } else {
            data.results.map(taxon => {
                console.log(taxon);
            })
        }
    })
    .catch(error => {
        console.log(error)
    })
}