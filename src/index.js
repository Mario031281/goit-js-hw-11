import { getImages } from './js/serviceApi';
import { notifySuccess, notifyFailure } from './js/notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
const loader = document.querySelector('.loader');

let searchValue = '';
let page = 1;
let totalImages = 0;
let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

searchForm.addEventListener('submit', onSubmit);
loadMoreButton.addEventListener('click', loadMoreImages);
loadMoreButton.classList.add('is-hidden');
loader.style.display = 'none';

function onSubmit(event) {
  loader.style.display = 'block';
  event.preventDefault();
  page = 1;
  searchValue = searchInput.value;
  gallery.innerHTML = '';
  totalImages = 0;
  getImages(searchValue)
    .then(data => {
      if (data.hits.length === 0 || searchValue === '') {
        notifyFailure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        notifySuccess(`Hooray! We found ${data.totalHits} images.`);
        loadMoreButton.classList.remove('is-hidden');
        createMarkup(data);
        lightbox.refresh();
      }
    })
    .catch(err => console.log(err));
}

function createMarkup(data) {
  const markup = data.hits
    .map(image => {
      return `<div class="photo-card">
        <a class="gallery__link" href="${image.largeImageURL}">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" width="280" height="210" /></a>
        <div class="info">
        <p class="info-item"><b>Likes</b> ${image.likes}</p>
        <p class="info-item"><b>Views</b> ${image.views}</p>
        <p class="info-item"><b>Comments</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads</b> ${image.downloads}</p>
      </div>
      </div>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
  loader.style.display = 'none';
  totalImages += data.hits.length;

  if (totalImages >= data.totalHits) {
    loadMoreButton.classList.add('is-hidden');
  }
}

function loadMoreImages() {
  page += 1;
  getImages(searchValue, page)
    .then(data => {
      createMarkup(data);
      totalImages += data.hits.length;
      if (totalImages >= data.totalHits) {
        loadMoreButton.classList.add('is-hidden');
        notifyFailure(
          "We're sorry, but you've reached the end of search results."
        );
      }
      ScrollGallery();
      lightbox.refresh();
    })
    .catch(error =>
      notifyFailure(
        "We're sorry, but an error occurred while loading more images."
      )
    );
}

function ScrollGallery() {
  const { height } = gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
}
