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

  board.forEach((row, rowIndex) => {
    row.forEach((square, colIndex) => {
      const squareElement = document.createElement("div");
      squareElement.classList.add(
        "square",
        (rowIndex + colIndex) % 2 === 0 ? "light" : "dark"
      );
      squareElement.dataset.row = rowIndex;
      squareElement.dataset.col = colIndex;

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
            sourceSquare = { row: rowIndex, col: colIndex };
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
  console.log("I got role:", role);
  renderBoard();
});

// socket.on("spectatorRole", () => {
//   playerRole = null;
//   console.log("I'm a spectator");
//   renderBoard();
// });

socket.on("boardState", (fen) => {
  chess.load(fen || undefined);
  console.log("Loaded FEN:", fen);
  renderBoard();
  checkGameStatus();
});

socket.on("move", (move) => {
  console.log("Received move:", move);
  const result = chess.move(move);
  console.log("Move result:", result);
  renderBoard();
  checkGameStatus();
});

const checkGameStatus = () => {
  if (chess.game_over()) {
    console.log("Game is over. Checking status...");
    if (chess.in_checkmate()) {
      const winner = chess.turn() === "w" ? "Black" : "White";
      console.log("Checkmate detected. Winner:", winner);
      setTimeout(() => {
        alert(`${winner} wins by checkmate!`);
      }, 100);
    } else if (chess.in_draw()) {
      console.log("Draw detected");
      setTimeout(() => {
        alert("Game ends in a draw!");
      }, 100);
    } else if (chess.in_stalemate()) {
      console.log("Stalemate detected");
      setTimeout(() => {
        alert("Game ends in a stalemate!");
      }, 100);
    }
  }
};

const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", () => {
  socket.emit("reset-game");
});

socket.on("reset-game", () => {
  chess.reset();
  console.log("Game reset");
  renderBoard();
});

chess.reset();
renderBoard();
