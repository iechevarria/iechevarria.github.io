var CANVAS_WIDTH = 800
var CANVAS_HEIGHT = 800
var FPS = 10
var paused = true

var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')
var boxSize = 10
var rowct = Math.floor(CANVAS_HEIGHT / boxSize)
var colct = Math.floor(CANVAS_WIDTH / boxSize)
var mouseLoc = [-1, -1]

var board = {
  arrBools: new Array(rowct),
  arrCounts: new Array(rowct),

  init: function () {
    for (var i = 0; i < rowct; i++) {
      this.arrBools[i] = new Array(colct)
      this.arrCounts[i] = new Array(colct)
      for (var j = 0; j < colct; j++) {
        this.arrBools[i][j] = false
        this.arrCounts[i][j] = 0
      }
    }
  },

  toggleBool: function (i, j) {
    this.arrBools[i][j] = !this.arrBools[i][j]
  },

  getBool: function (i, j) {
    return this.arrBools[i][j]
  },

  update: function () {
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
      context.fillText('click: change cell', 25, 30)
      context.fillText('space: toggle play/pause', 25, 50)
      context.fillText('    u: update by one step', 25, 70)
      context.fillText('    r: reset board', 25, 90)
      context.fillText('    d: toggle play/pause display', 25, 110)
      context.fillText('    h: toggle help', 25, 130)
    }
    if (this.playText) {
      if (paused) {
        context.fillStyle = '#fff'
        context.font = '14px Courier'
        context.fillText('paused', 360, 30)
      } else {
        context.fillStyle = '#fff'
        context.font = '14px Courier'
        context.fillText('playing', 360, 30)
      }
    }
  }
}

function draw () {
  context.beginPath()
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  for (var row = 0; row < colct; row++) {
    for (var col = 0; col < rowct; col++) {
      if (board.getBool(row, col)) {
        context.fillStyle = '#fff'
        context.fillRect(row * boxSize, col * boxSize, boxSize, boxSize)
      }
      if (row === mouseLoc[0] && col === mouseLoc[1]) {
        if (board.getBool(row, col)) {
          context.strokeStyle = '#000'
        } else {
          context.strokeStyle = '#fff'
        }
        context.lineWidth = 2
        context.strokeRect(row * boxSize + 1, col * boxSize + 1, boxSize - 2, boxSize - 2)
      }
    }
  }
  tooltip.draw()
}

function mouseoverRedraw (row, col) {
  context.clearRect(row * boxSize, col * boxSize, boxSize, boxSize)
  if (board.getBool(row, col)) {
    context.fillStyle = '#fff'
    context.fillRect(row * boxSize, col * boxSize, boxSize, boxSize)
  }
  if (row === mouseLoc[0] && col === mouseLoc[1]) {
    if (board.getBool(row, col)) {
      context.strokeStyle = '#000'
    } else {
      context.strokeStyle = '#fff'
    }
    context.lineWidth = 2
    context.strokeRect(row * boxSize + 1, col * boxSize + 1, boxSize - 2, boxSize - 2)
  }
  draw()
}

function handleClick (e) {
  board.toggleBool(Math.floor(e.offsetX / boxSize), Math.floor(e.offsetY / boxSize))
  draw()
}

function setCursor (e) {
  var tmpX = mouseLoc[0]
  var tmpY = mouseLoc[1]
  mouseLoc[0] = Math.floor(e.offsetX / boxSize)
  mouseLoc[1] = Math.floor(e.offsetY / boxSize)
  mouseoverRedraw(tmpX, tmpY)
  mouseoverRedraw(mouseLoc[0], mouseLoc[1])
}

setInterval(function () {
  if (!paused) {
    board.update()
    draw()
  }
}, 1000 / FPS)

window.onkeyup = function (e) {
  var key = e.keyCode ? e.keyCode : e.which
  if (key === 80 || key === 32) {
    paused = !paused
    draw()
  } else if (key === 72) {
    tooltip.toggleHelp()
    draw()
  } else if (key === 68) {
    tooltip.togglePlayText()
    draw()
  } else if (key === 82) {
    board.init()
    draw()
  } else if (key === 85) {
    board.update()
    draw()
  }
}

board.init()
canvas.addEventListener('click', handleClick)
canvas.addEventListener('mousemove', setCursor)
tooltip.draw()
