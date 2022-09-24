import { API_URL } from './config.js';
import { AJAX } from './helper.js';

export const state = {
  rest: {},
  search: {
    query: '',
    results: [],
    oriResults: [],
  },
};

export const matchQuery = async function (query, top = false) {
  // let url = '';
  // if (top)
  //   url = `${API_URL}list?location_id=297474&lunit=km&open_now=false&lang=${navigator.language}`;
  // else
  //   url = `${API_URL}list?location_id=297474&lunit=km&open_now=false&lang=${navigator.language}`;

  const data = await AJAX(
    `${API_URL}list?location_id=297474&lunit=km&open_now=false&lang=${navigator.language}`,
    true
  );

  state.search.query = query;

  console.log(
    data.filters_v2.filter_sections[1].filter_groups[0].options,
    'pepe'
  );

  if (top)
    return data.filters_v2.filter_sections[1].filter_groups[0].options[
      Math.floor(Math.random() * 77)
    ].label;

  const match = data.filters_v2.filter_sections[1].filter_groups[0].options
    .filter(filt => filt.label.toLowerCase().includes(query.toLowerCase()))
    .map(val => val.value);

  return match;
};

export const matchRest = async function (id) {
  const data = await AJAX(
    `${API_URL}get-details?location_id=${id}&lang=${navigator.language}`,
    true
  );

  console.log(data);

  state.rest = {
    title: data.name,
    lat: data.latitude,
    lon: data.longitude,
    images: data.photo?.images,
    rating: data.rating,
    ranking: data.establishment_category_ranking,
    open: data.is_closed
      ? data.hours
        ? decimalToTime(data.hours.week_ranges[0][0].open_time)
        : '---'
      : 1,
    type: (data.cuisine &&
      data.cuisine.length &&
      data.cuisine.map(type => type.name)) || ['general'],
    cost: data.price_level.replace(/\s/g, ''),
    hours: data.hours
      ? data.hours.week_ranges.map(hour => {
          if (hour.length === 0) return '00:00-00:00';
          return `${decimalToTime(hour[0].open_time / 60)}-${decimalToTime(
            hour[0].close_time / 60
          )}`;
        })
      : 'No schedule available for this restaurant',
    reviews: data.reviews
      ? data.reviews.map(rev => {
          return {
            title: rev.title,
            rating: rev.rating,
            publish_date: dateDifference(rev.published_date),
            content: rev.summary,
            author: rev.author,
          };
        })
      : null,
    numReviews: data.num_reviews,
    address: data.address,
    phone: data.phone,
    website: data.website,
  };
};

// export const test = async function () {
//   const x = await AJAX(
//     'https://api.geoapify.com/v1/geocode/reverse?lat=7.11546&lon=-73.12543&apiKey=55119255cfbf4b94adacab7cefbc3a4a'
//   );

//   console.log(x);
// };

export const getPosition = async function (query) {
  await new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        resolve(loadSearchResults(pos, query));
      },
      function () {
        reject(false);
      }
    );
  });
  return;
};

export const loadSearchResults = async function (pos, id) {
  try {
    if (!pos)
      throw new Error(
        'Could not get your position, please allow it on your browser settings'
      );

    const { latitude } = pos.coords;
    const { longitude } = pos.coords;

    const data = await AJAX(
      `${API_URL}list-by-latlng?latitude=${latitude}&longitude=${longitude}&limit=30&combined_food=${id.join(
        ','
      )}&open_now=false&lunit=km&lang=${navigator.language}`,
      true
    );

    console.log(data);

    state.search.results = data.data
      .map(res => {
        if (!res.name) return;
        return {
          id: res.location_id,
          title: res.name,
          images: res.photo?.images,
          rating: res.rating,
          open: res.is_closed
            ? res.hours
              ? decimalToTime(res.hours.week_ranges[0][0].open_time)
              : '---'
            : 1,
          type: (res.cuisine &&
            res.cuisine.length &&
            res.cuisine.map(type => type.name)) || ['general'],
          cost: res.price_level.replace(/\s/g, ''),
        };
      })
      .filter(res => res);
    console.log(state.search.results);
    state.search.oriResults = structuredClone(state.search.results);
  } catch (err) {
    throw err;
  }
};

export const applyFilters = function (filter) {
  let value = '';

  if (filter === 0)
    state.search.results = state.search.results.sort((a, b) => {
      if (a !== 1) return 1;
      if (b !== 1) return -1;
      return 0;
    });

  if (Math.abs(filter) > 1) value = 1;
  else value = -1;

  if (filter > 0)
    state.search.results = state.search.results.sort(
      (a, b) => value * a.rating - value * b.rating
    );
  if (filter < 0)
    state.search.results = state.search.results.sort(
      (a, b) => value * a.cost.length - value * b.cost.length
    );
};

export const revertResults = function () {
  state.search.results = structuredClone(state.search.oriResults);
};

const decimalToTime = function (time) {
  const hour = Math.trunc(time);
  const minutes = (time % 1) * 60;

  if (minutes < 10) return hour + ':0' + minutes;
  else return hour + ':' + minutes;
};

const timeAdjust = function (quant, time) {
  if (quant === 1) return `${quant} ${time}`;
  else return `${quant} ${time}`;
};

const dateDifference = function (date) {
  const date1 = new Date(date);
  const date2 = new Date();

  //Difference
  const diffDates = Math.abs(date2 - date1);

  //Minutes
  const diffMinutes = Math.abs(diffDates / (1000 * 60));
  // Hours
  const diffHours = Math.trunc(diffMinutes / 60);
  // Days
  const diffDays = Math.trunc(diffHours / 24);
  //Months
  const diffMonths = Math.trunc(diffDays / 30);
  // Years
  const diffYears = Math.trunc(diffDays / 365);

  if (diffMinutes <= 60) return timeAdjust(diffMinutes, 'minutes');
  if (diffHours <= 24) return timeAdjust(diffHours, 'hours');
  if (diffDays <= 30) return timeAdjust(diffDays, 'days');
  if (diffMonths <= 12) return timeAdjust(diffMonths, 'months');

  return timeAdjust(diffYears, 'years');
};
