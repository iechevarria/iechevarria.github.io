document.querySelector(".wrapper").innerHTML += 
'<svg class="glyph-filters"> \
<filter id="blue" color-interpolation-filters="sRGB" x="0" y="0" height="100%" width="100%"> \
  <feColorMatrix type="matrix" \
    values="1 0 0 0 0  \
            1 0 0 0 0  \
            1 0 0 0 1  \
            0 0 0 1 0" /> \
</filter> \
<filter id="red" color-interpolation-filters="sRGB" x="0" y="0" height="100%" width="100%"> \
  <feColorMatrix type="matrix" \
    values="0 1 0 0 1 \
            0 1 0 0 0 \
            0 1 0 0 0 \
            0 0 0 1 0" />\
</filter> \
</svg>';

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
