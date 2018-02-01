/* State */


function Square () {
  this.value = 0;
  this.combined = false;
}


function Board (size) {
  this.size = size;
  this.arr = new Array(size);
  for (var i = 0; i < size; i++) {
    this.arr[i] = new Array(size);
    for (var j = 0; j < size; j++) {
      this.arr[i][j] = new Square();
    }
  }
}

Board.prototype.copy = function (board) {
  for (var i = 0; i < this.size; i++) {
    for (var j = 0; j < this.size; j++) {
      this.arr[i][j].value = board.getValue(i, j);
    }
  }
};

Board.prototype.getSquare = function (i, j) {
  return this.arr[i][j];
};

Board.prototype.getValue = function (i, j) {
  return this.arr[i][j].value;
};

Board.prototype.setValue = function (i, j, val) {
  this.arr[i][j].value = val;
};

Board.prototype.equals = function (board) {
  for (var i = 0; i < this.size; i++) {
    for (var j = 0; j < this.size; j++) {
      if (this.getValue(i, j) != board.getValue(i, j)) { return false; }
    }
  }
  return true;
};


var State = {
  size: 4,
  score: 0,
  validMoveExists: true,

  reset: function () {
    if (this.getHighScore() === null) { this.setHighScore(0); }
    this.score = 0;
    this.validMoveExists = true;
    this.board = new Board(this.size);
    Logic.addSquare();
  },

  getSquare: function (i, j) {
    return this.board.getSquare(i, j);
  },

  getValue: function (i, j) {
    return this.board.getValue(i, j);
  },

  setValue: function (i, j, val) {
    this.board.setValue(i, j, val);
  },

  incrementScore: function (score) {
    this.score += score;
    if (parseInt(this.getHighScore(), 10) < this.score) { this.setHighScore(this.score); }
  },

  getHighScore: function () {
    return localStorage.getItem('high_score');
  },

  setHighScore: function (score) {
    localStorage.setItem('high_score', score.toString());
  },
    
  print: function () {
    console.log('score: ' + this.score); 
    for (var i = 0; i < this.size; i++) {
      var myStr = '';
      for (var j = 0; j < this.size; j++) {
        if (this.getValue(i, j) != 0) { myStr += this.getValue(i, j) + ' '; }
        else { myStr += '. '; }
      }
      console.log(myStr);
    }
  console.log('');
  }
};


/* Logic */


var Logic = {
  reset: function () {
    State.reset();
  },

  step: function (direction) {
    var tmp = new Board(State.size);
    tmp.copy(State.board);
    State.incrementScore(this.move(direction, State.board));
    if (!tmp.equals(State.board)) {
      this.addSquare();
      State.print();  
      if (!this.validMoveExists()) {
        State.validMoveExists = false;
        State.print();  
      }
      return true;
    }
    return false;
  },

  move: function (direction, board) {
    var score = 0;
    for (var pass = 0; pass < State.size - 1; pass++) {
      for (var n = 0; n < State.size; n++) {
        if (direction === 'l') {
          for (var j = 0; j < State.size - 1; j++) {
            score += this.combine(n, j, 0, 1, board);
          }
        } else if (direction === 'r') {
          for (var j = State.size - 1; j > 0; j--) {
            score += this.combine(n, j, 0, -1, board);
          }
        } else if (direction === 'u') {
          for (var i = 0; i < State.size - 1; i++) {
            score += this.combine(i, n, 1, 0, board);
          }
        } else {
          for (var i = State.size - 1; i > 0; i--) {
            score += this.combine(i, n, -1, 0, board);
          }
        }
      }
    }
    this.resetCombined();
    return score;
  },

  combine: function (i, j, di, dj, board) {
    var score = 0;
    var cur = board.getSquare(i, j);
    var adj = board.getSquare(i + di, j + dj);
    if (cur.value === 0) {
      cur.value = adj.value;
      adj.value = 0;
    } else if (cur.value === adj.value && !cur.combined && !adj.combined) {
      cur.value *= 2;
      score += cur.value; 
      adj.value = 0;
      cur.combined = true;
    } 
    return score;
  },

  resetCombined: function () {
    for (var i = 0; i < State.size; i++) {
      for (var j = 0; j < State.size; j++) {
        State.getSquare(i, j).combined = false;
      }
    }
  },

  validMoveExists: function () {
    var tmp1 = new Board(State.size);
    var tmp2 = new Board(State.size);
    tmp1.copy(State.board);
    tmp2.copy(State.board);
    this.move('l', tmp1);
    if (!tmp1.equals(tmp2)) { return true; }
    this.move('u', tmp1);
    if (!tmp1.equals(tmp2)) { return true; }
    this.move('r', tmp1);
    if (!tmp1.equals(tmp2)) { return true; }
    this.move('d', tmp1);
    if (!tmp1.equals(tmp2)) { return true; }
    return false;
  },

  addSquare: function () {
    var filled = false;
    var ct = 0;
    while (!filled && ct < 10000) {
      var i = Math.floor(Math.random() * State.size);
      var j = Math.floor(Math.random() * State.size);
      if (State.getValue(i, j) === 0) {
        if (Math.random() < 0.75) {
          State.setValue(i, j, 2);
        } else {
          State.setValue(i, j, 4);
        }
        filled = true;
      }
      ct ++;
    }
  }
};


