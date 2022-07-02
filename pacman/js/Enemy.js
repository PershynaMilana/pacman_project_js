import MovingDirection from "./MovingDirection.js";

export default class Enemy {
  constructor(x, y, tileSize, velocity, tileMap) {
    this.x = x; //размещение по х
    this.y = y; //размещение по y
    this.tileSize = tileSize; //размер клетки
    this.velocity = velocity; // скорость привидения
    this.tileMap = tileMap; // прорисовка карты
    this.#loadImages(); // прогрузка картинок
    this.movingDirection = Math.floor(Math.random() * Object.keys(MovingDirection).length); //рандомное направление привидения
    this.directionTimerDefault = this.#random(10, 25); //переменные для анимации испуганного привидения
    this.directionTimer = this.directionTimerDefault;
    this.scaredAboutToExpireTimerDefault = 10;
    this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
  }

  draw(ctx, pause, pacman) { //прорисовка привидений 
    if (!pause) {
      this.#move();
      this.#changeDirection();
    }
    this.#setImage(ctx, pacman);
  }

  collideWith(pacman) { //столкновение с пакманом
    const size = this.tileSize / 2;
    if (this.x < pacman.x + size && this.x + size > pacman.x && this.y < pacman.y + size && this.y + size > pacman.y) {
      return true;
    } else {
      return false;
    }
  }

  #setImage(ctx, pacman) { //привидения становятся слабыми если пакман съел розовую точку
    if (pacman.powerDotActive) {
      this.#setImageWhenPowerDotIsActive(pacman);
    } else {
      this.image = this.normalGhost;
    }
    ctx.drawImage(this.image, this.x, this.y, this.tileSize, this.tileSize);
  }

  #setImageWhenPowerDotIsActive(pacman) { // смена картинки привидения когда они напуганы
    if (pacman.powerDotAboutToExpire) {
      this.scaredAboutToExpireTimer--;
      if (this.scaredAboutToExpireTimer === 0) {
        this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
        if (this.image === this.scaredGhost) {
          this.image = this.scaredGhost2;
        } else {
          this.image = this.scaredGhost;
        }
      }
    } else {
      this.image = this.scaredGhost;
    }
  }

  #changeDirection() { //смена направлений движения
    this.directionTimer--;
    let newMoveDirection = null;
    if (this.directionTimer == 0) {
      this.directionTimer = this.directionTimerDefault;
      newMoveDirection = Math.floor(Math.random() * Object.keys(MovingDirection).length);
    }
    if (newMoveDirection != null && this.movingDirection != newMoveDirection) {
      if (Number.isInteger(this.x / this.tileSize) && Number.isInteger(this.y / this.tileSize)) {
        if (!this.tileMap.didCollideWithEnvironment(this.x, this.y, newMoveDirection)) {
          this.movingDirection = newMoveDirection;
        }
      }
    }
  }

  #move() { //движение
    if (!this.tileMap.didCollideWithEnvironment(this.x, this.y, this.movingDirection)) {
      switch (this.movingDirection) {
        case MovingDirection.up:
          this.y -= this.velocity;
          break;
        case MovingDirection.down:
          this.y += this.velocity;
          break;
        case MovingDirection.left:
          this.x -= this.velocity;
          break;
        case MovingDirection.right:
          this.x += this.velocity;
          break;
      }
    }
  }

  #random(min, max) { //генератор рандомного числа для установки рандомного направления 
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  #loadImages() { //прогрузка картинок привидений 
    this.normalGhost = new Image();
    this.normalGhost.src = "img/red_ghost.png";
    this.scaredGhost = new Image();
    this.scaredGhost.src = "img/scaredGhost.png";
    this.scaredGhost2 = new Image();
    this.scaredGhost2.src = "img/scaredGhost2.png";
    this.image = this.normalGhost;
  }
}