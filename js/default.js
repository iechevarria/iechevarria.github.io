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

var galleries = document.querySelector('.galleries');

function showGalleries () {
  if (galleries.style.display === 'none') {
    galleries.style.display = 'block';
  } else {
    galleries.style.display = 'none';
  }
}

showGalleries();
