import View from './view.js';
import greyBg from 'url:../../img/grey-bg.jpg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results_list');
  _parentFilt = document.querySelector('.table');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const rest = e.target.closest('.object');
      if (!rest) return;

      const { id } = rest.dataset;
      handler(+id);
    });
  }

  addHandlerFilter(handler) {
    this._parentFilt.addEventListener('click', function (e) {
      const check = e.target.closest('.filter_checkbox');
      console.log(check);
      if (!check) return;
      // if unchecked return back to normal

      const { name } = check;
      handler(name, check.checked);
    });
  }

  _template(data) {
    const markup = `
      <div class="object" data-id="${data.id}">
              <img src="${
                data.images ? data.images.original.url : `${greyBg}`
              }" alt="" />
              <div class="details">
                <div class="main_details">
                  <a href="#">
                    <h2 class=".object_title">${data.title}</h2>
                  </a>
                  <p><span>Type:</span> ${data.type[0]}</p>
                  <div class="rating">
                    ${this._ratingCalculator(data.rating).join('')}
                  </div>
                </div>
                <div class="aside_details">
                  <div class="available">
                    <p>${!isNaN(data.open) ? 'Open now' : 'Closed'}</p>
                    <div class="sign ${
                      !isNaN(data.open) ? 'open' : 'close'
                    }"></div>
                    <p>${!isNaN(data.open) ? '' : data.open}</p>
                  </div>
                  <div class="cost">
                    <p>${data.cost}</p>
                  </div>
                </div>
              </div>
            </div>
      `;
    return markup;
  }

  resultsCount(query, quant) {
    document.querySelector('.query').textContent = query;
    document.querySelector('.quant').textContent = `${quant}`;
  }

  _generateMarkup() {
    return this._data.results.map(result => this._template(result)).join('');
  }

  get _errorMessage() {
    return `Sorry we couldn't find any results for ${this._data.query}`;
  }

  switchPage() {
    window.scrollTo(0, 0);
    document.querySelector('#home').classList.add('off');
    document.querySelector('#results').classList.add('off');
    document.querySelector('#restaurant').classList.toggle('off');
  }
}

export default new ResultsView();
