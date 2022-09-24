import View from './view.js';
import greyBg from 'url:../../img/grey-bg.jpg';
import mapMarker from 'url:../../img/location-dot-solid.svg';
import { mapZoomLevel } from '../config.js';
// import * as L from 'leaflet';

class RestaurantView extends View {
  _parentElement = document.querySelector('#rest-display');
  _map;

  _generateMarkup() {
    const markup = `
    <section id="rest" class="container">
      <h2 class="section-title">${this._data.title}</h2>
      <div class="rest_details">
        <div class="rating">
          ${this._ratingCalculator(this._data.rating).join('')}
        </div>
        <p>(${this._data.numReviews})</p>
        <div class="separator"></div>
        <p>${this._data.cost}, ${this._data.type.join(', ')}</p>
      </div>
      <div class="rest-img">
        <img src="${
          this._data.images ? this._data.images.original.url : `${greyBg}`
        }" alt="" />
      </div>
      <div class="rest-desc">
        <p>
        ${this._data.title} is a ${this._data.type[0]} restaurant located in ${
      this._data.address
    }. It is positioned at 
        ${this._data.ranking} with a rating of ${
      this._data.rating
    }. If you are looking to contact them, 
        ${
          this._data.phone
            ? `you can do so by calling ${this._data.phone}`
            : "unfortunately they don't have their phone number listed yet"
        }. Finally, for more information about this place, you can also visit their website by clicking <a class="rest-website" href="${
      this._data.website
    }">here</a>.
        </p>
      </div>
    </section>

  <section id="rest_info" class="container">
    <div class="table py-1 figure">
      <div class="rest_info-content">
        <h2 class="content_title">Restaurant <span>info</span></h2>
        <div class="item">
          <h3>Website</h3>
          <div>
          ${
            this._data.website
              ? `<a class="rest-website" href="${this._data.website}">
            ${this._data.website
              .match(/(?<=p:\/\/|ps:\/\/)[\w.]*(?=\/|)/g)
              .join('')}
          </a>`
              : "There's no website for this restaurant yet"
          }
          </div>
        </div>
        <div class="item">
          <h3>Phone</h3>
          <div>
            <p>${this._data.phone || 'Undefined'}</p>
          </div>
        </div>
        <div class="item">
          <h3>Price range</h3>
          <div>
            <p>${this._data.cost}</p>
          </div>
        </div>
      </div>
      <div class="item">
        <div id="map">
       </div>
        <h2 class="text-center">Address</h2>
        <div class="location">
        <i class="fa-solid fa-location-dot"></i>
          <p>${this._data.address}</p>
        </div>
      </div>
    </div>
    <div id="schedule" class="figure">
      <h2 class="content_title">Schedule</h2>
      ${
        this._data.hours.length === 7
          ? `<div class="day">
      <p>Monday</p>
      <p class="hour monday">${this._data.hours[0]}</p>
    </div>
    <div class="day">
      <p>Tuesday</p>
      <p class="hour tuesday">${this._data.hours[1]}</p>
    </div>
    <div class="day">
      <p>Wednesday</p>
      <p class="hour wednesday">${this._data.hours[2]}</p>
    </div>
    <div class="day">
      <p>Thursday</p>
      <p class="hour thursday">${this._data.hours[3]}</p>
    </div>
    <div class="day">
      <p>Friday</p>
      <p class="hour friday">${this._data.hours[4]}</p>
    </div>
    <div class="day">
      <p>Saturday</p>
      <p class="hour saturday">${this._data.hours[5]}</p>
    </div>
    <div class="day">
      <p>Sunday</p>
      <p class="hour sunday">${this._data.hours[6]}</p>
    </div>`
          : this._data.hours
      }
      
    </div>
  </section>
  <section id="comments" class="container">
      <div class="comments-container py-2">
        <h2 class="section-title">Comments</h2>
        <p class="opinions_num">${
          this._data.reviews ? this._data.reviews.length : '0'
        } opinions</p>
        ${
          this._data.reviews
            ? this._data.reviews
                .map(rev => this._generateMarkupReview(rev))
                .join('')
            : 'No reviews for this restaurant yet'
        }
      </div>
    </section>
      `;
    return markup;
  }

  _generateMarkupReview(rev) {
    return `<div class="comment">
    <div class="comment-desc">
     <i class="far fa-user fa-2x"></i>
      <div>
        <span>${rev.author}</span>
        <p class="pub_Date">${rev.publish_date} ago</p>
      </div>
    </div>
    <div class="comment-text">
      <h3 class="comment-title">${rev.title}</h3>
      ${this._ratingCalculator(rev.rating).join('')}
      <p>
        ${rev.content}
      </p>
    </div>
  </div>`;
  }

  switchPage() {
    // document.querySelector('#results').classList.toggle('off');
    // document.querySelector('#rest').classList.toggle('off');
  }

  renderMap() {
    const coords = [this._data.lat, this._data.lon];

    this._map = L.map('map').setView(coords, mapZoomLevel);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attributtion:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this._map);

    L.marker(coords).addTo(this._map);
  }

  get _errorMessage() {
    return `Sorry we couldn't find any results for ${this._data.query}`;
  }
}

export default new RestaurantView();
