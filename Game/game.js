
var game = (function() {
  console.log("Initilizing game.js");
  // Audio
  var explo = new Audio('sounds/explosion.wav');
  var heli = new Audio('sounds/helicopter.wav');
  var sand = new Audio('sounds/sand.wav');
  var bullet = new Audio('sounds/bullet.wav');
  var heal = new Audio('sounds/Heal8-Bit.ogg');
  var gren = new Audio('sounds/Bomb_Exploding.wav');
  var eject_clip = new Audio('sounds/Eject_Clip.wav');
  var ak47 = new Audio('sounds/AK47.wav');
  var gun_empty = new Audio('sounds/Gun+Empty.wav');

  var finTime = 0; // Holds time player took to beat the game in seconds
  var count = 0; // Counts the score
  var enemySpeed = 750; // enemy speed
  var health = 100; // Player hp
  var currentPower, powerName;
  var rand = Math.floor(Math.random() * 10);
  var pause = false;
  var keyPress = null; // Holds current key press
  var canMove = false; // Check if player is able to move
  var delayInterval;
  var canShoot = false; // Check if player is able to shoot
  var currGif = null; // holds the current image to be displayed based on power up
  var prevGif = null; // stores the previous gif displayed
  var gameOver = false; // is true when game is finished


  // This function is on an interval that changes (stopTime) depending on the powerup/down the player steps on
  function waitBeforeMove(stopTime) {
    canMove = false;
    setTimeout(function() {
      canMove = true;
      if(keyPress === "up") {
        moveUp();
      }
      else if(keyPress === "down") {
        moveDown();
      }
      else if(keyPress === "left") {
        moveLeft();
      }
      else if(keyPress === "right") {
        moveRight();
      }
      keyPress = null;
    }, stopTime);
  }
  waitBeforeMove();

  // Dynamically created grid
  function createGrid(nrow, ncol) {
    grid = [];
    grid.length = nrow;
    for (var i = 0; i < nrow; i++) {
      grid[i] = [];
      grid[i].length = ncol;
    }
    notify();
  }

  // Turn score variable in a string to be displayed
  function updateScore() {
    return count.toString();
  }

  // Set the Enemy Speed
  function setEnemySpeed(enemySpeed2) {
    enemySpeed = enemySpeed2;
  }

  // Get the Enemy Speed
  function getEnemySpeed(){
    return enemySpeed;
  }

  // Set Health Bar
  function setHealthBar(health2) {
    health = health2;
  }

  // Get Health Bar
  function getHealthBar(){
    return health;
  }

  // Player & Enemy start as null
  var activerow = null;
  var activecol = null;
  var enemyrow = null;
  var enemycol = null;


  // Function that starts such features as counting time, creating player and enemy objects
  function startGame() {
    setInterval(function() {
      if(gameOver === false){
      finTime++;
    }
    }, 1000);
    createBlock(0, 5);
    createEnemy(14, rand);
  }

  // Sends current gif to index
  function getGif() {
    notify();
    return currGif;
  }

  // Sends time player took to finish came to index
  function getFinTime() {
    return finTime;
  }

  // Returns false if game is in progress / true otherwise
  function getGameOver() {
    return gameOver;
  }

  // Powerups/Downs
  function findPowerUp(row, col) {
    notify();
    // Helicopter
    if(grid[activerow+row][activecol+col] === 1) {
      currGif = 1;
      prevGif = 1;
      heli.play();
      powerImage = 'images/helicopter.gif';
      powerClass = 'scaledPower'
      currentPower = "<td>" + "<img class='" + powerClass + "' src='" + powerImage + "'>" + "</td>"
      powerName = "Helicopter";
      stopTime = 0;
      // Sends player down 2 blocks
      if(activerow+2 < 14) {
        console.log("You board the helicopter, you sail forward 2 tiles.")
        grid[activerow+row][activecol+col] = null;
        grid[activerow][activecol] = null;
        activerow = activerow + 2;
        grid[activerow][activecol] = 0;
        findPowerUp(1, 0)
      }
      // If player is close to the end (2 blocks or less then the helicopter does not perform the 2 block jump)
      else if(activerow+2 === 13) {
        grid[activerow][activecol] = null;
        grid[14][activecol] = 0;
        findPowerUp(1, 0)
      }
      count+=2;
    }
    // Explosion
    else if(grid[activerow+row][activecol+col] === 2) {
      currGif = 2;
      explo.play();
      powerImage = 'images/explosion.gif';
      powerClass = 'scaledPower'
      currentPower = "<td>" + "<img class='" + powerClass + "' src='" + powerImage + "'>" + "</td>"
      health = (health - 25); // Lost 25hp
      console.log("You encounter an explosion! , you lost 15hp!\nCurrent health is: " + health)
      stopTime = 1000;
      count-=3;
    }
    // Health
    else if(grid[activerow+row][activecol+col] === 3) {
      currGif = 3;
      heal.play();
      powerImage = 'images/health.png';
      powerClass = 'scaledPower'
      console.log("You gain " + health + " hp!")
      currentPower = "<td>" + "<img class='" + powerClass + "' src='" + powerImage + "'>" + "</td>"
      // If health is less than or equal to 90, simply give +10 hp
      if(health <= 90) {
      health = (health + 10);
    }
      // If the health will give you over 100% then we make sure it only gives you the amount that will put you at 100
      else if(health > 90 && health < 100) {
        health = (health + (100-health));
      }
      stopTime = 500;
      count+=3;
    }
    // Quicksand
    else if(grid[activerow+row][activecol+col] === 4) {
      currGif = 4;
      sand.play();
      health = (health - 5);
      powerImage = 'images/quicksand.gif';
      powerClass = 'scaledPower'
      currentPower = "<td>" + "<img class='" + powerClass + "' src='" + powerImage + "'>" + "</td>"
      powerName = "Quicksand";
      clearInterval(delayInterval);
      stopTime = 2000; // Freeze player for 2 seconds
      count-=2;
    }
    // Grenade
    else if(grid[activerow+row][activecol+col] === 5) {
      currGif = 5;
      gren.play();
      powerImage = 'images/grenade.png';
      powerClass = 'scaledPower'
      currentPower = "<td>" + "<img class='" + powerClass + "' src='" + powerImage + "'>" + "</td>"
      powerName = "Grenade";
      playerTimeOut = 0;
      count-=2;
      stopTime = 500;
    }
    // Rifle
    else if(grid[activerow+row][activecol+col] === 6){
      currGif = 6;
      eject_clip.play();
      powerImage = 'images/Sniper_Rifle2.png';
      powerClass = 'scaledPower'
      currentPower = "<td>" + "<img class='" + powerClass + "' src='" + powerImage + "'>" + "</td>"
      powerName = "Sniper_rifle";
      stopTime = 500;
      count+=3;
      canShoot = true; // Player may shoot the gun
    }
    // Ensures Helicopter gif if displayed correctly when you ride a helicopter to a null block
    else if(grid[activerow+row][activecol+col] === null && prevGif === 1) {
      currGif = 1;
      prevGif = null;
      stopTime = 500;
    }
    // If no powerup then show nothing and set stopTime to default (500)
    else if(grid[activerow+row][activecol+col] === null) {
      currGif = null;
      stopTime = 500;
    }
    // Game complete if player reaches the end, or health is 0
    if(activerow-1 === 13 || health <= 0) {
      gameOver = true;
    }
    console.log("PLAYER TIMEOUT: " + stopTime);
    return stopTime;
  }

  // Variable to slow movement ( linked timeout function )
  var moveTimeOut;
  function moveLeft() {
    // If player collides with enemy
    if(grid[activerow][activecol] === grid[enemyrow][enemycol]){
      count -= 5;
      gameOver = true;
    }
    else if(canMove){
      if (activerow !== null && activecol !== null && activecol-1 >= 0 && activecol-1 <= 9 && grid[activerow][activecol-1] !== true) {
        findPowerUp(0, -1);
        grid[activerow][activecol] = null;
        activecol--;
        grid[activerow][activecol] = 0;
        waitBeforeMove(stopTime);
        console.log(powerName + " THIS IS CURRENT POWER");
        notify();
      }
    }
    else {
      keyPress = "left";
    }
  }

  function moveRight() {
    // If player collides with enemy
    if(grid[activerow][activecol] === grid[enemyrow][enemycol]){
      count -= 5;
      gameOver = true;
    }
    else if(canMove){
      if (activerow !== null && activecol !== null && activecol+1 >= 0 && activecol+1 <= 9 && grid[activerow][activecol+1] !== true) {
        findPowerUp(0, 1);
        grid[activerow][activecol] = null;
        activecol++;
        grid[activerow][activecol] = 0;
        waitBeforeMove(stopTime);
        console.log(powerName + " THIS IS CURRENT POWER");
        notify();
      }
    }
    else {
      keyPress = "right";
    }
  }

  function moveDown() {
    // If player collides with enemy
    if(grid[activerow][activecol] === grid[enemyrow][enemycol]){
      count -= 5;
      gameOver = true;
    }
    else if(canMove){
      if (activerow !== null && activecol !== null && activerow+1 >= 0 && activerow+1 <= 14 && grid[activerow+1][activecol] !== true) {
        var stopTime = findPowerUp(1, 0);
        grid[activerow][activecol] = null;
        activerow++;
        //clearInterval(moveInterval);
        grid[activerow][activecol] = 0;
        waitBeforeMove(stopTime);
        console.log(powerName + " THIS IS CURRENT POWER");
        notify();
      }
    }
    else {
      keyPress = "down";
    }
  }

  function moveUp() {
    // If player collides with enemy
    if(grid[activerow][activecol] === grid[enemyrow][enemycol]){
      count -= 5;
      gameOver = true;
    }
    else if(!canMove){
      keyPress = "up";
    }
    else {
      if (activerow !== null && activecol !== null && activerow-1 >= 0 && activerow-1 <= 14 && grid[activerow-1][activecol] !== true) {
        findPowerUp(-1, 0);
        grid[activerow][activecol] = null;
        activerow--;
        grid[activerow][activecol] = 0;
        waitBeforeMove(stopTime);
        console.log(powerName + " THIS IS CURRENT POWER");
        notify();
      }
    }
  }
  // Shot bullet
  function shoot() {
    // If canshoot is true then we shoot
    if(canShoot) {
      ak47.play();
      var bulletRow = activerow;
      var bulletCol = activecol;
      var destroyedPower;
      stopTime = 500;
      clearInterval(shootInterval);
      var shootInterval = setInterval(function() {
          // While the bullet falls we cannot move
          if (bulletRow < 14) {
              currGif = 6;
              canMove = false;
              bulletRow++;
              // Store the powerup infront of the bullet in a variable
              destroyedPower = grid[bulletRow][bulletCol];
              // Show bullet in cell
              grid[bulletRow][bulletCol] = 9;
              console.log("Bullet is in row " + bulletRow);
              notify();
              // If NOT enemy, then once bullet has moved to next cell, we place the powerup stored in destroyedPower back into it's cell
                if(destroyedPower !== 8) {
                  grid[bulletRow][bulletCol] = destroyedPower;
                }
                // If enemy, then kill enemy
                else {
                  grid[bulletRow][bulletCol] = null;
                }
                // If bullet hit's enemy then kill enemy and spawn him at a random column in last row
              if(grid[bulletRow][bulletCol] === grid[enemyrow][enemycol]) {
                console.log("Bullet collision with enemy");
                count += 10;
                rand = Math.floor(Math.random() * 10);
                createEnemy(14, rand);
              }
          }
          // If the bullet is on the last row we clear it and allow player to move again
          else if(bulletRow === 14) {
            canMove = true;
            console.log("Removing bullet on row " + bulletRow + " col " + bulletCol)
            grid[bulletRow][bulletCol] = null;
            bulletRow++;
            notify();
          }
          canshoot = false;
      }, 250);
    }
    // If player has no ammo, show this with gif and play sound
    else{
      gun_empty.play();
      currGif = 7;
    }
    // Shot has been completed and canShoot is now false
    canShoot = false;
  }

  // Generate random number
  function randomPiece(num) {
    var rng = Math.floor(Math.random() * num);
    return rng;
  }

  // 1 = Helicopter 2 = Explosion 3 = Health 4 == Heart 5 = Grenade, 6 = Rifle
  function loadPowerups() {
    var rngArr = [2, 5, null, 1, 1, 2, null, null, 4, null, 3, null, null, 6, 4, null, null, null, 4, null, null, null, null, 2, 2];
    for(var i = 0; i < 15; i++) {
      for(var j = 0; j < 10; j++) {
        rng = randomPiece(25);
          if(!grid[i][j]){
            grid[i][j] = rngArr[rng];
            console.log("Filled tile");
          }
        }
      }
    }

  // Create Player Object
  function createBlock(row, col){
    loadPowerups();
    activerow = row;
    activecol = col;
    console.log(activerow + " " + activecol);
    id = grid[activerow][activecol] = 0;
    notify();
    var interval = setInterval(function() {
      if (activerow+1 === grid.length /*|| grid[activerow+1][activecol] === true*/) {
        clearInterval(interval);
      }
      notify();
    }, enemySpeed);
  }

  // Create enemy object
  function createEnemy(row, col){
    var enemyDir;
    enemyrow = row;
    console.log("THIS IS THE ENEMYCOL " + enemycol)
    enemycol = col;
    console.log(enemyrow + " " + enemycol);
    id = grid[enemyrow][enemycol] = true;
    notify();
    var enemyInterval = setInterval(function() {
      enemyDir = Math.floor(Math.random() * 3);
      if (enemyrow === 0) {
        // we reached the bottom
        clearInterval(enemyInterval);
        if (enemyrow !== 16 && gameOver === false) {
          // Increase fallspeed based on these conditions
          enemySpeed = 500; // 1000000000
          count-=5;
          console.log(enemyrow)
          createEnemy(14, 5);
          console.log("Enemy speed is " + enemySpeed)
        }
      }
      else {
        grid[enemyrow][enemycol] = null;
        if(enemyDir === 0 && enemycol) {
          enemyrow--;
          grid[enemyrow][enemycol] = 8;
        }
        else if(enemyDir === 1 && enemycol >= 0 && enemycol-1 >= 0 && enemycol+1 <= 9) {
          enemycol--;
          grid[enemyrow][enemycol] = 8;
        }
        else if(enemyDir === 2 && enemycol < 10 && enemycol-1 >= 0 && enemycol+1 <= 9) {
        //  enemycol++;
          grid[enemyrow][enemycol] = 8;
        }
        else{
          console.log("Enemy attempted to go Out of bounds");
          if(enemycol === 9){
            enemycol--;
            grid[enemyrow][enemycol] = 8;
          }
          else if(enemycol === 0){
            enemycol++;
            grid[enemyrow][enemycol] = 8;
          }
        }
      }
    }, enemySpeed);
  }

  // Empty the grid
  function clearGrid() {
    for(var i = 14; i >= 0; i--) {
      for(var j = 10; j >= 0; j--) {
        grid[i][j] = null;
      }
    }
  }

  var listeners = [];
  function addListener(cb) {
    listeners.push(cb);
    notify();
  }

  function notify() {
    for(var i = 0; i < listeners.length; i++){
      var cb = listeners[i];
      cb(grid, count, currentPower, health, gameOver, finTime);
    }
  }

  return {
    addListener: addListener,
    startGame: startGame,
    moveLeft: moveLeft,
    moveRight: moveRight,
    moveDown: moveDown,
    moveUp: moveUp,
    updateScore: updateScore,
    createGrid: createGrid,
    setEnemySpeed: setEnemySpeed,
    getEnemySpeed: getEnemySpeed,
    setHealthBar: setHealthBar,
    getHealthBar: getHealthBar,
    shoot: shoot,
    clearGrid: clearGrid,
    getGif: getGif,
    getGameOver, getGameOver,
    getFinTime, getFinTime
  };
})();
