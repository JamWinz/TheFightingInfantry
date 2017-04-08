var game = (function() {

  console.log("Initilizing game.js");
  var count = 0;//FOR SCORE
  var fallSpeed = 500;
  var enemySpeed = 500;
  var health = 100;
  var currentPower, powerName;


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

            //Clear row function
            function clearRow(){
              for(var i = 0; i <= 10; i++) {
                if(i === 10){
                  for(var j = 0; j < 10; j++) {
                    grid[activerow][j] = null;
                  }
                  count+=10;
                  //$('#score').text(updateScore());
                  //console.log("Score is " + count);


                  //grid[activerow][activecol] = false;
                  //grid[activerow][activecol+1] = false;

                  // DROP REMAINING BLOCKS
                  for(var k = grid.length-1; k > 0; k--) {

                    for(var l = 10; l >= 0; l--) {
                      if(grid[k][l] === true) {
                        grid[k+1][l] = true;
                        grid[k][l] = null;
                      }
                    }

                  }
                }
                else if(grid[activerow][i] === true) {
                  console.log("There is a block in row " + i);
                }
                else {
                  break;
                }
              }
            }

            function randomPiece(num) {
              var rng = Math.floor(Math.random() * num);

              return rng;
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
              createBlock(0, 5);
              createEnemy(14, 5);
            }


            function findPowerUp(row, col){
              if(grid[activerow+row][activecol+col] === 1){
                currentPower = 'images/helicopter.png';
                powerName = "Boat";
                //console.log("There is a " + currentPower + " in front of you!");

                // This code jumps player 3 blocks
                /*
                console.log("You board the boat, you sail forward 2 tiles.")
                grid[activerow][activecol] = null;
                activerow = activerow + 3;
                grid[activerow][activecol] = 0;
                */

                count++;

              }
              else if(grid[activerow+row][activecol+col] === 2){
                currentPower = 'images/explosion.png';
                powerName = "Lightning";
                health = (health - 15);
                console.log("Struck by lightning, you lost 25hp!\nCurrent health is: " + health)

                //console.log("There is a " + currentPower + " in front of you!");
                count++;
              }
            }

            function moveLeft() {
              if (activerow !== null && activecol !== null && activecol-1 >= 0 && activecol-1 <= 9 && grid[activerow][activecol-1] !== true) {
                findPowerUp(0, -1);
                grid[activerow][activecol] = null;
                activecol--;
                grid[activerow][activecol] = 0;
                //console.log(activecol)
                console.log(powerName + " THIS IS CURRENT POWER");
                notify();
              }
            }

            function moveRight() {
              if (activerow !== null && activecol !== null && activecol+1 >= 0 && activecol+1 <= 9 && grid[activerow][activecol+1] !== true) {
                findPowerUp(0, 1);
                grid[activerow][activecol] = null;
                activecol++;
                grid[activerow][activecol] = 0;
                //console.log(activecol)
                //$('#powerUpBox').addClass('player').html(currentPower);
                console.log(powerName + " THIS IS CURRENT POWER");
                notify();
              }
            }

            function moveDown() {
              if (activerow !== null && activecol !== null && activerow+1 >= 0 && activerow+1 <= 14 && grid[activerow+1][activecol] !== true) {
                findPowerUp(1, 0);
                grid[activerow][activecol] = null;
                activerow++;
                grid[activerow][activecol] = 0;
                //console.log(activerow);
                //$('#powerUpBox').addClass('player').html(currentPower);
                console.log(powerName + " THIS IS CURRENT POWER");

                notify();
              }
            }

            function moveUp() {
              if (activerow !== null && activecol !== null && activerow-1 >= 0 && activerow-1 <= 14 && grid[activerow-1][activecol] !== true) {
                findPowerUp(-1, 0);
                grid[activerow][activecol] = null;
                activerow--;
                grid[activerow][activecol] = 0;
                //console.log(activerow)
                //$('#powerUpBox').addClass('player').html(currentPower);
                console.log(powerName + " THIS IS CURRENT POWER");
                notify();
              }
            }

            function moveDiagLeftDown() {
              if (activerow !== null && activecol !== null && activerow+1 >= 0 && activerow+1 <= 14 && grid[activerow+1][activecol] !== true
                    && activecol-1 >= 0 && activecol-1 <= 9 && grid[activerow][activecol-1] !== true) {
                grid[activerow][activecol] = null;
                activerow++;
                activecol--;
                grid[activerow][activecol] = 0;
                console.log(activerow)

                findPowerUp(1, 0);
              }
            }

            function moveDiagRightDown() {
              if (activerow !== null && activecol !== null && activerow+1 >= 0 && activerow+1 <= 14 && grid[activerow+1][activecol] !== true
                    && activecol+1 >= 0 && activecol+1 <= 9 && grid[activerow][activecol+1] !== true) {
                grid[activerow][activecol] = null;
                activerow++;
                activecol++;
                grid[activerow][activecol] = 0;
                console.log(activerow)

                findPowerUp(1, 0);
              }
            }

            function moveDiagLeftUp() {
              if (activerow !== null && activecol !== null && activerow-1 >= 0 && activerow-1 <= 14 && grid[activerow-1][activecol] !== true
                    && activecol-1 >= 0 && activecol-1 <= 9 && grid[activerow][activecol-1] !== true) {
                grid[activerow][activecol] = null;
                activerow--;
                activecol--;
                grid[activerow][activecol] = 0;
                console.log(activerow)

                findPowerUp(1, 0);
              }
            }

            function moveDiagRightUp() {
              if (activerow !== null && activecol !== null && activerow-1 >= 0 && activerow-1 <= 14 && grid[activerow-1][activecol] !== true
                    && activecol+1 >= 0 && activecol+1 <= 9 && grid[activerow][activecol+1] !== true) {
                grid[activerow][activecol] = null;
                activerow--;
                activecol++;
                grid[activerow][activecol] = 0;
                console.log(activerow)

                findPowerUp(1, 0);
              }
            }

            function autoComplete() {
              for(var i = grid.length-1; i > 0; i--) {
                for(var j = 10; j >= 0; j--) {
                    grid[i][j] = true;
                  }
                }
            }


            function loadPowerups() {
              var rngArr = [1, null, null, null, 1, 2, null, null, null, null];

              for(var i = 0; i < 15; i++) {
                for(var j = 0; j < 10; j++) {
                  rng = randomPiece(10);
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
                  // we reached the bottom
                  clearInterval(interval);

                //createBlock(0, 4); FOR ENEMY MOVEMENT
                }
                  notify();
                //Clear a complete row
                clearRow();


            }, fallSpeed);
        }

        function enemyMove() {
          var dir;
          var hPos = 0;
          var vPos = 0;
          dir = Math.floor(Math.random() * 2);

          if(dir === 0) { // Left
            hPos = -1;
          }
          else if(dir === 1) { // Right
            hPos = 1;
          }

          return hPos;
        }

        function createEnemy(row, col){
          var enemyDir;
        //  $('#score').text(updateScore());
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
                  fallSpeed = 10000000000;
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
            //  console.log("ENEMY COL " + enemycol)
              grid[enemyrow][enemycol] = null;
              if(enemyDir === 0 && enemycol) {
                enemyrow--;
                grid[enemyrow][enemycol] = 0;
              }
              else if(enemyDir === 1 && enemycol >= 0 && enemycol-1 >= 0 && enemycol+1 <= 9) {
                enemycol--;
                grid[enemyrow][enemycol] = 0;
              }
              else if(enemyDir === 2 && enemycol < 10 && enemycol-1 >= 0 && enemycol+1 <= 9) {
                enemycol++;
                grid[enemyrow][enemycol] = 0;
              }
              else{
                console.log("Attempted to go Out of bounds");
                if(enemycol === 9){
                  enemycol--;
                  grid[enemyrow][enemycol] = 0;
                }
                else if(enemycol === 0){
                    enemycol++;
                    grid[enemyrow][enemycol] = 0;
                }
              }
            }
        }, enemySpeed);
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
              moveDiagLeftDown: moveDiagLeftDown,
              moveDiagRightDown: moveDiagRightDown,
              moveDiagRightUp: moveDiagRightUp,
              moveDiagLeftUp: moveDiagLeftUp,
              autoComplete: autoComplete,
              clearRow: clearRow,
              updateScore: updateScore,
              createGrid: createGrid,
              setEnemySpeed: setEnemySpeed,
              getEnemySpeed: getEnemySpeed,
              setHealthBar: setHealthBar,
              getHealthBar: getHealthBar
            };

})();
