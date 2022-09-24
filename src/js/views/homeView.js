import View from './view.js';
import greyBg from 'url:../../img/grey-bg.jpg';

class HomeView extends View {
  _parentCat = document.querySelector('#categories');
  _parentTop = document.querySelector('#top');
  _parentRdm = document.querySelector('.random');

  addHandlerCat(handler) {
    this._parentCat.addEventListener('click', function (e) {
      const cat = e.target.closest('.object');
      if (!cat) return;

      const { type } = cat.dataset;
      handler(type);
    });
  }

  addHandlerTop(handler) {
    this._parentTop.addEventListener('click', function (e) {
      const top = e.target.closest('.object');
      if (!top) return;

      const { id } = top.dataset;
      handler(id);
    });
  }

  addHandlerRdm(handler) {
    this._parentRdm.addEventListener('click', function () {
      handler();
    });
  }

  get _errorMessage() {
    return `Sorry we couldn't find any results for ${this._data.query}`;
  }
}

export default new HomeView();
