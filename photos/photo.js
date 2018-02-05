var itemCount = document.querySelectorAll('.item').length;
var galleries = document.querySelector('.galleries');
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

function showGalleries () {
  if (galleries.style.display === 'none') {
    galleries.style.display = 'block';
  } else {
    galleries.style.display = 'none';
  }
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
