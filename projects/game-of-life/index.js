var CANVAS_WIDTH = 800
var CANVAS_HEIGHT = 800
var FPS = 10
var paused = true

var mouseClicked = false
var drawMode = 'drawing'

var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')
var boxSize = 10
var rowct = Math.floor(CANVAS_HEIGHT / boxSize)
var colct = Math.floor(CANVAS_WIDTH / boxSize)
var mouseLoc = [-1, -1]

var board = {
  arrBools: new Array(rowct),
  arrCounts: new Array(rowct),

  reset: function () {
    for (var i = 0; i < rowct; i++) {
      this.arrBools[i] = new Array(colct)
      this.arrCounts[i] = new Array(colct)
      for (var j = 0; j < colct; j++) {
        this.arrBools[i][j] = false
        this.arrCounts[i][j] = 0
      }
    }
  },

  setAlive: function (i, j) {
    this.arrBools[i][j] = true
  },

  setDead: function (i, j) {
    this.arrBools[i][j] = false
  },

  getBool: function (i, j) {
    return this.arrBools[i][j]
  },

  update: function () {
    // get number of living neighbors for each cell
    for (var row = 0; row < rowct; row++) {
      for (var col = 0; col < colct; col++) {
        this.arrCounts[row][col] = this.arrBools[(row - 1 + rowct) % rowct][(col - 1 + colct) % colct] +
                            this.arrBools[(row - 1 + rowct) % rowct][col] +
                            this.arrBools[(row - 1 + rowct) % rowct][(col + 1) % colct] +
                            this.arrBools[row][(col - 1 + colct) % colct] +
                            this.arrBools[row][(col + 1) % colct] +
                            this.arrBools[(row + 1) % rowct][(col - 1 + colct) % colct] +
                            this.arrBools[(row + 1) % rowct][col] +
                            this.arrBools[(row + 1) % rowct][(col + 1) % colct]
      }
    }
    // change cell values
    for (var i = 0; i < rowct; i++) {
      for (var j = 0; j < colct; j++) {
        var aliveCount = this.arrCounts[i][j]
        if (this.arrBools[i][j]) {
          if (aliveCount === 2 || aliveCount === 3) {
            this.arrBools[i][j] = true
          } else {
            this.arrBools[i][j] = false
          }
        } else {
          if (aliveCount === 3) {
            this.arrBools[i][j] = true
          } else {
            this.arrBools[i][j] = false
          }
        }
      }
    }
  }
}

var tooltip = {
  show: true,
  playText: true,

  toggleHelp: function () {
    this.show = !this.show
  },

  togglePlayText: function () {
    this.playText = !this.playText
  },

  draw: function () {
    if (this.show) {
      context.fillStyle = '#fff'
      context.font = '14px Courier'
      context.fillText('click: set cell (hold to draw)', 25, 30)
      context.fillText('space: toggle play/pause', 25, 50)
      context.fillText('    d: set cursor to draw mode', 25, 70)
      context.fillText('    e: set cursor to erase mode', 25, 90)
      context.fillText('    u: update by one step', 25, 110)
      context.fillText('    p: reset board', 25, 130)
      context.fillText('    s: toggle play/pause display', 25, 150)
      context.fillText('    h: toggle help', 25, 170)
    }
    if (this.playText) {
      if (paused) {
        context.fillStyle = '#fff'
        context.font = '14px Courier'
        context.fillText('paused', 364, 30)
        context.fillText(drawMode, 360, 50)
      } else {
        context.fillStyle = '#fff'
        context.font = '14px Courier'
        context.fillText('playing', 360, 30)
        context.fillText(drawMode, 360, 50)
      }
    }
  }
}

function draw () {
  context.beginPath()
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  for (var row = 0; row < colct; row++) {
    for (var col = 0; col < rowct; col++) {
      // draw cells
      if (board.getBool(row, col)) {
        context.fillStyle = '#fff'
        context.fillRect(row * boxSize, col * boxSize, boxSize, boxSize)
      }
      // draw cursor
      if (row === mouseLoc[0] && col === mouseLoc[1]) {
        if (board.getBool(row, col)) {
          context.strokeStyle = '#000'
        } else {
          context.strokeStyle = '#fff'
        }
        if (drawMode === 'drawing') {
          context.lineWidth = 2
          context.strokeRect(row * boxSize + 1, col * boxSize + 1, boxSize - 2, boxSize - 2)
        } else {
          context.moveTo(row * boxSize, col * boxSize)
          context.lineTo((row + 1) * boxSize, (col + 1) * boxSize)
          context.moveTo(row * boxSize, (col + 1) * boxSize)
          context.lineTo((row + 1) * boxSize, col * boxSize)
          context.stroke()
        }
      }
    }
  }
  tooltip.draw()
}

function setCursor (e) {
  if (mouseClicked) {
    if (drawMode === 'drawing') {
      board.setAlive(Math.floor(e.offsetX / boxSize), Math.floor(e.offsetY / boxSize))
    } else {
      board.setDead(Math.floor(e.offsetX / boxSize), Math.floor(e.offsetY / boxSize))
    }
  }
  mouseLoc[0] = Math.floor(e.offsetX / boxSize)
  mouseLoc[1] = Math.floor(e.offsetY / boxSize)
  draw()
}

function handleMouseDown (e) {
  mouseClicked = true
  if (drawMode === 'drawing') {
    board.setAlive(Math.floor(e.offsetX / boxSize), Math.floor(e.offsetY / boxSize))
  } else {
    board.setDead(Math.floor(e.offsetX / boxSize), Math.floor(e.offsetY / boxSize))
  }
  draw()
}

function handleMouseUp () {
  mouseClicked = false
}

window.onkeydown = function (e) {
  var key = e.keyCode ? e.keyCode : e.which
  // d: draw
  if (key === 68) {
    drawMode = 'drawing'
    draw()
  // e: erase
  } else if (key === 69) {
    drawMode = 'erasing'
    draw()
  // p: reset
  } else if (key === 80) {
    board.reset()
    draw()
  // u: updates
  } else if (key === 85) {
    board.update()
    draw()
  }
}

window.onkeyup = function (e) {
  var key = e.keyCode ? e.keyCode : e.which
  // space: toggle play/pause
  if (key === 32) {
    paused = !paused
    draw()
  // h: toggle help
  } else if (key === 72) {
    tooltip.toggleHelp()
    draw()
  // s: toggle play/pause and brush display
  } else if (key === 83) {
    tooltip.togglePlayText()
    draw()
  }
}

// main loop
setInterval(function () {
  if (!paused) {
    board.update()
    draw()
  }
}, 1000 / FPS)

board.reset()
canvas.addEventListener('mousemove', setCursor)
canvas.addEventListener('mousedown', handleMouseDown)
canvas.addEventListener('mouseup', handleMouseUp)
tooltip.draw()
