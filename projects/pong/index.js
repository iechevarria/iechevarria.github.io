var CANVAS_WIDTH = 800
var CANVAS_HEIGHT = 600
var FPS = 60
var pi = 3.14159
var paused = false

var downPressed = false
var upPressed = false

var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')

var leftPaddle = {
  color: '#fff',
  x: 5,
  y: 270,
  width: 10,
  height: 60,

  draw: function () {
    context.fillStyle = this.color
    context.fillRect(this.x, this.y, this.width, this.height)
  }
}

var rightPaddle = {
  color: '#fff',
  x: 785,
  y: 270,
  width: 10,
  height: 60,

  draw: function () {
    context.fillStyle = this.color
    context.fillRect(this.x, this.y, this.width, this.height)
  },

  update: function () {
    if (ball.served) {
      if (ball.y + 10 > this.y + this.height / 2 &&
          ball.x > CANVAS_WIDTH / 5 &&
          ball.x < CANVAS_WIDTH) {
        this.y += 4
      }
      if (ball.y - 10 < this.y + this.height / 2 &&
          ball.x > CANVAS_WIDTH / 5 &&
          ball.x < CANVAS_WIDTH) {
        this.y -= 4
      }

      this.y = Math.min(Math.max(this.y, 5), CANVAS_HEIGHT - this.height - 5)
    } else {
      if (ball.y + 10 > this.y + this.height / 2) {
        this.y += 4
      }
      if (ball.y - 10 < this.y + this.height / 2) {
        this.y -= 4
      }
    }
  }
}

var ball = {
  color: '#fff',
  x: 0,
  y: 0,
  radius: 5,
  angle: 2 * pi,
  served: false,

  reset: function () {
    this.x = leftPaddle.x + 10
    this.y = leftPaddle.y + 30
    this.angle = 2 * pi - 0.16 + (Math.random() * 0.32)
    this.served = false
  },

  serve: function () {
    this.served = true
  },

  update: function () {
    if (this.served) {
      this.x += Math.cos(this.angle) * 10
      this.y += Math.sin(this.angle) * 10

      if (this.y - this.radius < 0) {
        this.angle = -this.angle
        this.y = this.radius + 0.1
      }
      if (this.y + this.radius > CANVAS_HEIGHT) {
        this.angle = -this.angle
        this.y - this.radius - 0.1
      }
      if (this.x - this.radius < leftPaddle.x &&
          this.x - this.radius > leftPaddle.x - leftPaddle.width &&
          this.y + this.radius >= leftPaddle.y &&
          this.y - this.radius <= leftPaddle.y + leftPaddle.height) {
        this.angle = pi - this.angle - 0.16 + (Math.random() * 0.32)
        this.x = leftPaddle.x + this.radius + 1
      }
      if (this.x + this.radius > rightPaddle.x &&
          this.x + this.radius < rightPaddle.x + rightPaddle.width &&
          this.y + this.radius >= rightPaddle.y &&
          this.y - this.radius <= rightPaddle.y + rightPaddle.height) {
        this.angle = pi - this.angle - 0.16 + (Math.random() * 0.32)
        this.x = rightPaddle.x - this.radius - 1
      }
      if (this.x > CANVAS_WIDTH + 50) {
        scoreboard.addPointLeft()
        this.reset()
      }
      if (this.x < -50) {
        scoreboard.addPointRight()
        this.reset()
      }
    } else {
      this.y = leftPaddle.y + 30
      this.x = leftPaddle.x + 15
    }
  },

  draw: function () {
    context.fillStyle = this.color
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
    context.fill()
  }

}

var scoreboard = {
  leftScore: 0,
  rightScore: 0,

  addPointLeft: function () {
    this.leftScore += 1
  },

  addPointRight: function () {
    this.rightScore += 1
  },

  draw: function () {
    context.font = '40px Courier'
    context.fillText(this.leftScore, 285, 100)
    context.fillText(this.rightScore, 485, 100)
  }
}

var tooltip = {
  show: true,

  toggle: function () {
    this.show = !this.show
  },

  draw: function () {
    if (this.show) {
      context.font = '14px Courier'
      context.fillText('space: serve', 25, 30)
      context.fillText('   up: move up', 25, 50)
      context.fillText(' down: move down', 25, 70)
      context.fillText('    p: toggle play/pause', 25, 90)
      context.fillText('    h: toggle help', 25, 110)
    }
  }
}

setInterval(function () {
  if (!paused) {
    update()
    draw()
  }
}, 1000 / FPS)

function update () {
  if (downPressed) {
    leftPaddle.y += 5
  }

  if (upPressed) {
    leftPaddle.y -= 5
  }

  leftPaddle.y = Math.min(Math.max(leftPaddle.y, 5), CANVAS_HEIGHT - leftPaddle.height - 5)
  rightPaddle.update()
  ball.update()
}

window.onkeydown = function (e) {
  var key = e.keyCode ? e.keyCode : e.which
  if (key === 38) {
    upPressed = true
  } else if (key === 40) {
    downPressed = true
  } else if (key === 32) {
    ball.serve()
  }
}

window.onkeyup = function (e) {
  var key = e.keyCode ? e.keyCode : e.which
  if (key === 72) {
    tooltip.toggle()
    draw()
  } else if (key === 80) {
    paused = !paused
  } else if (key === 38) {
    upPressed = false
  } else if (key === 40) {
    downPressed = false
  }
}

function draw () {
  context.beginPath()
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  context.fillStyle = '#000'
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  context.fillStyle = '#fff'
  context.fillRect(400, 0, 2, CANVAS_HEIGHT)
  context.fillRect(0, 0, CANVAS_WIDTH, 2)
  context.fillRect(0, 598, CANVAS_WIDTH, 2)

  leftPaddle.draw()
  rightPaddle.draw()
  ball.draw()
  scoreboard.draw()
  tooltip.draw()
}
