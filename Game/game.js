var game = (function() {

  console.log("Initilizing game.js");
  // Audio
  var explo = new Audio('sounds/explosion.wav');
  var heli = new Audio('sounds/helicopter.wav');
  var sand = new Audio('sounds/sand.wav');
  var bullet = new Audio('sounds/bullet.wav');
  var finTime = 0;
  // Counts the score
  var count = 0;
  var enemySpeed = 750;
  var health = 100;
  var currentPower, powerName;
  var rand = Math.floor(Math.random() * 10);;




  var canMove = false;
  var delayInterval;
  function waitBeforeMove(stopTime) {
    canMove = false;
    setTimeout(function() {
      canMove = true;
    }, stopTime);
  }
  waitBeforeMove();

  function createGrid(nrow, ncol) {
    grid = [];
    grid.length = nrow;
    for (var i = 0; i < nrow; i++) {
      grid[i] = [];
      grid[i].length = ncol;
    }
    notify();
  }

  function updateScore() {
    return count.toString();
  }

  // Enemy Speed
  function setEnemySpeed(enemySpeed2) {
    enemySpeed = enemySpeed2;
  }

  function getEnemySpeed(){
    return enemySpeed;
  }

  // Health Bar
  function setHealthBar(health2) {
    health = health2;
  }

  function getHealthBar(){
    return health;
  }


  var activerow = null;
  var activecol = null;

  var enemyrow = null;
  var enemycol = null;

  function startGame() {
    setInterval(function() {
      finTime++;
    }, 1000);
    createBlock(0, 5);
    createEnemy(14, rand);
  }

  function findPowerUp(row, col){

    if(grid[activerow+row][activecol+col] === 1){
      heli.play();
      powerImage = 'images/helicopter.png';
      powerClass = 'scaledPower'
      currentPower = "<td>" + "<img class='" + powerClass + "' src='" + powerImage + "'>" + "</td>"
      powerName = "Helicopter";
      stopTime = 0;

      if(activerow+2 < 14) {
        console.log("You board the helicopter, you sail forward 2 tiles.")
        grid[activerow+row][activecol+col] = null;
        grid[activerow][activecol] = null;
        activerow = activerow + 2;
        grid[activerow][activecol] = 0;
        findPowerUp(1, 0)
      }

      else if(activerow+2 === 14) {
        grid[activerow][activecol] = null;
        grid[13][activecol] = 0;
        findPowerUp(1, 0)
      }
      else {
        // Helicopter was on last row
      }
      count++;
    }
    else if(grid[activerow+row][activecol+col] === 2){
      explo.play();
      powerImage = 'images/explosion.png';
      powerClass = 'scaledPower'
      currentPower = "<td>" + "<img class='" + powerClass + "' src='" + powerImage + "'>" + "</td>"
      health = (health - 15);
      console.log("You encounter an explosion! , you lost 15hp!\nCurrent health is: " + health)
      stopTime = 1000;
      count-=3;
    }
    else if(grid[activerow+row][activecol+col] === 3){
      powerImage = 'images/health.png';
      powerClass = 'scaledPower'
      console.log("You gain " + health + " hp!")
      currentPower = "<td>" + "<img class='" + powerClass + "' src='" + powerImage + "'>" + "</td>"
      if(health <= 90) {
      health = (health + 10);
    }
      // If the health will give you over 100% then we make sure it only gives you the amount that will put you at 100
      else if(health > 90 && health < 100) {
        health = (health + (100-health));
      }
      stopTime = 500;
      count+=1;
    }
    else if(grid[activerow+row][activecol+col] === 4){
      sand.play();
      powerImage = 'images/quicksand.png';
      powerClass = 'scaledPower'
      currentPower = "<td>" + "<img class='" + powerClass + "' src='" + powerImage + "'>" + "</td>"
      powerName = "Quicksand";
      clearInterval(delayInterval);
      stopTime = 2000;
      count-=1;
    }
    else if(grid[activerow+row][activecol+col] === 5){
      powerImage = 'images/grenade.png';
      powerClass = 'scaledPower'
      currentPower = "<td>" + "<img class='" + powerClass + "' src='" + powerImage + "'>" + "</td>"
      powerName = "Grenade";
      playerTimeOut = 0;
      count++;
    }
    // If no power up default speed is set
    else if(grid[activerow+row][activecol+col] === null) {
      stopTime = 500;
    }
    console.log("PLAYER TIMEOUT: " + stopTime);
    return stopTime;
  }

  // Variable to slow movement ( linked timeout function )
  var moveTimeOut;
  function moveLeft() {
  if(canMove){
      if (activerow !== null && activecol !== null && activecol-1 >= 0 && activecol-1 <= 9 && grid[activerow][activecol-1] !== true) {
        findPowerUp(0, -1);
        grid[activerow][activecol] = null;
        activecol--;
        grid[activerow][activecol] = 0;
        waitBeforeMove(stopTime);
        //console.log(activecol)
        console.log(powerName + " THIS IS CURRENT POWER");
        notify();
      }
    }
  }

  function moveRight() {
  if(canMove){
      if (activerow !== null && activecol !== null && activecol+1 >= 0 && activecol+1 <= 9 && grid[activerow][activecol+1] !== true) {
        findPowerUp(0, 1);
        grid[activerow][activecol] = null;
        activecol++;
        grid[activerow][activecol] = 0;
        waitBeforeMove(stopTime);
        //console.log(activecol)
        //$('#powerUpBox').addClass('player').html(currentPower);
        console.log(powerName + " THIS IS CURRENT POWER");
        notify();
      }
    }
  }

  function moveDown() {
    if(canMove){
      if (activerow !== null && activecol !== null && activerow+1 >= 0 && activerow+1 <= 14 && grid[activerow+1][activecol] !== true) {
        var stopTime = findPowerUp(1, 0);
        grid[activerow][activecol] = null;
        activerow++;
        //clearInterval(moveInterval);
        grid[activerow][activecol] = 0;
        waitBeforeMove(stopTime);
        //console.log(activerow);
        //$('#powerUpBox').addClass('player').html(currentPower);
        console.log(powerName + " THIS IS CURRENT POWER");
        if(activerow === 14) {
          clearGrid();
          console.log($("#foodName").val())
          $("#nameBox").html($("#playerName").val());
          $("#finalScoreBox").html(count);
          $("#finalTimeBox").html(finTime + " Seconds");
          $("#endScreen").css("display", "block");
        }
        notify();
      }
    }
  }

  function moveUp() {
  if(canMove){
      if (activerow !== null && activecol !== null && activerow-1 >= 0 && activerow-1 <= 14 && grid[activerow-1][activecol] !== true) {
        findPowerUp(-1, 0);
        grid[activerow][activecol] = null;
        activerow--;
        grid[activerow][activecol] = 0;
        waitBeforeMove(stopTime);
        //console.log(activerow)
        //$('#powerUpBox').addClass('player').html(currentPower);
        console.log(powerName + " THIS IS CURRENT POWER");
        notify();
      }
    }
  }

  function shoot() {
      bullet.play();
      var bulletRow = activerow;
      var bulletCol = activecol;
      stopTime = 500;
      clearInterval(shootInterval);
      var shootInterval = setInterval(function() {
          // While the bullet falls we cannot move
          if (bulletRow < 14) {
              canMove = false;
              //waitBeforeMove(3000)
              bulletRow++;
              grid[bulletRow][bulletCol] = 9;
              console.log("Bullet is in row " + bulletRow);
              notify();
              grid[bulletRow][bulletCol] = null;

              if(grid[bulletRow][bulletCol] === grid[enemyrow][enemycol]){
                console.log("Bullet collision with enemy");
                count += 10;
                rand = Math.floor(Math.random() * 10);
                createEnemy(14, rand);
              }
          }
          // If the bullet is on the last row we clear it and allow player to move again
          else if(bulletRow === 14) {
            canMove = true;
            console.log("Removing bulelt on row " + bulletRow + " col " + bulletCol)
            grid[bulletRow][bulletCol] = null;
            bulletRow++;
            notify();
          }
      }, 250);
  }

  function randomPiece(num) {
    var rng = Math.floor(Math.random() * num);
    return rng;
  }

  // 1 = Helicopter 2 = Explosion 3 = Health 4 == Heart 5 = Grenade
  function loadPowerups() {
    var rngArr = [2, 5, null, 1, 1, 2, null, null, 4, null, 3, null, null, null, 4, null, null, null, 4, null, null, null, null, 2, 2];
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

  function createBlock(row, col){
    //  $('#score').text(updateScore());
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
        if (enemyrow !== 16) {
          // Increase fallspeed based on these conditions
          enemySpeed = 500; // 1000000000
          count-=1;
          console.log(enemyrow)
          createEnemy(14, 5);
          console.log("Enemy speed is " + enemySpeed)
        }
        else{
          //$('#gameover').text("GAME OVER");
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
      cb(grid, count, currentPower);
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
    clearGrid, clearGrid
  };
})();
