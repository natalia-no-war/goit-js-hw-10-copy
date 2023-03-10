import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js-templates/fetchCountries';
import { createCountryList } from './js-templates/createCountrylist';
import { createCountryCard } from './js-templates/createCountryCard';

const DEBOUNCE_DELAY = 300;

const inputSearchRef = document.querySelector("[type='text']");
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');
let countryName = '';

inputSearchRef.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));

function handleInput(e) {
  countryName = inputSearchRef.value.trim();
  if (countryName === '') {
    clearAll();
    return;
  } else {
    fetchCountries(countryName).then(renderCountryInfo).catch(renderMistake);
  }
}

function renderCountryInfo(data) {
  if (data.length > 10) {
    clearAll();
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if ((data.length >= 2) & (data.length <= 10)) {
    clearAll();
    countryListRef.innerHTML = createCountryList(data);
  } else if (data.length === 1) {
    clearAll();
    countryInfoRef.innerHTML = createCountryCard(data);
  }
}

function renderMistake(err) {
  if (err.message === '404') {
    clearAll();
    Notify.failure('Oops, there is no country with that name');
  }
}

function clearAll() {
  countryListRef.innerHTML = '';
  countryInfoRef.innerHTML = '';
}
