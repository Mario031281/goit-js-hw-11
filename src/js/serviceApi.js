import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38144965-ad727792052d7b57e9a98ff41';
const PARAMS =
  'image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

export const getImages = async function (searchValue, page) {
  const resp = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${searchValue}&${PARAMS}&page=${page}`
  );
  if (!resp.statusText === 'OK') {
    notifyFailure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  return resp.data;
};
