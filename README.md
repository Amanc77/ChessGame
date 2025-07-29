# ♟️ Simple Chess Game

A real-time multiplayer chess game built using **HTML**, **CSS**, **JavaScript**, and **Socket.IO**, with drag-and-drop functionality and game state sync between players.

## 🔗 Live Demo

- 🔴 **Live Game**: [https://symplechessgame.onrender.com](https://symplechessgame.onrender.com)
- 📁 **GitHub Repo**: [https://github.com/Amanc77/ChessGame](https://github.com/Amanc77/ChessGame)
- 🎥 **Video Demo**: [https://youtu.be/IzCrQouhiDQ](https://youtu.be/IzCrQouhiDQ)

---

## 🎮 How to Play

### 👥 Play with Two Players

Open the live game link:  
[https://symplechessgame.onrender.com](https://symplechessgame.onrender.com)

- The **first browser tab** to open the link will be assigned **White** pieces.
- The **second tab** or a new device opening the same link will be assigned **Black** pieces.

- Move pieces by **drag and drop**.
- The board will update in **real-time** for both players.
- Use the **Reset Game** button to restart the game anytime.

> ⚠️ Keep both tabs/windows open to simulate multiplayer mode.  
> You can also share the live link with a friend to play remotely.

---

## 🧩 Features

- 🔁 Real-time multiplayer gameplay using **Socket.IO**
- 🎯 Drag-and-drop chess moves using mouse
- 📱 Fully responsive and mobile-friendly design
- ♜ Dark wooden board theme
- ❗ Alerts on **checkmate**, **stalemate**, and **draw**
- 🔄 "Reset Game" button to restart anytime

---

## ⚙️ Prerequisites

- Node.js & npm
- A backend server (like Express)

---

## 🚀 Installation

```bash
# Clone the repo
git clone https://github.com/Amanc77/ChessGame.git
cd ChessGame

# Install dependencies
npm install
```

---

## 📁 Project Structure

```
public/
├── css/
│   └── style.css
├── images/
│   ├── pieces/          # All chess piece images (wp.png, bp.png, etc.)
│   ├── boards/          # Wooden board textures
│   └── chess.png        # Favicon
├── js/
│   ├── chessgame.js     # Client-side game logic
│   └── chess.min.js     # Chess rules engine (from CDN)
index.html               # Game page
```

---

## ▶️ Run the App

```bash
node app.js
```

Then open in your browser:  
📍 [http://localhost:3000](http://localhost:3000)

---

## 🎮 How to Play

1. Open the game in your browser.
2. Players are auto-assigned white or black.
3. Drag and drop pieces to move.
4. Click **Reset Game** to restart the board.
5. The board updates in real-time for all connected users.

---

## 🛠️ Tech Stack

- **JavaScript**, **HTML**, **CSS**
- **chess.js** for move validation
- **Socket.IO** for real-time sync
- **Express.js** for serving files
- **Tailwind CSS** (optional CDN in dev)

---

## 🤝 Contributing

Pull requests and suggestions are welcome!  
Feel free to fork this repo and improve the game further.

---
