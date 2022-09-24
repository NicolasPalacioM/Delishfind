import * as model from './model.js';
import 'core-js/stable';
import 'regenerator-runtime';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import restaurantView from './views/restaurantView.js';
import homeView from './views/homeView.js';
import aboutView from './views/aboutView.js';

// search.addEventListener("submit", function (e) {
//   e.preventDefault();

//   navigator.geolocation.getCurrentPosition(
//     function () {
//       console.log("papita");
//     },
//     function () {
//       alert("Could not get your position");
//     }
//   );
// });

const controlResults = async function (query) {
  try {
    // match query with id
    const id = await model.matchQuery(query);

    // Go to results page
    searchView.switchPage();
    resultsView.renderSpinner();

    // Get position and load results
    await model.getPosition(id);

    console.log(model.state.search);
    // Render results
    resultsView.render(model.state.search);
    resultsView.resultsCount(query, model.state.search.results.length);
  } catch (err) {
    // Maybe alert
    console.log(err);
  }
};

const controlRestaurants = async function (id) {
  try {
    // 1) Find rest
    await model.matchRest(id);
    console.log(model.state.rest);
    // 2) Render rest page
    restaurantView.render(model.state.rest);
    restaurantView.renderMap();
    // 3) Switch page
    resultsView.switchPage();
  } catch (err) {
    console.log(err);
  }
};

const controlResultsCat = async function (query) {
  await controlResults(query);
};

const controlResultsSearch = async function () {
  const query = searchView.getQuery();
  if (!query) return;

  searchView.toggleSpinner();

  await controlResults(query);

  searchView.toggleSpinner();
};

const controlResultsRdm = async function () {
  // 1) Get random query
  const query = await model.matchQuery('random', true);
  // 2) Render results
  await controlResults(query);
};

const controlTopRests = async function (id) {
  await controlRestaurants(id);
};

const controlFilters = async function (filter, checked = false) {
  model.applyFilters(filter);

  if (!checked) model.revertResults();
  console.log(
    model.state.search.results,
    model.state.search.oriResults,
    checked
  );

  resultsView.render(model.state.search);
};

const controlAbout = function () {
  aboutView.switchPage();
};

const init = function () {
  searchView.addHandlerSearch(controlResultsSearch);
  resultsView.addHandlerClick(controlRestaurants);
  resultsView.addHandlerFilter(controlFilters);
  homeView.addHandlerCat(controlResultsCat);
  homeView.addHandlerTop(controlTopRests);
  homeView.addHandlerRdm(controlResultsRdm);
  aboutView.addHandlerAbout(controlAbout);
};

init();
