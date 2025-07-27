const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const pieceMap = {
  p: "bp",
  r: "br",
  n: "bn",
  b: "bb",
  q: "bq",
  k: "bk",
  P: "wp",
  R: "wr",
  N: "wn",
  B: "wb",
  Q: "wq",
  K: "wk",
};

const renderBoard = () => {
  const board = chess.board();
  boardElement.innerHTML = "";

  const displayRows = playerRole === "b" ? [...board].reverse() : board;

  displayRows.forEach((row, rowIndex) => {
    const displayCols = playerRole === "b" ? [...row].reverse() : row;

    displayCols.forEach((square, colIndex) => {
      const actualRow = playerRole === "b" ? 7 - rowIndex : rowIndex;
      const actualCol = playerRole === "b" ? 7 - colIndex : colIndex;

      const squareElement = document.createElement("div");
      squareElement.classList.add(
        "square",
        (actualRow + actualCol) % 2 === 0 ? "light" : "dark"
      );
      squareElement.dataset.row = actualRow;
      squareElement.dataset.col = actualCol;

      if (square) {
        const pieceElement = document.createElement("div");
        pieceElement.classList.add(
          "piece",
          square.color === "w" ? "white" : "black"
        );

        const pieceImg = document.createElement("img");
        pieceImg.src = `/images/pieces/${
          pieceMap[
            square.color === "w"
              ? square.type.toUpperCase()
              : square.type.toLowerCase()
          ]
        }.png`;
        pieceImg.alt = square.type;
        pieceImg.classList.add(
          "w-full",
          "h-full",
          "object-contain",
          "pointer-events-none"
        );

        pieceElement.appendChild(pieceImg);
        pieceElement.draggable = playerRole === square.color;

        pieceElement.addEventListener("dragstart", (e) => {
          if (pieceElement.draggable) {
            draggedPiece = pieceElement;
            sourceSquare = { row: actualRow, col: actualCol };
            e.dataTransfer.setData("text/plain", "");
          }
        });

        pieceElement.addEventListener("dragend", () => {
          draggedPiece = null;
          sourceSquare = null;
        });

        squareElement.appendChild(pieceElement);
      }

      squareElement.addEventListener("dragover", (e) => e.preventDefault());

      squareElement.addEventListener("drop", (e) => {
        e.preventDefault();
        if (draggedPiece) {
          const targetSquare = {
            row: parseInt(squareElement.dataset.row),
            col: parseInt(squareElement.dataset.col),
          };
          handleMove(sourceSquare, targetSquare);
        }
      });

      boardElement.appendChild(squareElement);
    });
  });

  boardElement.classList.toggle("flipped", playerRole === "b");
};

const handleMove = (source, target) => {
  const move = {
    from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
    to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
  };

  const piece = chess.get(move.from);
  if (piece?.type === "p" && (move.to[1] === "8" || move.to[1] === "1")) {
    move.promotion = "q";
  }

  socket.emit("move", move);
};

socket.on("playerRole", (role) => {
  playerRole = role;
  renderBoard();
});

socket.on("spectatorRole", () => {
  playerRole = null;
  renderBoard();
});

socket.on("boardState", (fen) => {
  chess.load(fen || undefined);
  renderBoard();
});

socket.on("move", (move) => {
  chess.move(move);
  renderBoard();
});

chess.reset();
renderBoard();
