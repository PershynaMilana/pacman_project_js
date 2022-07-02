import TileMap from "./TileMap.js";

const tileSize = 32;
const velocity = 2;
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileMap = new TileMap(tileSize);
const pacman = tileMap.getPacman(velocity);
const enemies = tileMap.getEnemies(velocity);
let gameOver = false;
let gameWin = false;

function gameLoop() {
  tileMap.draw(ctx);
  drawGameEnd();
  pacman.draw(ctx, pause(), enemies);
  enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
  checkGameOver();
  checkGameWin();
}

function checkGameWin() {
  if (!gameWin) {
    gameWin = tileMap.didWin();
  }
}

function checkGameOver() { 
  if (!gameOver) {
    gameOver = isGameOver();
  }
}

function isGameOver() {
  if (!localStorage.getItem('bestscore')) {
    pacman.bestscore = pacman.score;
    localStorage.setItem('bestscore', pacman.bestscore);
  }
  else {
    let bscore = localStorage.getItem('bestscore');
    if (bscore < pacman.score) {
      localStorage.setItem('bestscore', pacman.score);
    }
  }
  return enemies.some((enemy) => !pacman.powerDotActive && enemy.collideWith(pacman));
}

function pause() {
  return !pacman.madeFirstMove || gameOver || gameWin;
}

function drawGameEnd() {
  if (gameOver || gameWin) {
    let text = "You Win!";
    let text2 = "Press space to restart";
    if (gameOver) {
      text = "Game Over!";
    }
    ctx.fillStyle = "rgba(192, 190, 237, 0.3)";
    ctx.fillRect(0, canvas.height / 3.7, canvas.width, 200);
    ctx.font = "45px Impact, fantasy";
    ctx.fillStyle = "yellow";
    ctx.shadowColor = "black";
    ctx.shadowOffsetX = 6;
    ctx.shadowOffsetY = 6;
    ctx.fillText(text, 110, canvas.height / 2.5);
    ctx.fillText(text2, 15, 270);
  }
}

tileMap.setCanvasSize(canvas);
setInterval(gameLoop, 1000 / 75);