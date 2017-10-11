var CANVAS_WIDTH = 800
var CANVAS_HEIGHT = 800
var FPS = 6

var direction = 'up'
var prevDir = 'up'

var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')

function Node (x, y) {
  this.x = x
  this.y = y
  this.next = null
}

var snake = {
  head: new Node(20, 20),
  collided: false,
  toAppend: 0,

  update: function () {
    var tmpx1 = this.head.x
    var tmpy1 = this.head.y

    if (direction === 'up') {
      this.head.y = (this.head.y + 39) % 40
      prevDir = 'up'
    } else if (direction === 'down') {
      this.head.y = (this.head.y + 1) % 40
      prevDir = 'down'
    } else if (direction === 'left') {
      this.head.x = (this.head.x + 39) % 40
      prevDir = 'left'
    } else {
      this.head.x = (this.head.x + 1) % 40
      prevDir = 'right'
    }

    if (this.head.next !== null) {
      var curNode = this.head.next
      while (curNode.next != null) {
        var tmpx2 = curNode.x
        var tmpy2 = curNode.y
        curNode.x = tmpx1
        curNode.y = tmpy1
        tmpx1 = tmpx2
        tmpy1 = tmpy2
        curNode = curNode.next
      }
      curNode.x = tmpx1
      curNode.y = tmpy1
    }

    this.checkCollision()
    this.hasEaten()
    if (this.toAppend > 0) {
      this.append()
      this.toAppend --
    }
  },

  append: function () {
    var curNode = this.head
    while (curNode.next != null) {
      curNode = curNode.next
    }
    var endNode = new Node(curNode.x, curNode.y)
    curNode.next = endNode
  },

  checkCollision: function () {
    var curNode = this.head
    while (curNode.next !== null) {
      curNode = curNode.next
      if (curNode.x === this.head.x && curNode.y === this.head.y) {
        scoreboard.reset()
        this.head.next = null
      }
    }
  },

  // TODO: refine this logic
  hasEaten: function () {
    if (this.head.x === food.x && this.head.y === food.y) {
      this.toAppend += 3
      scoreboard.addPoint()
      var newX = Math.floor(Math.random() * 40)
      var newY = Math.floor(Math.random() * 40)
      var curNode = this.head
      while (curNode.next !== null) {
        if (curNode.x === newX && curNode.y === newY) {
          curNode = this.head
          newX = Math.floor(Math.random() * 40)
          newY = Math.floor(Math.random() * 40)
        }
        curNode = curNode.next
      }
      food.setLocation(newX, newY)
    }
  },

  draw: function () {
    context.fillStyle = '#fff'
    var curNode = this.head
    while (curNode.next != null) {
      context.fillRect(curNode.x * 20, curNode.y * 20, 20, 20)
      curNode = curNode.next
    }
    context.fillRect(curNode.x * 20, curNode.y * 20, 20, 20)
  }
}

var food = {
  x: 10,
  y: 10,

  setLocation: function (x, y) {
    this.x = x
    this.y = y
  },

  draw: function () {
    context.fillStyle = '#fff'
    context.fillRect(this.x * 20, this.y * 20, 20, 20)
  }
}

var scoreboard = {
  points: 0,

  reset: function () {
    this.points = 0
  },

  addPoint: function () {
    this.points ++
  },

  draw: function () {
    context.fillStyle = '#000'
    context.font = '40px Courier'
    context.fillText(this.points, 381, 41)
    context.fillStyle = '#fff'
    context.font = '40px Courier'
    context.fillText(this.points, 380, 40)
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
      context.fillText('   up: move up', 25, 30)
      context.fillText(' down: move down', 25, 50)
      context.fillText(' left: move left', 25, 70)
      context.fillText('right: move right', 25, 90)
      context.fillText('    h: toggle help', 25, 110)
    }
  }
}

function update () {
  snake.update()
}

function draw () {
  context.beginPath()
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  snake.draw()
  food.draw()
  scoreboard.draw()
  tooltip.draw()
}

window.onkeydown = function (e) {
  var key = e.keyCode ? e.keyCode : e.which
  // up: move up
  if (key === 38 && prevDir !== 'down') {
    direction = 'up'
  // down: move down
  } else if (key === 40 && prevDir !== 'up') {
    direction = 'down'
  // left: move left
  } else if (key === 37 && prevDir !== 'right') {
    direction = 'left'
  // right: move right
  } else if (key === 39 && prevDir !== 'left') {
    direction = 'right'
  }
}

window.onkeyup = function (e) {
  var key = e.keyCode ? e.keyCode : e.which
  // h: toggle help
  if (key === 72) {
    tooltip.toggle()
    draw()
  }
}

// main loop
setInterval(function () {
  update()
  draw()
}, 1000 / FPS)
