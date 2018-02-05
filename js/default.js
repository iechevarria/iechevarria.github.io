var galleries = document.querySelector('.galleries');

function showGalleries () {
  if (galleries.style.display === 'none') {
    galleries.style.display = 'block';
  } else {
    galleries.style.display = 'none';
  }
}

showGalleries();
