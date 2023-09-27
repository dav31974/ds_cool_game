export class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height;
        this.vy = 0;         // vertical speed
        this.maxVy = 28;     // max vertical speed
        this.weight = 1;     // vertical weight gravity
        this.image = document.getElementById('player');
        this.frame = 0;      // horizontal frame of picture
        this.speed = 0;      // horizontal speed
        this.maxSpeed = 10;  // horizontal max speed
    }

    update(input) {
        // Horizontal movement ------------------
        this.x += this.speed;
        if (input.includes('ArrowRight')) this.speed = this.maxSpeed;
        else if (input.includes('ArrowLeft')) this.speed = -this.maxSpeed;
        else this.speed = 0;
        // horizontal limits
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        else if (this.x <= 0) this.x = 0;
        // Vertical movement ---------------------
        if (input.includes('ArrowUp') && this.onGround()) this.vy -= this.maxVy;
        this.y += this.vy;
        if (!this.onGround()) this.vy += this.weight;
        else this.vy = 0;
    }

    draw(context) {
        context.drawImage(this.image,
            this.frame * this.width,
            0,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height);
    }
    // return true if the player is on ground and false if the player is in the air
    onGround() {
        return this.y >= this.game.height - this.height;
    }
}