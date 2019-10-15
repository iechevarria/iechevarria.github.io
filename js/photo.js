const slideshow = document.querySelector(".slideshow");
for (let i = 0; i < images.length; i++) {
  slideshow.innerHTML += ('<div class="slide" style="background-image: url(' + images[i].url + ')">' + '<div class="slide-label">' + images[i].label + '</div></div>');
}

const slides = document.querySelectorAll('.slide');
const slideCount = slides.length;
let idx = 0;

function showImg () {
  slides[idx].setAttribute('class', 'slide-active')
}

function hideImg () {
  slides[idx].setAttribute('class', 'slide')
}

function prev () {
  hideImg();
  idx = (idx - 1 + slideCount) % slideCount;
  showImg();
}

function next () {
  hideImg();
  idx = (idx + 1) % slideCount;
  showImg();
}

window.onkeyup = function (e) {
  let key = e.keyCode ? e.keyCode : e.which;
  if (key === 37) {
    prev();
  } else if (key === 39) {
    next();
  }
}

showImg();
