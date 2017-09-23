// from https://codepen.io/AshKyd/pen/JKGVmY

var CANVAS_WIDTH = 800
var CANVAS_HEIGHT = 800

var mouseLoc = [-1, -1]
var cursorMode = 'draw'
var renderMode = 'draw'
var elevation = 0
var renderAbove = true
var mouseClicked = false

var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')

/*
function shadeColor (color, percent) {
  color = color.substr(1)
  var num = parseInt(color, 16)
  var amt = Math.round(2.55 * percent)
  var R = (num >> 16) + amt
  var G = (num >> 8 & 0x00FF) + amt
  var B = (num & 0x0000FF) + amt
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
}
**/

function drawCube (x, y, stroke, lColor, rColor, tColor) {
  context.beginPath()
  context.moveTo(x, y)
  context.lineTo(x - 20, y - 10)
  context.lineTo(x - 20, y - 30)
  context.lineTo(x, y - 20)
  context.closePath()
  context.fillStyle = lColor
  context.strokeStyle = stroke
  context.stroke()
  context.fill()

  context.beginPath()
  context.moveTo(x, y)
  context.lineTo(x + 20, y - 10)
  context.lineTo(x + 20, y - 30)
  context.lineTo(x, y - 20)
  context.closePath()
  context.fillStyle = rColor
  context.strokeStyle = stroke
  context.stroke()
  context.fill()

  context.beginPath()
  context.moveTo(x, y - 20)
  context.lineTo(x - 20, y - 30)
  context.lineTo(x, y - 40)
  context.lineTo(x + 20, y - 30)
  context.closePath()
  context.fillStyle = tColor
  context.strokeStyle = stroke
  context.stroke()
  context.fill()
}

function drawOutline (x, y, stroke, fill) {
  context.beginPath()
  context.moveTo(x, y)
  context.lineTo(x - 20, y - 10)
  context.lineTo(x - 20, y - 30)
  context.lineTo(x, y - 40)
  context.lineTo(x + 20, y - 30)
  context.lineTo(x + 20, y - 10)
  context.closePath()

  context.fillStyle = fill
  context.fill()

  context.moveTo(x - 20, y - 10)
  context.lineTo(x + 20, y - 30)

  context.moveTo(x, y)
  context.lineTo(x, y - 40)

  context.moveTo(x - 20, y - 30)
  context.lineTo(x + 20, y - 10)

  context.strokeStyle = stroke
  context.stroke()
}

function drawShadow (x, y) {
  context.moveTo(x, y)
  context.lineTo(x - 20, y - 10)
  context.lineTo(x, y - 20)
  context.lineTo(x + 20, y - 10)
  context.closePath()
  context.fill()
}

function drawGrid (y) {
  context.beginPath()
  context.moveTo(0, 800)
  context.lineTo(800, 800)
  context.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT * 0.75 - 20 * y)
  context.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.5 - 20 * y)
  context.lineTo(0, CANVAS_HEIGHT * 0.75 - 20 * y)
  context.closePath()

  context.fillStyle = 'rgba(0, 0, 0, 0.4)'
  context.fill()

  context.beginPath()

  for (var i = 0; i < 21; i++) {
    context.moveTo(CANVAS_WIDTH / 2 - 20 * i, CANVAS_HEIGHT - 10 * (2 * y + i))
    context.lineTo(CANVAS_WIDTH - 20 * i, CANVAS_HEIGHT * 0.75 - 10 * (2 * y + i))

    context.moveTo(CANVAS_WIDTH / 2 + 20 * i, CANVAS_HEIGHT - 10 * (2 * y + i))
    context.lineTo(20 * i, CANVAS_HEIGHT * 0.75 - 10 * (2 * y + i))
  }

  context.strokeStyle = '#ccc'
  context.stroke()
}

var board = {
  arrContents: new Array(20),

  fill: function (i, j, k) {
    this.arrContents[i][j][k] = 1
  },

  erase: function (i, j, k) {
    this.arrContents[i][j][k] = 0
  },

  reset: function () {
    for (var i = 0; i < 20; i++) {
      this.arrContents[i] = new Array(20)
      for (var j = 0; j < 20; j++) {
        this.arrContents[i][j] = new Array(20)
        for (var k = 0; k < 20; k++) {
          this.arrContents[i][j][k] = 0
        }
      }
    }
  }
}

