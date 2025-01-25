let legalSquares = [];

const boardSquares = document.getElementsByClassName("square");
const pieces = document.getElementsByClassName("piece");

const piecesImages = document.getElementsByTagName("img");

function setupBoardSquares() {
  boardSquares[i].addEventListener("dragover", allowDrop);
  boardSquares[i].addEventListener("drop", drop);

  let row = 8 - Math.floor(i / 8);
  let column = String.fromCharCode(97 + (i % 8));
}
