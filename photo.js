var d = document
var wrap = d.querySelector('.wrap')
var items = d.querySelector('.items')
var itemCount = d.querySelectorAll('.item').length
var scroller = d.querySelector('.scroller')
var pos = 0
var transform = Modernizr.prefixed('transform')

function setTransform() {
  items.style[transform] = 'translate3d(' + (-pos * items.offsetWidth) + 'px,0,0)'
}

function prev() {
  pos = (pos - 1 + itemCount) % itemCount
  setTransform()
}

function next() {
  pos = (pos + 1) % itemCount
  setTransform()
}

window.addEventListener('resize', setTransform)
