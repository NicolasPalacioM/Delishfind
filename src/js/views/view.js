export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    const markup = this._generateMarkup();

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
              <div>
                <i class="fa-solid fa-spinner fa-2x spinner"></i>
              </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error py-1">
    <div>
    <i class="fa-solid fa-triangle-exclamation fa-2x"></i>
    </div>
    <p>${message}</p>
  </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _ratingCalculator(rating) {
    const arr = [];

    for (let i = 0; i < Math.ceil(rating); i++) {
      if (rating - (i + 1) >= 0) arr.push('<i class="fa-solid fa-star"></i>');
      else arr.push('<i class="fa-solid fa-star-half-stroke"></i>');
    }

    while (arr.length < 5) {
      arr.push('<i class="fa-regular fa-star"></i>');
    }

    return arr;
  }
}
