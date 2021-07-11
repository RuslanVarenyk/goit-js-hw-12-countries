import debounce from 'lodash.debounce';
import API from './fetchCountries';
import countryCardTpl from './countries-card.hbs';
import listOfCountriesTpl from './input-list.hbs';
import './style.css';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
const { error } = require('@pnotify/core');

const refs = {
    input: document.querySelector('.js-input'),
    cardContainer: document.querySelector('.js-container')
}

refs.input.addEventListener('input', debounce(onInput, 500));
refs.input.addEventListener('click', onInputClickClearCountryCard);

function onInput(event) {
    event.preventDefault()
    
    const searchQuery = event.target.value;
    API.fetchCountries(searchQuery)
        .then(countries => {
            if (countries.length === 1) {
                renderCountryCard(countries[0]);
            }
            else if (countries.length < 10) {
                renderCountriesList(countries);
            }
            else if (countries.length >= 10 && event.target.value.length !== 1) {
                showError('Too matches found. Please enter a more specific query!');
            }
        }
    )
}

function renderCountryCard(countries) {
    refs.cardContainer.innerHTML = '';
    const markUp = countryCardTpl(countries);
    refs.cardContainer.insertAdjacentHTML('beforeend', markUp);
}

function renderCountriesList(countries) {
    refs.cardContainer.innerHTML = '';
    const markUp = listOfCountriesTpl(countries);
    refs.cardContainer.insertAdjacentHTML('beforeend', markUp);
}

function onInputClickClearCountryCard() {
    refs.input.value = '';
    refs.cardContainer.innerHTML = '';
}

let isErrorActive = false;
function roof() {
    isErrorActive = false;
}

function showError(errMessage) {
    if (isErrorActive) {
        return;
    }
    isErrorActive = true;
    setTimeout(roof, 3000);

    return error({
        text: errMessage,
        maxTextHeight: null,
        shadow: true,
        animateSpeed: 'fast',
        delay: 2000,
        sticker: false,
        closerHover: false,
    });
}