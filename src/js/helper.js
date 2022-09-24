import { TIMEOUT_SEC } from './config.js';
import { API_KEY } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, headers = undefined) {
  try {
    const fetched = headers
      ? fetch(url, {
          method: 'GET',
          headers: {
            'x-rapidapi-key': `${API_KEY}`,
            'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
          },
        })
      : fetch(url);

    const res = await Promise.race([fetched, timeout(TIMEOUT_SEC)]);

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
