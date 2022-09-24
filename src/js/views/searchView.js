class SearchView {
  _parents = document.querySelectorAll('#search');
  _input = '';
  _parentElement = '';

  getQuery() {
    const query = this._input.value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._input.value = '';
  }

  addHandlerSearch(handler) {
    this._parents.forEach(el =>
      el.addEventListener(
        'submit',
        function (e) {
          e.preventDefault();
          this._parentElement = e.target;
          this._input = e.target.querySelector('.search_bar-field');
          handler();
        }.bind(this)
      )
    );
  }

  switchPage() {
    const results = document.querySelector('#results');
    const home = document.querySelector('#home');
    const rest = document.querySelector('#restaurant');

    window.scrollTo(0, 0);

    if (!home.classList.contains('off')) home.classList.toggle('off');

    if (!rest.classList.contains('off')) rest.classList.toggle('off');

    if (results.classList.contains('off')) results.classList.toggle('off');
  }

  toggleSpinner() {
    this._parentElement
      .querySelector('.fa-magnifying-glass')
      .classList.toggle('off');
    this._parentElement
      .querySelector('.fa-circle-notch')
      .classList.toggle('off');
  }
}

export default new SearchView();
