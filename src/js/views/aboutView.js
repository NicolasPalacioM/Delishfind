import View from './view.js';
import greyBg from 'url:../../img/grey-bg.jpg';

class AboutView extends View {
  _parents = document.querySelectorAll('.about');

  addHandlerAbout(handler) {
    this._parents.forEach(el =>
      el.addEventListener('click', function (e) {
        e.preventDefault();
        handler();
      })
    );
  }

  switchPage() {
    window.scrollTo(0, 0);
    document.querySelector('#home').classList.add('off');
    document.querySelector('#results').classList.add('off');
    document.querySelector('#restaurant').classList.add('off');
    document.querySelector('#about').classList.toggle('off');
  }

  get _errorMessage() {
    return `Sorry we couldn't find any results for ${this._data.query}`;
  }
}

export default new AboutView();
