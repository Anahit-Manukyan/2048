var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var sizeInput = document.getElementById('size'); 
var scoreLabel = document.getElementById('score');
var score = 0; // default score- 0
var size = 4; // matrix size (here- 4x4)
var width = canvas.width / size - 6.5;
var cells = [];
var fontSize = width / 2;
var loss = false;

startGame();


function cell(row, coll) { // create a cell, at the beginning assigning value to 0 
  this.value = 0;
  this.x = coll * width + 5 * (coll + 1); // the with of the free space inside the columns
  this.y = row * width + 5 * (row + 1); // the with of the free space inside the rows 
}

function createCells() {
  for(let i = 0; i < size; i++) {
    cells[i] = [];
    for(let j = 0; j < size; j++) {
      cells[i][j] = new cell(i, j);
    }
  }
}

function drawCell(cell) {
  ctx.beginPath(); //method is called before beginning each line, which helps to drow in different colors
  ctx.rect(cell.x, cell.y, width, width); // width = height 
  switch (cell.value){ // for each number give a color 
    case 0 : ctx.fillStyle = '#D689B5'; break;
    case 2 : ctx.fillStyle = '#723FBF'; break;
    case 4 : ctx.fillStyle = '#3F68BF'; break;
    case 8 : ctx.fillStyle = '#5286C5'; break;
    case 16 : ctx.fillStyle = '#8B61DB'; break;
    case 32 : ctx.fillStyle = '#853769'; break;
    case 64 : ctx.fillStyle = '#4593A5'; break;
    case 128 : ctx.fillStyle = '#9764AF'; break;
    case 256 : ctx.fillStyle = '#5286C5'; break;
    case 512 : ctx.fillStyle = '#723FBF'; break;
    case 1024 : ctx.fillStyle = '#D2691E'; break;
    case 2048 : ctx.fillStyle = '#9C30CE'; break;
    case 4096 : ctx.fillStyle = '#9F418E'; break;
    default : ctx.fillStyle = '#723FBF';
  }
  ctx.fill(); // fills the current drawing
  if (cell.value) {
    ctx.font = fontSize + 'px Arial'; 
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center'; // write the numbers in the center 
    ctx.fillText(cell.value, cell.x + width / 2, cell.y + width / 2 + width/7);
  }
}

function canvasClean() {
  ctx.clearRect(0, 0, 500, 500);
  // erases the pixels in a rectangular area by setting them to transparent black
}

document.onkeydown = function (event) { // create the click events for the keys up, right, down and left 
  if (!loss) {
    if (event.keyCode === 38) {
      moveUp(); 
    } else if (event.keyCode === 39) {
      moveRight();
    } else if (event.keyCode === 40) {
      moveDown(); 
    } else if (event.keyCode === 37) {
      moveLeft(); 
    }
    scoreLabel.innerHTML = 'Score : ' + score; // after each click update the score
  }
}

function startGame() { 
// start the game by calling the following functions, in order to create the cells with their color and at the beginning start with 2 numbers
  createCells();
  drawAllCells();
  pasteNewCell();
  pasteNewCell();
}

function finishGame() { 
  loss = true;
}

function drawAllCells() { // draw the cells of the matrix by their specific color- by using drawCell function 
  for(let i = 0; i < size; i++) {
    for(let j = 0; j < size; j++) {
      drawCell(cells[i][j]);
    }
  }
}

function pasteNewCell() {
  var countFree = 0;
  for(let i = 0; i < size; i++) { // considering the matrix (rows and columns)
    for(let j = 0; j < size; j++) {
      if(!cells[i][j].value) { 
        countFree++; // find the empty cells and calculate their number
      }
    }
  }
  if(!countFree) { // if there does not exist a free cell => end game 
    finishGame();
    alert('GAME OVER!!'); 
    return;
  }
  while(true) {
    var row = Math.floor(Math.random() * size); // take a random row
    var coll = Math.floor(Math.random() * size); // take a random column
    if(!cells[row][coll].value) { // if the place is empty 
      cells[row][coll].value = 2 * Math.ceil(Math.random() * 2); // assign value to 2 or to 4
      drawAllCells(); // draw it with its specific color 
      return;
    }
  }
}

function moveLeft() {
  for(let i = 0; i < size; i++) {
    for(let j = 1; j < size; j++) {
      if(cells[i][j].value) { // if the cell is not empty
        while (j - 1 >= 0) { // go left with all the values
          if (!cells[i][j - 1].value) { // the the values does not exist
            cells[i][j - 1].value = cells[i][j].value; // move the value to the free cell
            cells[i][j].value = 0; // and set the existing to 0 (make it free)
            j--; // do it for all the column
          } else if (cells[i][j].value == cells[i][j - 1].value) { // if the adjucent cells have the same value
            cells[i][j - 1].value *= 2; // the left value increases two times and the fixed value becomes 0 
            score +=   cells[i][j - 1].value; // score increases by the value 
            cells[i][j].value = 0; // set the existing to 0 (make it free)
            break;
          } else {
            break; 
          }
        }
      }
    }
  }
  pasteNewCell(); // add a random cell with a value 2 or 4
}

// same logic as in the moveLeft by changing the direction 

function moveRight () {
  for(let i = 0; i < size; i++) {
    for(let j = size - 2; j >= 0; j--) {
      if(cells[i][j].value) {
        while (j + 1 < size) {
          if (!cells[i][j + 1].value) {
            cells[i][j + 1].value = cells[i][j].value;
            cells[i][j].value = 0;
            j++;
          } else if (cells[i][j].value == cells[i][j + 1].value) {
            cells[i][j + 1].value *= 2;
            score +=  cells[i][j + 1].value;
            cells[i][j].value = 0;
            break;
          } else {
            break;
          }
        }
      }
    }
  }
  pasteNewCell();
}

function moveUp() {
  for(let j = 0; j < size; j++) {
    for(let i = 1; i < size; i++) {
      if(cells[i][j].value) {
        while (i > 0) {
          if(!cells[i - 1][j].value) {
            cells[i - 1][j].value = cells[i][j].value;
            cells[i][j].value = 0;
            i--;
          } else if (cells[i][j].value == cells[i - 1][j].value) {
            cells[i - 1][j].value *= 2;
            score +=  cells[i - 1][j].value;
            cells[i][j].value = 0;
            break;
          } else {
            break; 
          }
        }
      }
    }
  }
  pasteNewCell();
}

function moveDown() {
  for(let j = 0; j < size; j++) {
    for(let i = size - 2; i >= 0; i--) {
      if(cells[i][j].value) {
        while (i + 1 < size) {
          if (!cells[i + 1][j].value) {
            cells[i + 1][j].value = cells[i][j].value;
            cells[i][j].value = 0;
            i++;
          } else if (cells[i][j].value == cells[i + 1][j].value) {
            cells[i + 1][j].value *= 2;
            score +=  cells[i + 1][j].value;
            cells[i][j].value = 0;
            break;
          } else {
            break; 
          }
        }
      }
    }
  }
  pasteNewCell();
}