/* Graphics */


var context = document.getElementById('canvas').getContext('2d');
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 800;
var border = 10;


function draw () {
  context.fillStyle = '#888';
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  var px = (CANVAS_WIDTH - ((State.size + 1) * border)) / State.size;

  for (var i = 0; i < State.size; i++) {
    for (var j = 0; j < State.size; j++) {
      if (State.getValue(i, j) > 0) {
        context.fillStyle = '#000';
        context.fillRect((j + 1) * 10 + j * px, (i + 1) * border + i * px, px, px);
        context.fillStyle = 'rgba(255, ' + (240 - 15 * Math.log2(State.getValue(i, j))).toString() + ', ' + (230 - 10 * Math.log2(State.getValue(i, j))).toString() + ', 1)';
        context.fillRect((j + 1) * 10 + j * px + 2, (i + 1) * border + i * px + 2, px - 4, px - 4);
        context.fillStyle = '#000';
        context.font = '32px Courier';
        context.textAlign = 'center';
        context.fillText(State.getValue(i, j).toString(), (j + 1) * 10 + (j + 0.5) * px, (i + 1) * border + (i + 0.55) * px);
      }
    }
  }

  if (!State.validMoveExists) {
    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.fillStyle = '#000';
    context.font = '40px Courier';
    context.fillText('Game over.', CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.4);
    context.fillText('Press r to restart.', CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.6);
  }

  document.getElementById('score').innerHTML = 'Current: ' + State.score.toString() + '&nbsp&nbsp&nbsp&nbsp High: ' + State.getHighScore();
}


/* Input */


var upPressed = false;
var downPressed = false;
var leftPressed = false;
var rightPressed = false;
var rPressed = false;

window.onkeydown = function (e) {
  var update = false;
  var key = e.keyCode ? e.keyCode : e.which;
  if (key === 37 && !leftPressed) { 
    update = Logic.step('l');
    leftPressed = true;
  } else if (key === 38 && !upPressed) {
    update = Logic.step('u');
    upPressed = true;
  } else if (key === 39 && !rightPressed) {
    update = Logic.step('r');
    rightPressed = true;
  } else if (key === 40 && !downPressed) {
    update = Logic.step('d');
    downPressed = true;
  } else if (key === 82 && !rPressed) {
    update = true;
    rPressed = true;
    Logic.reset();
  }
  if (update) { draw(); } 
};

window.onkeyup = function (e) {
  var key = e.keyCode ? e.keyCode : e.which;
  if (key == 37) { leftPressed = false; } 
  else if (key === 38) { upPressed = false; } 
  else if (key === 39) { rightPressed = false; } 
  else if (key === 40) { downPressed = false; }
  else if (key === 82) { rPressed = false; }
};


/* Initialization */


State.reset();
State.print();
draw();