function drawCursor () {
  if (cursorMode === 'draw') {
    drawOutline((mouseLoc[0] + mouseLoc[1] + 1) * 20, 600 + (mouseLoc[0] - mouseLoc[1] + 1 - 2 * elevation) * 10, '#00f', 'rgba(100, 100, 200, 0.4)')
    drawShadow((mouseLoc[0] + mouseLoc[1] + 1) * 20, 600 + (mouseLoc[0] - mouseLoc[1] + 1) * 10)
  } else {
    drawOutline((mouseLoc[0] + mouseLoc[1] + 1) * 20, 600 + (mouseLoc[0] - mouseLoc[1] + 1 - 2 * elevation) * 10, '#f00', 'rgba(170, 68, 68, 0.5)')
    drawShadow((mouseLoc[0] + mouseLoc[1] + 1) * 20, 600 + (mouseLoc[0] - mouseLoc[1] + 1) * 10)
  }
}

function draw () {
  context.beginPath()
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  context.fillStyle = '#fff'
  context.font = '14px Courier'
  context.fillText('x: ' + mouseLoc[0].toString(), 25, 30)
  context.fillText('y: ' + mouseLoc[1].toString(), 25, 50)

  if (renderMode === 'draw') {
    drawGrid(0)
    for (var k = 0; k <= 20; k++) {
      if (k === elevation) {
        drawGrid(elevation)
      }
      for (var i = 0; i < 20; i++) {
        for (var j = 19; j >= 0; j--) {
          if (board.arrContents[i][j][k] === 1 && k <= elevation) {
            drawCube((i + j + 1) * 20, 600 + (i - j + 1) * 10 - 20 * k, '#fff', '#aaa', '#ccc', '#ddd')
          } else if (board.arrContents[i][j][k] === 1 && k > elevation && renderAbove === true) {
            drawOutline((i + j + 1) * 20, 600 + (i - j + 1 - 2 * k) * 10, '#aaa', 'rgba(170, 170, 170, 0.5)')
          }
          if (k === elevation && i === mouseLoc[0] && j === mouseLoc[1]) {
            drawCursor()
          }
        }
      }
    }
  } else if (renderMode === 'view') {
    for (var k = 0; k < 20; k++) {
      for (var i = 0; i < 20; i++) {
        for (var j = 19; j >= 0; j--) {
          if (board.arrContents[i][j][k] === 1) {
            drawCube((i + j + 1) * 20, 600 + (i - j + 1) * 10 - 20 * k, '#fff', '#aaa', '#ccc', '#ddd')
          }
        }
      }
    }
  }
}

function mouseClick () {
  if (mouseClicked && renderMode === 'draw') {
    if (cursorMode === 'draw') {
      board.fill(mouseLoc[0], mouseLoc[1], elevation)
    } else if (cursorMode === 'erase') {
      board.erase(mouseLoc[0], mouseLoc[1], elevation)
    }
  }
}

function setCursor (e) {
  if (Math.floor((e.offsetX * 0.5 + e.offsetY) / 20) - 30 - elevation !== mouseLoc[0] ||
      -(Math.floor((e.offsetY - e.offsetX * 0.5) / 20) - 29) + elevation !== mouseLoc[1]) {
    mouseLoc[0] = Math.floor((e.offsetX * 0.5 + e.offsetY) / 20) - 30 + elevation
    mouseLoc[1] = -(Math.floor((e.offsetY - e.offsetX * 0.5) / 20) - 29 + elevation)
    mouseClick()
    draw()
  }
}

function handleMouseDown (e) {
  mouseClicked = true
  mouseClick()
  draw()
}

function handleMouseUp () {
  mouseClicked = false
}

window.onkeyup = function (e) {
  var key = e.keyCode ? e.keyCode : e.which
  // up: move grid up
  if (key === 38) {
    elevation = Math.min(19, elevation + 1)
    mouseClick()
    draw()
  // down: move grid down
  } else if (key === 40) {
    elevation = Math.max(0, elevation - 1)
    mouseClick()
    draw()
  // e: erase
  } else if (key === 69) {
    cursorMode = 'erase'
    draw()
  // w: write
  } else if (key === 87) {
    cursorMode = 'draw'
    draw()
  // s: set rendermode to showing
  } else if (key === 83) {
    renderMode = 'view'
    draw()
  // d: set rendermode to drawing
  } else if (key === 68) {
    renderMode = 'draw'
    draw()
  }
}

board.reset()
canvas.addEventListener('mousemove', setCursor)
canvas.addEventListener('mousedown', handleMouseDown)
canvas.addEventListener('mouseup', handleMouseUp)

draw()
