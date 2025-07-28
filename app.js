import express from "express";
import { Server as SocketServer } from "socket.io";
import { inject } from "@vercel/analytics";
import http from "http";
import { Chess } from "chess.js";
import path from "path";
import { fileURLToPath } from "url";
import { injectSpeedInsights } from "@vercel/speed-insights";

// Analytics
injectSpeedInsights();
inject();

// Setup for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express and server setup
const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

// Chess instance and player store
let chess = new Chess();
let players = {};

// View and static setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Route
app.get("/", (req, res) => {
  res.render("index", { title: "Chess Game" });
});

// Socket logic
io.on("connection", (uniqueSocket) => {
  console.log("User connected:", uniqueSocket.id);

  // Assign player roles
  if (!players.white) {
    players.white = uniqueSocket.id;
    uniqueSocket.emit("playerRole", "w");
  } else if (!players.black) {
    players.black = uniqueSocket.id;
    uniqueSocket.emit("playerRole", "b");
  } else {
    uniqueSocket.emit("spectatorRole");
  }

  // Handle disconnection
  uniqueSocket.on("disconnect", () => {
    if (uniqueSocket.id === players.white) {
      delete players.white;
    } else if (uniqueSocket.id === players.black) {
      delete players.black;
    }
  });

  // Handle chess moves
  uniqueSocket.on("move", (move) => {
    try {
      if (chess.turn() === "w" && uniqueSocket.id !== players.white) return;
      if (chess.turn() === "b" && uniqueSocket.id !== players.black) return;
      const result = chess.move(move);

      if (result) {
        io.emit("move", move);
        io.emit("boardState", chess.fen());
      } else {
        console.log("Invalid move:", move);
        uniqueSocket.emit("invalidMove", move);
      }
    } catch (err) {
      console.log(err);
      uniqueSocket.emit("invalidMove", move);
    }
  });

  // Handle game reset
  uniqueSocket.on("reset-game", () => {
    console.log("Resetting game...");
    chess = new Chess(); // Reset chess game state
    io.emit("reset-game"); // Notify all clients
    io.emit("boardState", chess.fen()); // Send fresh FEN to update UI immediately
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// Start server
server.listen(3000, () => {
  console.log("listening on port 3000");
});
