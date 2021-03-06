"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    board[y] = [];
    for (let x = 0; x < WIDTH; x++) {
      board[y][x] = null;
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // creating the top row could be its own function: createTopRow()
  const htmlBoard = document.getElementById("board");

  // create top row <tr> container and add eventlistener
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // dynamically creates the main part of html board
  // uses HEIGHT to create table rows
  // uses WIDTH to create table cells for each row
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");

    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");

      cell.setAttribute("id", `${y}-${x}`);

      row.append(cell);
    }

    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return bottom empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (board[y][x] === null) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place appropriate color piece into HTML table of board */

function placeInTable(y, x) {
  const piece = document.createElement("div");
  piece.classList.add("piece", `p${currPlayer}`);

  const currCell = document.getElementById(`${y}-${x}`);
  currCell.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  setTimeout(function () {
    alert(msg);
  }, 100);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);

  if (y === null) {
    return;
  }

  // update in-memory board with currPlayer value
  board[y][x] = currPlayer;
  console.log(board);
  // place piece in HTML
  placeInTable(y, x);

  // check for win condtion prior to tie
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie - if top row of game board is filled
  if (board[0].every((cell) => cell !== null)) {
    endGame("It's a tie");
  }

  // switch players
  currPlayer === 1 ? (currPlayer = 2) : (currPlayer = 1);
  // replace conditional with tertiary
  //
  // if (currPlayer === 1) {
  //   currPlayer = 2;
  // } else {
  //   currPlayer = 1;
  // }
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  /** _win:
   * takes input array of 4 cell coordinates [ [y, x], [y, x], [y, x], [y, x] ]
   * returns true if all are legal coordinates for a cell & all cells match
   * currPlayer
   */

  function _win(cells) {
    //better solution for _win()

    // [y, x] variables is more elegant and less hacky that cell[0] cell[1]

    return cells.every(
      ([y, x]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer
    );
    // return cells.every(
    //   (cell) =>
    //     cell[0] >= 0 &&
    //     cell[0] < HEIGHT &&
    //     cell[1] >= 0 &&
    //     cell[1] < WIDTH &&
    //     board[cell[0]][cell[1]] === currPlayer
    // );
  }

  // code below for legaMoves and sameColors replaced by combined Array.every above

  // function legalMoves(cells) {
  //   for (let i = 0; i < cells.length; i++) {
  //     if (cells[i][0] > HEIGHT - 1 || cells[i][1] > WIDTH || cells[i][1] < 0) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  // function sameColors(cells) {
  //   return cells.every(([y, x]) => board[y][x] === currPlayer);

  //   // let player = [];

  //   // for(let i = 0; i < cells.length; i++){

  //   //   player.push(board[cells[i][0]][cells[i][1]]);
  //   // }

  //   // //  cells[i][0] cells[i][1]       //not sure why this doesnt work within .every()

  //   // return(player.every(num => num === player[0]));
  // }

  // return legalMoves(cells) && sameColors(cells);
  // }

  // using HEIGHT and WIDTH, generate "check list" of coordinates
  // for 4 cells (starting here) for each of the different
  // ways to win: horizontal, vertical, diagonalDR, diagonalDL
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      let vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      let diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];
      let diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
