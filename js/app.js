// general class for game characters
var Character = function(x, y, speed) {
    'use strict';
    // set character position and speed
    this.x = x;
    this.y = y;
    this.speed = speed;
    
    // variable is used to choose character image
    this.sprite = null;
};

// Draw the character on the screen, required method for game
Character.prototype.render = function() {
    'use strict';
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    'use strict';
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    Character.call(this, x, y, speed);
    
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// set enemy prototype from character's
Enemy.prototype = Object.create(Character.prototype);

// make enemy class give enemy object instead of ch
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    'use strict';
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    
    // check collisions between player and enmies
    this.checkCollisions();

    //making enemies at start point again as soon as they reach the end of the canvas
    if (this.x >= 505) {
        this.x = -100;
    }
};

// handle collision between enemy and player
// restart the game and reset lives and level if lives reach zero
Enemy.prototype.checkCollisions = function() {
    'use strict';
    
    if (this.y <= player.y + 41 && this.x >= player.x - 63  &&         
        this.y >= player.y - 62 && this.x <=  player.x + 65) {
        lives--;
        if (lives == 0) {
            level = 1;
            lives = 5;
        }
        intializeLevel(level);
        updateGameInfo();
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, speed) {
    'use strict';
    // player position info
    // player step distance
    Character.call(this, x, y, speed);
    
    // player image
    this.sprite = 'images/char-boy.png';
};

// set player prototype from character's
Player.prototype = Object.create(Character.prototype);

// make player class give enemy object instead of ch
Player.prototype.constructor = Player;

// Update the player's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    'use strict';
    // Not needed method
};

// handle arrow button (player movement)
Player.prototype.handleInput = function(key) {
    'use strict';
    
    if (key == 'left') 
        this.x -= this.speed;
    
    if (key == 'right') 
        this.x += this.speed;
    
    if (key == 'up') 
        this.y -= this.speed - 0.2 * this.speed;
    
    if (key == 'down') 
        this.y += this.speed - 0.2 * this.speed;
    
    // prevent the player from crossing canvas borders
    if (this.y > 382) 
        this.y = 382;
    
    if (this.x > 402) 
        this.x = 402;
    
    if (this.x < 2)
        this.x = 2;
    
    // when player reach the water, move to the next level
    if (player.y <= -17) {
        intializeLevel(++level);
        lives += 2;
        updateGameInfo();
    }
};

// set palayer default position
const PLAYER_DEFAULT_X = 202;
const PLAYER_DEFAULT_Y = 382;

// set level and lives
var updateGameInfo = function() {
    gameInfo.innerHTML = 'Level :' + level + " - Lives: " + lives;
};

// initialize game level
var intializeLevel = function(level) {
    // empty allEnemies array
    allEnemies = new Array();
    
    // make ememies object and push it into allEnemies array
    for (var i = 0; i < level; i++) { 
        
        var enemy = new Enemy(-100, 
            Math.floor(Math.random() * Math.floor(3)) * 80 + 60, 
            Math.floor(Math.random() * Math.floor(level-1)) * 50 + 50);
        
        allEnemies.push(enemy);
    }
    
    // put player character on the default position
    player.x = PLAYER_DEFAULT_X;
    player.y = PLAYER_DEFAULT_Y;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = new Array();
var player = new Player(PLAYER_DEFAULT_X, PLAYER_DEFAULT_Y, 100);
var level = 1;
var lives = 5;
var gameInfo = document.createElement('p');

intializeLevel(level);
document.body.appendChild(gameInfo);
updateGameInfo();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// handle control arrows which is displayed on mobile screens
window.onload = function() {
    document.getElementById("left-btn").addEventListener("touchstart", function() {
        player.handleInput('left');
    }, false);

    document.getElementById("right-btn").addEventListener("touchstart", function() {
        player.handleInput('right');
    }, false);

    document.getElementById("up-btn").addEventListener("touchstart", function() {
        player.handleInput('up');
    }, false);

    document.getElementById("down-btn").addEventListener("touchstart", function() {
        player.handleInput('down');
    }, false);
};