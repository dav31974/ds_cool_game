import { Sitting, Running, Jumping, Falling, Rolling } from './playerStates.js';

export class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;         // vertical speed
        this.maxVy = 24;     // max vertical speed
        this.weight = 0.5;     // vertical weight gravity
        this.image = document.getElementById('player');
        this.frameX = 0;      // horizontal frame of picture
        // this.maxFrame = 4     // innit max frame to sitting line (x) of picture (not necessary) 
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.frameY = 0;      // vertical frame of picture
        this.speed = 0;      // horizontal speed
        this.maxSpeed = 5;  // horizontal max speed
        this.states = [new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game)];
    }

    update(input, deltaTime) {
        this.checkCollision();
        this.currentState.handleInput(input);
        // Horizontal movement ------------------
        this.x += this.speed;
        if (input.includes('ArrowRight')) this.speed = this.maxSpeed;
        else if (input.includes('ArrowLeft')) this.speed = -this.maxSpeed;
        else this.speed = 0;
        // horizontal limits
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        else if (this.x <= 0) this.x = 0;
        // Vertical movement ---------------------
        this.y += this.vy;
        if (!this.onGround()) this.vy += this.weight;
        else this.vy = 0;
        // Sprite animations ----------------------
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
    }

    draw(context) {
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);   // for debug mode
        context.drawImage(this.image,
            this.frameX * this.width,    // source(image) x
            this.frameY * this.height,   // source(image) y
            this.width,                  // source(image) width
            this.height,                 // source(image) height
            this.x,                      // canvas position x
            this.y,                      // canvas position y
            this.width,                  // canvas width
            this.height);                // canvas height
    }
    // return true if the player is on ground and false if the player is in the air
    onGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    setState(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }
    checkCollision() {
        this.game.enemies.forEach(enemy => {
            if (enemy.x < this.x + this.width && enemy.x + enemy.width > this.x && enemy.y + enemy.height > this.y && enemy.y < this.y + this.height) {
                // collision detected
                enemy.markedForDeletion = true;
                this.game.score += 1;
            } else {
                // no collision
            }
        });
    }
}