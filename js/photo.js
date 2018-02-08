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

var itemCount = document.querySelectorAll('.slide').length;
var pos = 0;

function showImg () {
  document.getElementById(getImgStr()).style.display = 'inline-block';
}

function hideImg () {
  document.getElementById(getImgStr()).style.display = 'none';
}

function getImgStr () {
  var posStr = '' + pos;
  var pad = '00';
  return 'img' + pad.substring(0, pad.length - posStr.length) + posStr;
}

function prev () {
  hideImg();
  pos = (pos - 1 + itemCount) % itemCount;
  showImg();
}

function next () {
  hideImg();
  pos = (pos + 1) % itemCount;
  showImg();
}

window.onkeyup = function (e) {
  var key = e.keyCode ? e.keyCode : e.which;
  if (key === 37) {
    prev();
  } else if (key === 39) {
    next();
  }
}

showImg();
