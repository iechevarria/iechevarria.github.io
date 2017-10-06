var d = document
var wrap = d.querySelector('.wrap')
var items = d.querySelector('.items')
var itemCount = d.querySelectorAll('.item').length
var scroller = d.querySelector('.scroller')
var galleries = d.querySelector('.galleries')
var pos = 0
var transform = Modernizr.prefixed('transform')

function setTransform () {
  items.style[transform] = 'translate3d(' + (-pos * items.offsetWidth) + 'px,0,0)'
}

function prev () {
  pos = (pos - 1 + itemCount) % itemCount
  setTransform()
}

function next () {
  pos = (pos + 1) % itemCount
  setTransform()
}

function showGalleries () {
  if (galleries.style.display === 'none') {
    galleries.style.display = 'block'
  } else {
    galleries.style.display = 'none'
  }
}

window.addEventListener('resize', setTransform)
