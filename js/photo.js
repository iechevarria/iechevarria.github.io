document.getElementById("main-wrapper").innerHTML += 
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

let slideshow = document.querySelector(".slideshow");
for (let i = 0; i < images.length; i++) {
  slideshow.innerHTML += ('<div class="slide" style="background-image: url(' + images[i].url + ')">' + '<div class="slide-label">' + images[i].label + '</div></div>');
}

let slides = document.querySelectorAll('.slide');
let slideCount = slides.length;
let pos = 0;

function showImg () {
  slides[pos].style.display = 'inline-block';
}

function hideImg () {
  slides[pos].style.display = 'none';
}

function prev () {
  hideImg();
  pos = (pos - 1 + slideCount) % slideCount;
  showImg();
}

function next () {
  hideImg();
  pos = (pos + 1) % slideCount;
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