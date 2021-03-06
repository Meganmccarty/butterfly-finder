# Butterfly Finder
![Screenshot of the website](https://media.giphy.com/media/AUnnA1CC0UBfq3zwvc/giphy.gif)

This is a simple website that utilizes the [iNaturalist API](https://api.inaturalist.org/v1/docs/) and allows you to find recent butterfly sightings by US state.

You can visit the live Butterfly Finder here: https://meganmccarty.github.io/butterfly-finder

You can also [watch a short walkthrough](https://drive.google.com/file/d/1xY59IH-LSEMj68_VXfD3KIOpm1jma12s/view?usp=sharing) of the project

## Get your own copy
To create your own copy of this project:
1. Fork this repo
2. Click the green 'Code' button at the top right and copy the link
3. In your terminal, navigate to the directory in which to clone the repo
4. Type `git clone <copied-link>` and hit enter
5. Type `cd butterfly-finder` and hit enter
6. Run `open index.html` (if on Windows, navigate to the index.html in your File Explorer and open the file in your browser)

## Features
* Search for recent butterfly sightings by state
* Optionally search for a butterfly species (e.g., "Monarch butterfly") or a general type of butterfly (e.g., "Swallowtail")
    * The optional search is case insensitive and can also take in scientific/latin names (but only to the genus level or below)
* Display a lightbox for an individual image
    * Lightbox also shows more info about the observation: place with link to Google maps, observer's name and link to iNaturalist page, a button linked to the observation's iNaturalist page, and a button linked to the species' Wikipedia page
* Pagination buttons to show more results for a particular search

## Resources Used
* Built with simple HTML, CSS, and vanilla JavaScript
* Used [Bootstrap 4](https://getbootstrap.com/) example [Album theme](https://getbootstrap.com/docs/4.0/examples/album/) as a base for the website
* Used [Moment.js](https://momentjs.com/) for displaying observation dates as relative dates

